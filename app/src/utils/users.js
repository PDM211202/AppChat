let userList = [
    {
        id: "1",
        username: "ND1",
        room: "r1"
    },
    {
        id: "2",
        username: "ND2",
        room: "r1"
    },
    {
        id: "3",
        username: "ND3",
        room: "r2"
    }
]

const addUser = (newUser) => (userList = [...userList, newUser]);
const removeUser = (id) => userList = userList.filter((user) => user.id !== id);

const getUserList = (room) => userList.filter((user) => user.room === room);

const findUser = (id) => userList.find((user) => user.id === id);

module.exports = {
    getUserList,
    addUser,
    removeUser,
    findUser
}