const express = require("express");
const app = express();
const server= require("http").createServer(app);
const io = require("socket.io").listen(server).sockets;


app.get("/",(req,res) => {
    res.sendFile(__dirname + "/index.html");
});

let connectedUser = [];

// socket.io  connect
io.on("connection",socket => {
    console.log("a user connected");
    updateUserName(); 
    let userName = "";

    // Login
    socket.on('login',(name,callback) => {
        if (name.trim().length === 0) {
            return;
        }
        callback(true);
        userName = name;
        connectedUser.push(userName);

       // console.log(connectedUser);
        updateUserName(); 

    });

    // 接受信息
    socket.on("chat message", msg => {
        console.log(msg);

        // Emit message  data
        io.emit('output', {
            name: userName,
            msg: msg
        });
    });

    // Disconnect
    socket.on("disconnect",() => {
        console.log("user disconnected");
        connectedUser.splice(connectedUser.indexOf(userName),1);

        //console.log(connectedUser);
        updateUserName();
    });

    // Update username
    function updateUserName() {
        io.emit('loadUser',connectedUser);
    }

});

const port = process.env.PORT || 5000;

server.listen(port,() => console.log("启动服务器成功端口号:" + port));