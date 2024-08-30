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
            lastName: 'A',
            description: 'This is admin1 description'
        },
    })
    const admin2 = await prisma.user.create({
        data: {
            username: 'admin2',
            password: bcrypt.hashSync('admin2', 10),
            email: 'admin2@example.com',
            firstName: 'Admin2',
            lastName: 'B',
            description: 'This is admin2 description'
        },
    })
    const admin3 = await prisma.user.create({
        data: {
            username: 'admin3',
            password: bcrypt.hashSync('admin3', 10),
            email: 'admin3@example.com',
            firstName: 'Admin3',
            lastName: 'C',
            description: 'This is admin3 description'
        },
    })
    const user1 = await prisma.user.create({
        data: {
            username: 'user1',
            password: bcrypt.hashSync('user1', 10),
            email: 'John Doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            description: 'Im John Doe, this is a fake description'
        },
    })
    const user2 = await prisma.user.create({
        data: {
            username: 'user2',
            password: bcrypt.hashSync('user2', 10),
            email: 'user2@example.com',
            firstName: 'Amy',
            lastName: 'Baba',
            description: 'Im Amy Baba, this is a fake description'
        },
    })
    const user3 = await prisma.user.create({
        data: {
            username: 'user3',
            password: bcrypt.hashSync('user3', 10),
            email: 'user2@example.com',
            firstName: 'Zack',
            lastName: 'Hershall',
            description: 'Im Zack Hershal, this is a fake description'
        },
    })
    const user4 = await prisma.user.create({
        data: {
            username: 'user4',
            password: bcrypt.hashSync('user', 10),
            email: 'user4@example.com',
            firstName: 'Yummy',
            lastName: 'Pringles',
            description: 'Im Yummy Pringles, this is a fake description'
        },
    })
    const user5 = await prisma.user.create({
        data: {
            username: 'user5',
            password: bcrypt.hashSync('user5', 10),
            email: 'user5@example.com',
            firstName: 'Ikea',
            lastName: 'Aeki',
            description: 'Im Ikea Aeki, this is a fake description'
        },
    })
    const user6 = await prisma.user.create({
        data: {
            username: 'user6',
            password: bcrypt.hashSync('user6', 10),
            email: 'user6@example.com',
            firstName: 'Toyota',
            lastName: 'Atoyot',
            description: 'Im Toyota, this is a fake description'
        },
    })
    const user7 = await prisma.user.create({
        data: {
            username: 'user7',
            password: bcrypt.hashSync('user7', 10),
            email: 'user7@example.com',
            firstName: 'Naruto',
            lastName: 'Abc',
            description: 'Im Naruto, this is a fake description'
        },
    })
    const user8 = await prisma.user.create({
        data: {
            username: 'user8',
            password: bcrypt.hashSync('user8', 10),
            email: 'user8@example.com',
            firstName: 'Sasuke',
            lastName: 'Python',
            description: 'psssst~~ this is a fake description'
        },
    })
    const user9 = await prisma.user.create({
        data: {
            username: 'user9',
            password: bcrypt.hashSync('user9', 10),
            email: 'user9@example.com',
            firstName: 'Momomo',
            lastName: 'Moooo',
            description: 'mooowww this is a fake description'
        },
    })
    const user10 = await prisma.user.create({
        data: {
            username: 'visitor',
            password: bcrypt.hashSync('visitor', 10),
            email: 'visitor@example.com',
            firstName: 'Visitor',
            lastName: 'V',
            description: 'Visitor description - fake'
        },
    })

    // chat room creating
    const chat1 = await prisma.chat.create({
        data: {
            name: '',
            isGroupChat: false,
            users: {
                connect: [
                    { id: admin1.id },
                    { id: admin2.id }
                ]
            },
            messages: {
                create: {
                    text: "hi this is chat1 , posted by admin1",
                    userId: admin1.id,
                }
            }
        },
    })
    // chat room creating
    const chat2 = await prisma.chat.create({
        data: {
            name: '',
            isGroupChat: false,
            users: {
                connect: [
                    { id: admin1.id },
                    { id: user3.id }
                ]
            },
            messages: {
                create: {
                    text: "hi this is chat2 , posted by user3",
                    userId: user3.id,
                }
            }
        },
    })
    // chat room creating
    const chat3 = await prisma.chat.create({
        data: {
            name: '',
            isGroupChat: false,
            users: {
                connect: [
                    { id: admin1.id },
                    { id: user1.id }
                ]
            },
            messages: {
                create: {
                    text: "hi this is chat3 , posted by user1",
                    userId: user1.id,
                }
            }
        },
    })
    // group chat room creating
    const chat4 = await prisma.chat.create({
        data: {
            name: 'testing group chat name',
            isGroupChat: true,
            users: {
                connect: [
                    { id: admin1.id },
                    { id: admin2.id },
                    { id: admin3.id },
                    { id: user1.id },
                    { id: user2.id },
                    { id: user3.id },
                ]
            },
            messages: {
                create: [
                    {
                        text: "hi this is groupchat message , posted by admin1",
                        userId: admin1.id,
                    },
                    {
                        text: "hi this is groupchat message , posted by admin2",
                        userId: admin2.id,
                    },
                ]
            }
        },
    })
    // chat room creating
    const chat5 = await prisma.chat.create({
        data: {
            name: '',
            isGroupChat: false,
            users: {
                connect: [
                    { id: admin2.id },
                    { id: admin3.id }
                ]
            },
            messages: {
                create: {
                    text: "hi this is chat5 , posted by admin2, admin1 shall have no access",
                    userId: admin2.id,
                }
            }
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