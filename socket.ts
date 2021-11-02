import {Server} from 'socket.io';
import { addConnectedUserToRoom, debugRooms, emitRoomDetails, getRoom, queueVideo, removeUserFromRoom } from './database/rooms';
import { addSocketIdToUser, debugUsers, getUserByToken, removeSocket, User } from './database/users';

export let io:Server = null as any;

export const initSocketIO = (server: any) => {
    io = new Server(server, {transports: ["websocket"]});


    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        const roomId = socket.handshake.auth.roomId;
        if (!token) {
          next(new Error("NO_TOKEN"));
          return;
        }
        const user = getUserByToken(token);
        if (!user) {
          next(new Error("INVALID_TOKEN"));
          return;
        }
        if (!getRoom(roomId)) {
          next(new Error("INVALID_ROOM_ID"));
          return;
        }
        socket.join(user.id);
        socket.join(roomId);
        addSocketIdToUser(user.id, socket.id, roomId);
        addConnectedUserToRoom(roomId, user.id)
        next();
      });
      
      io.on("connection", socket => {
        const token = socket.handshake.auth.token;
        const roomId = socket.handshake.auth.roomId;
        const user = getUserByToken(token) as User;
        console.log("connected!")
        emitRoomDetails(roomId, user.id, socket.id)
        socket.on("disconnect", () => {
            console.log("disconnected!")
            removeSocket( user.id, socket.id)
            if (!user.connectedRoomIds.includes(roomId)) {
                removeUserFromRoom(roomId, user.id)
            }
        })
        socket.on("QUEUE_VIDEO", (payload: {videoId: string}) => {
          queueVideo(roomId, payload.videoId)
        })
      })
      


}

