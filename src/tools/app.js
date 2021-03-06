const http=require("http")
const port=8888
const {generateAcceptValue }=require('./utils')

const server=http.createServer((req,res)=>{
  res.writeHead(200,{"Content-Type":"text/plain;charset=utf-8"})
  res.end("this is in end methods")
})

server.on("upgrade",function(req,socket){
  if(req.headers["upgrade"]!=="websocket"){
    socket.end("HTTP/1.1 400 Bad Request")
    return
  }

  // 读取客户端提供的Sec-WebSocket-Key
  const secWsKey = req.headers["sec-websocket-key"];
  // 使用SHA-1算法生成Sec-WebSocket-Accept
  const hash = generateAcceptValue(secWsKey);
  // 设置HTTP响应头
  const responseHeaders = [
    "HTTP/1.1 101 Web Socket Protocol Handshake",
    "Upgrade: WebSocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${hash}`,
  ];
  socket.write(responseHeaders.join("\r\n") + "\r\n\r\n");

})

server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);