const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { faker } = require('@faker-js/faker');

const bcrypt = require('bcrypt')

if (process.env.NODE_ENV !== 'production')
    require('dotenv').config()

const main = async () => {
    console.log("starting to populate db...")

    const usernames = [
        'admin1', 'user1', 'user2', 'user3',
        'user4', 'user5', 'user6', 'user7',
        'user8', 'user9', 'user10', 'user11',
        'user12', 'user13', 'user14', 'guest',
    ]

    // 
    let promiseArr = usernames.map(async (name) => {
        let firstName = faker.person.firstName()
        let lastName = faker.person.lastName()
        return await prisma.user.create({
            data: {
                username: name,
                password: bcrypt.hashSync(name, 10),
                firstName,
                lastName,
                email: faker.internet.email({ firstName, lastName }),
                description: "fake bio generated from faker " + faker.person.bio(),
            },
        })
    })

    const usersArr = await Promise.all(promiseArr)


    // chat room creating
    const chat1 = await prisma.chat.create({
        data: {
            name: '',
            isGroupChat: false,
            users: {
                connect: [
                    { id: usersArr[0].id },
                    { id: usersArr[1].id }
                ]
            },
            messages: {
                create: {
                    text: "hi this is chat1 , posted by admin1",
                    userId: usersArr[0].id,
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
                    { id: usersArr[0].id },
                    { id: usersArr[3].id }
                ]
            },
            messages: {
                create: {
                    text: "hi this is chat2 , posted by user3",
                    userId: usersArr[3].id,
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
                    { id: usersArr[0].id },
                    { id: usersArr[1].id }
                ]
            },
            messages: {
                create: {
                    text: "hi this is chat3 , posted by user1",
                    userId: usersArr[1].id,
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
                    { id: usersArr[0].id },
                    { id: usersArr[1].id },
                    { id: usersArr[2].id },
                    { id: usersArr[3].id },
                    { id: usersArr[4].id },
                    { id: usersArr[5].id },
                ]
            },
            messages: {
                create: [
                    {
                        text: "hi this is groupchat message , posted by admin1",
                        userId: usersArr[0].id,
                    },
                    {
                        text: "hi this is groupchat message , posted by user1",
                        userId: usersArr[1].id,
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
                    { id: usersArr[2].id },
                    { id: usersArr[3].id }
                ]
            },
            messages: {
                create: {
                    text: "hi this is chat5 , posted by user2, admin1 shall have no access",
                    userId: usersArr[2].id,
                }
            }
        },
    })

    // Visitor Chat room creating, visitor index=15,  1-to-1
    const guestUser = usersArr.at(-1)
    let fiveRandomUsers = usersArr.slice(0, usersArr.length).sort(() => Math.random - 0.5).slice(0, 5)

    const chatPromises = fiveRandomUsers.map((user, i) =>
        prisma.chat.create({
            data: {
                name: '',
                isGroupChat: false,
                users: {
                    connect: [
                        { id: guestUser.id },
                        { id: fiveRandomUsers[i].id }
                    ]
                },
                messages: {
                    create: [
                        {
                            text: `hi, im ${user.firstName} ${user.lastName}. How are u?`,
                            userId: user.id,
                        },
                        {
                            text: `hi....`,
                            userId: guestUser.id,
                        }
                    ]
                }
            },
        })
    );

    // Vistor Group Chat room creating.
    let fourRandomUsers = usersArr.slice(0, usersArr.length).sort(() => Math.random - 0.5).slice(0, 4)
    const chat12 = await prisma.chat.create({
        data: {
            name: 'My Friends',
            isGroupChat: true,
            users: {
                connect: [
                    { id: fourRandomUsers[0].id },
                    { id: fourRandomUsers[1].id },
                    { id: fourRandomUsers[2].id },
                    { id: fourRandomUsers[3].id },
                    { id: guestUser.id },
                ]
            },
        },
    })
    const chatPromises2 = fourRandomUsers.map(user =>
        prisma.chat.update({
            where: { id: chat12.id },
            data: {
                messages: {
                    create: {
                        text: `hi, i am ${user.firstName} ${user.lastName}. ${faker.lorem.lines()}`,
                        userId: user.id,
                    },
                }
            },
        })
    );

    await Promise.all(chatPromises);
    await Promise.all(chatPromises2);

    console.log("done populating db...")
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });