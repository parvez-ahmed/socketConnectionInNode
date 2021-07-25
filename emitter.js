const io = require("socket.io-client");
const socket = io("http://localhost:3000");
const data = require("./services/data");
const utils = require("./services/utils");
const sumCheckMessages = utils.convertRowDataWithHashKey(data);
const encryptMessgaes = utils.encryptMessages(sumCheckMessages);


function sendMessageToListener(message){
    socket.emit("MessageFromEmitterService",message);
}

socket.on("NotValidMessage",function(){
    console.log("Message that you have send is not valid at listener side")
})

function emitMessageAfter(message,time,func){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            func(message)
            resolve("All ok")
        },time)
    })
}

async function start(){
    for(let i=0;i<encryptMessgaes.length;i++){
        await emitMessageAfter(encryptMessgaes[i],10000,sendMessageToListener)
        console.log("after emit")
    }
}

start();
