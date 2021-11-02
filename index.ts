import http from 'http';
import express from 'express';
import { initSocketIO, io } from './socket';

const app = express();
const server = http.createServer(app);

initSocketIO(server);

// routes
import users from './routes/users';
import rooms from './routes/rooms';
import search from './routes/search';


// setup cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
})

// add io to request
app.use((req, res, next) => {
  req.io = io;
  next();
})


app.use("/api/users", users);
app.use("/api/rooms", rooms);
app.use("/api/search", search);




server.listen(80, () => {
  console.log("Listening on port http://localhost:80")
})