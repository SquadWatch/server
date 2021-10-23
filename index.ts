import IO from 'socket.io';
import http from 'http';

const server = http.createServer();
const io = new IO.Server(server);

io.on("connection", socket => {
  console.log(socket.id)
})


server.listen(80, () => {
  console.log("Socket Server Listening on port 80")
})