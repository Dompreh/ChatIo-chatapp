const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let usernames=[]



app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', function(socket){
    console.log('Socket Connected...')

    socket.on('new user', function(data, callback){
        if(usernames.indexOf(data) != -1){
            callback(false)
        }
        else{
            callback(true)
            socket.username= data
            usernames.push(socket.username)
            updateUsernames()
        }
    })

    //update username
    function updateUsernames(){
        io.sockets.emit("usernames", usernames)
    }

    //Send message
    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg: data, user:socket.username})
    })

    socket.on("disconnect", function(data){
        if(!socket.username){
            return
        }
        usernames.splice(usernames.indexOf(socket.username), 1)
        updateUsernames()
    })
})


server.listen(process.env.PORT || 8000)
console.log("Server is running...")

