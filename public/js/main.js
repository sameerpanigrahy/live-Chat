const chatFrom=document.getElementById('chat-form')
const chatMessages=document.querySelector('.chat-messages')
const roomName=document.getElementById('room-name')
const userList=document.getElementById('users')

//Get username & room from URl
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})
const socket=io()

//join chat room
socket.emit("joinRoom",{username,room})

//get room & users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room)
    outputUserName(users)
})
//Message from server
socket.on('message',(message)=>{
    console.log(message)
    outputMessage(message)

    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
   

})

//message submit
chatFrom.addEventListener('submit',(e)=>{
    e.preventDefault()
  //get message text
    const msg=e.target.elements.msg.value;

    //emiting a message to server
    socket.emit("chatMessage",msg)

    //clear the input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus()
})

//Output message to Dom
function outputMessage(message){
    const div=document.createElement('div')
    div.classList.add('message')
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

//Add room name to DOM
function outputRoomName(room){
roomName.innerText=room
}
 
//ADD userList in DOM
function outputUserName(users){
    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join("")}`;
}