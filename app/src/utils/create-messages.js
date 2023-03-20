const formatTime = require('date-format');

const createMessage = (messageText, username) => {
    return {
        messageText,
        username,
        createAt: formatTime("dd/MM/yyyy - hh-mm-ss", new Date())
    }
}

module.exports = { createMessage };