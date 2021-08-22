var app = require('express')();
var http = require('http').createServer(app)
var io = require('socket.io')(http)
var debug = require('debug')('http')

// fake app
let list = []
let flag = false

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Client.html')
})

io.on('connection', (socket) => {

    console.log('a user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        list.filter((item, index) => {
            console.log('receive--', item.user, msg.receive)
            if (item.user == msg.receive) {
                io.to(item.id).emit('chat message', msg);
            }
            console.log('id--', item.user, msg.id)
            if (item.user == msg.id) {
                flag = true
            }
        })
        console.log('--', list, '--');

        if (!flag) {
            list.push({ user: msg.id, id: socket.id })
        }
        flag = false

    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });

});

http.listen(3100, () => {
    console.log('listen 3000 port ')
})