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
                                lastName: true,
                                lastLoginAt: true,
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
                        lastName: true,
                        lastLoginAt: true,
                    }
                }
            },
            orderBy: { lastUpdatedAt: 'desc' }
        });

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
                        lastName: true,
                        lastLoginAt: true,
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
                                lastName: true,
                                lastLoginAt: true,
                            }
                        }
                    },
                },
            },
        });

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
    // jsonData.groupName

    try {
        const authData = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!authData.user || !authData.user.username)
            throw new Error("invalid token")
        if(jsonData.userIds.length <= 1)
            throw new Error("invalid action, too less users")

        let existingChat = await prisma.chat.findFirst({
            where: {
                users: {
                    every: {
                        id: { in: jsonData.userIds.map(Number) }
                    },
                },
                isGroupChat: false,   // check existing 1-to-1 chat
            },
        });

        const isGroupChat = jsonData.userIds.length <= 2 ? false : jsonData.isGroupChat 

        if (!existingChat || isGroupChat) {
            // Not found, so create  a new chat / new group chat
            existingChat = await prisma.chat.create({
                data: {
                    name: jsonData.isGroupChat ? jsonData.groupName : '',
                    isGroupChat: isGroupChat,
                    users: {
                        connect: jsonData.userIds.map(id => ({ id })),  // array of obj
                    },
                },
            })
        }

        res.json({
            message: 'chat room created',
            chat: existingChat,
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


