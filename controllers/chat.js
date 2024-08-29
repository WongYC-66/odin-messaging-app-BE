const { PrismaClient } = require('@prisma/client')
const asyncHandler = require("express-async-handler");
var jwt = require('jsonwebtoken')

const prisma = new PrismaClient()
const { verifyTokenExist, extractToken } = require('./jwt.js')

exports.get_all_chats = asyncHandler(async (req, res, next) => {

    // if GET request is sent with valid token
    const token = extractToken(req)
    try {
        const authData = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!authData.user || !authData.user.username)
            throw new Error("invalid token")

        const allChats = await prisma.chat.findMany({
            where: {
                users: {
                    some: { id: Number(authData.user.id) },
                },
            },
            include: {
                messages: {
                    orderBy: {
                        timestamp: 'desc'
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    },
                    take: 1
                },
                users: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { lastUpdatedAt: 'desc' }
        });

        // console.log(allChats)
        // console.log(allChats[0].messages)

        res.json({
            message: 'getting all chats_list',
            allChats,
        })

    } catch (e) {
        console.error('prisma error or invalid JWToken : ', e)
        return res.json({
            error: "invalid token, please sign in again.",
        })
    }
});

exports.get_one_chat = asyncHandler(async (req, res, next) => {

    // if GET request is sent with valid token
    const token = extractToken(req)
    try {
        const authData = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!authData.user || !authData.user.username)
            throw new Error("invalid token")

        const chat = await prisma.chat.findFirst({
            where: {
                id: Number(req.params.chatId),
                users: {
                    some: {
                        id: authData.user.id // Ensure the user making the request is in the chat
                    }
                }
            },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                },
                messages: {
                    orderBy: {
                        timestamp: 'asc'
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    },
                },
            },
        });

        // console.log(chat)
        // if (chat.messages && chat.messages.length)
        //     console.log(chat.messages[0])

        if (!chat)
            throw new Error("invalid chatId or user has no access")

        res.json({
            message: `getting one chat by chatId : ${chat.id}`,
            chat,
        })

    } catch (e) {
        if (process.env.NODE_ENV != 'test')
            console.error('prisma error or ', e)
        return res.json({
            error: e.message,
        })
    }
});


exports.create_new_chat = asyncHandler(async (req, res, next) => {
    // if POST request is sent with valid token
    const token = extractToken(req)
    const jsonData = req.body
    // jsonData.userIds
    // jsonData.isGroupChat

    try {
        const authData = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!authData.user || !authData.user.username)
            throw new Error("invalid token")

        let existingChat = await prisma.chat.findFirst({
            where: {
                AND: [
                    {
                        users: {
                            every: {
                                id: { in: jsonData.userIds.map(Number) }
                            },
                        }
                    },
                    { isGroupChat: false },     // groupchat always create new
                ]
            },
        });

        if (!existingChat){
            // Not found, so create  a new chat / new group chat
            existingChat = await prisma.chat.create({
                data: {
                    name: '',
                    isGroupChat: jsonData.isGroupChat,
                    users: {
                        connect: jsonData.userIds.map(id => ({ id })),  // array of obj
                    },
                },
            })
        }
        // console.log(chat)

        res.json({
            message: 'chat room created',
            chat : existingChat,
        })

    } catch (e) {
        if (process.env.NODE_ENV != 'test')
            console.error('prisma error or invalid JWToken : ', e)
        return res.json({
            error: e.message,
        })
    }
});

exports.post_new_msg = asyncHandler(async (req, res, next) => {
    // if POST request is sent with valid token
    const token = extractToken(req)
    const jsonData = req.body
    // jsonData.userId
    // jsonData.text

    try {
        const authData = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!authData.user || !authData.user.username)
            throw new Error("invalid token")

        const chat = await prisma.chat.update({
            where: {
                id: Number(req.params.chatId),
                users: {
                    some: { id: Number(authData.user.id) } // Ensure the user is part of the chat
                }
            },
            data: {
                messages: {
                    create: {
                        text: jsonData.text,
                        userId: Number(jsonData.userId),
                    }
                },
                lastUpdatedAt: new Date()
            }
        });
        // console.log(chat)

        if (!chat)
            throw new Error("chatId not found or not authorized")

        res.json({
            message: `post one new message by chatId : ${chat.id}`,
            chat,
        })

    } catch (e) {
        if (process.env.NODE_ENV != 'test')
            console.error('prisma error or invalid JWToken : ', e)
        return res.json({
            error: e.message,
        })
    }
});


