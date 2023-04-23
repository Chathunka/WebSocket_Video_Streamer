const NodeWebcam = require('node-webcam');
const express = require("express");
const socketIo = require("socket.io");
const https = require("http");

const PORT = process.env.PORT || 5002;
const app = express();

const server = https.createServer(app);
const io = socketIo(server,{
    cors: {
      origin: "http://yourlocalip:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
}) //in case server and client run on different urls

// Set up the webcam options
const webcamOptions = {
  width: 320,
  height: 240,
  quality: 50,
  callbackReturn: "base64"
};

// Create a new webcam instance
const webcam = NodeWebcam.create(webcamOptions);

// Set up Socket.IO server
io.on("connection",(socket)=>{
    console.log("client connected: ",socket.id)
    
    socket.join("video")
    
    socket.on("disconnect",(reason)=>{
      console.log(reason)
    })
})


// Start capturing images from the webcam and emitting them to the client
setInterval(() => {
    webcam.capture('test', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            // Convert the image data to base64 format
            const base64Data = Buffer.from(data).toString('base64');
            io.to("video").emit("image", data)
        }
    });
}, 150);

server.listen(PORT, err=> {
    if(err) console.log(err)
    console.log("Server running on Port ", PORT)
  })
