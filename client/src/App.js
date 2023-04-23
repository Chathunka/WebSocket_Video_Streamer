import React from 'react'
import {io} from 'socket.io-client'


const App= ()=> {
  const [imagedata, setImagedata] = React.useState('fetching')  
  React.useEffect(()=>{
    const socket = io('http://yourlocalip:5002', {
      transports : ['websocket'] 
    });
    socket.on('connect', ()=>console.log(socket.id))
    socket.on('connect_error', ()=>{
      setTimeout(()=>socket.connect(),5002)
    })
   socket.on('image', (data)=>setImagedata(data))
   socket.on('disconnect',()=>setImagedata('server disconnected'))
 
 },[])
 return (
   <div className="App">
    <div>
      {imagedata ? (
        <img src={imagedata} alt="webcam" style={{width:'600px'}} />
      ) : (
        <p>No image data received yet</p>
      )}
    </div>
   </div>
 )
}
export default App;