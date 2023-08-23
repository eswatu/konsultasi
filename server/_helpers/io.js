const socketIo = require('socket.io');
const Message = require('../model/message.model');
const config = require('../config.json');

const users = [];
const connections = [];

const initialize = server => {
    const io = socketIo(server, { path: '/chat'});

    io.on('connection', socket => {
        connections.push(socket);
        socket.to('chat-room');
        socket.emit('welcome', {
            msg: 'welcome to chat server'
        });
        socket.on('name', data=> {
            if (data.name) {
                socket.name = data.name;
                let user = {name:socket.name, id: socket.id};
                let existing = searchUser(user.name);
                if (!existing)  {
                    users.push(socket.username);
                    }
                io.emit('active', users);
                console.log(`[$s] connected`, socket.name);
                console.log('<users>:', users);
            }
        })

        socket.on('getactive', () => {
            io.emit('active', users);
        });

        socket.on('message', data=> {

        })
    })
}