const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const messageController = require('./controllers/message');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 5000;

const router = require('./route');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);
app.use(cors());

io.on('connection', (socket) => {

    socket.on('join', async ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) return callback(error);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the ${user.room} room` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined` });

        socket.join(user.room);
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        callback();
    });

    socket.on('sendMessage', async (message, callback) => {
        const user = getUser(socket.id);
        if (user) {
            // time = new Date() + '';
            // let timeInt = parseInt(time);
            // let minutes = time.substring(3, 5);

            // if (time > '12:00') {
            //     return console.log(`${timeInt - 12}:${minutes} PM`);
            // } else {
            //     return console.log(`${timeInt}:${minutes} AM`);
            // }

            io.to(user.room).emit('message', { user: user.name, text: message });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

            let sent = await messageController.create(user.room, user.name, message);

        }

        callback();
    })

    // socket.on('deleteMessages', async (room, callback) => {
    //     if (room) {
    //         let deleted = await messageController.deleteAll(room);
    //     }

    //     callback();
    // })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `admin`, text: `${user.name} has left.` })
        }
    });
});


server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));