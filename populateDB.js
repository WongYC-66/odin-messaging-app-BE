const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require('bcrypt')

if (process.env.NODE_ENV !== 'production')
    require('dotenv').config()

const main = async () => {
    console.log("starting to populate db...")

    const admin1 = await prisma.user.create({
        data: {
            username: 'admin1',
            password: bcrypt.hashSync('admin1', 10),
            email: 'admin1@example.com',
            firstName: 'Admin1',
            lastName: 'BBB',
        },
    })
    const admin2 = await prisma.user.create({
        data: {
            username: 'admin2',
            password: bcrypt.hashSync('admin2', 10),
            email: 'admin2@example.com',
            firstName: 'Admin2',
            lastName: 'CCC',
        },
    })
    const admin3 = await prisma.user.create({
        data: {
            username: 'admin3',
            password: bcrypt.hashSync('admin3', 10),
            email: 'admin3@example.com',
            firstName: 'Admin3',
            lastName: 'DDD',
        },
    })
    const user1 = await prisma.user.create({
        data: {
            username: 'user1',
            password: bcrypt.hashSync('user1', 10),
            email: 'user1@example.com',
            firstName: 'John',
            lastName: 'Doe',
        },
    })
    const user2 = await prisma.user.create({
        data: {
            username: 'user2',
            password: bcrypt.hashSync('user2', 10),
            email: 'user2@example.com',
            firstName: 'Amy',
            lastName: 'Baba',
        },
    })
    const user3 = await prisma.user.create({
        data: {
            username: 'user3',
            password: bcrypt.hashSync('user3', 10),
            email: 'user2@example.com',
            firstName: 'Zack',
            lastName: 'Hershall',
        },
    })

    console.log("done populating db...")
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });