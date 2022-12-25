const express=require("express")
const path=require("path")
const http=require("http")
const app=express()
const socketio=require("socket.io")
const formatMessage=require('./utils/messages')
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/user')
const server=http.createServer(app)
const io=socketio(server)
require('dotenv').config();

//set Static folder
app.use(express.static(path.join(__dirname, "public")));
//run while client connect
const botName="LiveChat Bot"


io.on('connection',(socket)=>{
    socket.on('joinRoom',({username,room})=>{
   const user=userJoin(socket.id,username,room)
   socket.join(user.room)
//Wellcome current user
socket.emit('message',formatMessage(botName,'Welcome to Live chat'));
//Brodcast when a user is connect
socket.broadcast.to(user.room).emit("message",formatMessage(botName,`${user.username} has joined the chat`))

//send users & room
io.to(user.room).emit('roomUsers',{
    room:user.room,
    users:getRoomUsers(user.room)
})
    });
        
    //lition for chat message
    socket.on("chatMessage",(msg)=>{
        const user=getCurrentUser(socket.id)
       io.to(user.room).emit('message',formatMessage(user.username,msg))
    });
    //Run when client disconnet
    socket.on('disconnect',()=>{
        const user=userLeave(socket.id)
        if(user){
       io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`)) 
       
       //send users & room
       io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    })
        }
    }); 
});


const PORT=process.env.PORT
server.listen(PORT,()=>console.log(`server runnig on PORT ${PORT}`)) 