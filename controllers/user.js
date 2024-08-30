const { PrismaClient } = require('@prisma/client')
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

const prisma = new PrismaClient()
const { verifyTokenExist, extractToken } = require('./jwt.js')

// Sign in with passport session authentication
exports.sign_in_post = asyncHandler(async (req, res, next) => {

    let jsonData = req.body
    // username 
    // password

    // username check
    let userExisted = await prisma.user.findFirst({
        where: { username: jsonData.username }
    })

    if (!userExisted) {
        return res.json({
            error: "username not found"
        })
    };

    const match = await bcrypt.compare(jsonData.password, userExisted.password);
    // password check 
    if (!match) {
        // passwords do not match!
        return res.json({
            error: "incorrect password"
        })
    }

    const user = await prisma.user.findFirst({
        where: { username: jsonData.username },
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            description: true,
            lastLoginAt: true,
        }
    })

    // success, send JWToken to client
    jwt.sign({ user }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' }, async (err, token) => {
        if (err) {
            return next(err)
        }
        
        // update user last sign-in
        await prisma.user.update({
            where: { username: user.username },
            data: { lastLoginAt: new Date() }
        })
        res.json({
            message: `success sign in for username : ${user.username}`,
            token
        })
    });

});

// Handles User Sign Up Post Request, proceed to register into database
exports.sign_up_post = asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.

    let jsonData = req.body
    // username 
    // password
    // confirmPassword
    // firstName
    // lastName

    // checking for errors :

    // 1. check if username been used
    let userExisted = await prisma.user.findFirst({
        where: { username: jsonData.username }
    })

    if (userExisted) {
        return res.json({
            error: "Username been used"
        })
    }

    // 2. check if password match with confirm password
    if (jsonData.password != jsonData.confirmPassword) {
        return res.json({
            error: "password doesn't match with confirm password"
        })
    }

    // no error, then encrypt user password and save to DB
    await prisma.user.create({
        data: {
            username: jsonData.username,
            password: bcrypt.hashSync(jsonData.password, 10),
            firstName: jsonData.firstName,
            lastName: jsonData.lastName,
        }
    });

    const user = await prisma.user.findFirst({
        where: { username: jsonData.username },
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            description: true,
            lastLoginAt: true,
        }
    })

    // success, send JWToken to client
    jwt.sign({ user }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' }, (err, token) => {
        if (err) {
            console.error("jwt error : ", err)
            return next(err)
        }

        res.json({
            message: `success sign up for username : ${user.username}`,
            token
        })
    });
})


// log out
exports.sign_out_get = asyncHandler(async (req, res, next) => {
    // delete front-end jwt
    res.json({ message: "logging out, token deleted" })
});

// get global profile list
exports.get_all_profiles = asyncHandler(async (req, res, next) => {

    // if GET request is sent with valid token
    const token = extractToken(req)
    try {
        const authData = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!authData.user || !authData.user.username)
            throw new Error("invalid token")

        const allUsers = await prisma.user.findMany({
            where: { username: { not: authData.user.username } },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                lastLoginAt: true,
            },
            orderBy: { firstName: 'asc' }
        });

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

// get one profile specific
exports.profile_get = asyncHandler(async (req, res, next) => {

    // if GET request is sent with valid token
    const token = extractToken(req)
    const username = req.params.username

    try {
        const authData = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!authData.user || !authData.user.username)
            throw new Error("invalid token")

        const queryUser = await prisma.user.findFirst({
            where: { username: username },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
                description: true,
                lastLoginAt: true,
            }
        })

        res.json({
            message: `getting one user by username : ${username}`,
            queryUser,
        })

    } catch (e) {
        console.error('prisma error or invalid JWToken : ', e)
        return res.json({
            error: "invalid token, please sign in again.",
        })
    }
});

// update one profile specific
exports.profile_update = asyncHandler(async (req, res, next) => {

    // if GET request is sent with valid token
    const token = extractToken(req)
    const username = req.params.username
    const jsonData = req.body

    try {
        const authData = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!authData.user || !authData.user.username)
            throw new Error("invalid token")

        if (authData.user.username != username)
            throw new Error("un-Authorized")

        const updatedUser = await prisma.user.update({
            where: { username: username },
            data: {
                firstName: jsonData.firstName,
                lastName: jsonData.lastName,
                description: jsonData.description,
                email: jsonData.email,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                description: true,
                lastLoginAt: true,
            }
        })

        res.json({
            message: `success updating one user by username : ${username}`,
            updatedUser,
        })

    } catch (e) {
        if (process.env.NODE_ENV != 'test')
            console.error('prisma error or invalid JWToken : ', e)
        return res.json({
            error: e.message,
        })
    }
});
