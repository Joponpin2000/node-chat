const Message = require('../models/Message');

exports.create = async (room, sender, text) => {

    try {
        let newMessage = new Message({
            room,
            sender,
            text
        });

        newMessage = await newMessage.save();

        return newMessage;

    } catch (err) {
        return '';
    }
}

exports.readAll = async (room) => {
    try {
        const messages = await Message.find({ room });
        if (messages) {
            return messages;
        }
        else {
            return [];
        }


    } catch (err) {
        console.log(err);
        return [];
    }
}

exports.deleteAll = async (room) => {
    try {
        await Message.deleteMany({ room });
        return;
    } catch (err) {
        console.log(err);
        return;
    }
}