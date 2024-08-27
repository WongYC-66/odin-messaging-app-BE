const { PrismaClient } = require('@prisma/client')
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

// Sign in with passport session authentication
exports.sign_in_post = asyncHandler(async (req, res, next) => {

    let jsonData = req.body
    // username 
    // password

    // username check
    let user = await prisma.user.findFirst({
        where: { username: jsonData.username }
    })

    if (!user) {
        return res.json({
            error: "username not found"
        })
    };

    const match = await bcrypt.compare(jsonData.password, user.password);
    // password check 
    if (!match) {
        // passwords do not match!
        return res.json({
            error: "incorrect password"
        })
    }

    // remove sensitve information e.g password
    delete user.password
    delete user.email
    delete user.firstName
    delete user.lastName
    delete user.description

    // success, send JWToken to client
    jwt.sign({ user }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' }, (err, token) => {
        if (err) {
            return next(err)
        }
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

    let user = {
        username: jsonData.username,
        password: jsonData.password,
        firstName: jsonData.firstName,
        lastName: jsonData.lastName,
    }

    // checking for erros :

    // 1. check if username been used
    let userExisted = await prisma.user.findFirst({
        where: { username: user.username }
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
            username: user.username,
            password: bcrypt.hashSync(user.password, 10),
            firstName: user.firstName,
            lastName: user.lastName,
        }
    });

    // success, send JWToken to client
    jwt.sign({ user }, process.env.JWT_SECRET_KEY, (err, token) => {
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