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

        const allUsers = await prisma.chat.findMany({
            where: { username: { not: authData.user.username } },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
            orderBy: { firstName: 'asc' }
        });

        // console.log(allUsers)

        res.json({
            message: 'getting all user_list',
            allUsers,
        })

    } catch (e) {
        console.error('prisma error or invalid JWToken : ', e)
        return res.json({
            error: "invalid token, please sign in again.",
        })
    }
});

exports.post_new_msg = asyncHandler(async (req, res, next) => {
    //todo
});

exports.create_new_chat = asyncHandler(async (req, res, next) => {
    //todo
});
