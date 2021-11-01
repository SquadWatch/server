import FlakeId from '@brecert/flakeid'
import {sign, decode} from "jsonwebtoken";
import { io } from '../socket';
const flake = new FlakeId({
  mid: 42,
  timeOffset: (2013 - 1970) * 31536000 * 1000
});

export interface User {
  id: string
  socketIds: string[]
  roomIdBySocketId: {[key: string]: string},
  connectedRoomIds: string[]

}
const users: { [key: string]: User } = {};

export const debugUsers = () => users;

export const createUser = () => {
  const id = flake.gen().toString();
  const user: User = {
    id: id, socketIds: [], roomIdBySocketId: {}, connectedRoomIds: []
    
  }
  users[id] = user;
  const token = sign(id, "cool_secret_owo12idjsfgkhsdfgukhuk")
  return { user, token }
}

export const getUserByToken = (token: string) => {
  let userId: string | null = "";
  try {
    userId = decode(token) as string | null;
  } catch {}
  if (!userId) return undefined;
  return users[userId];
}

export const addSocketIdToUser = (userId: string, socketId: string, roomId: string) => {
  users[userId].socketIds.push(socketId);
  if (!users[userId].connectedRoomIds.includes(roomId)){
    users[userId].connectedRoomIds.push(roomId)
  }
  users[userId].roomIdBySocketId[socketId]= roomId;
}
export const removeSocket = (userId: string, socketId: string) => {
  const user = users[userId];
  const roomId = user.roomIdBySocketId[socketId];
  delete user.roomIdBySocketId[socketId];
  if (!Object.values(user.roomIdBySocketId).includes(roomId)) {
    user.connectedRoomIds = user.connectedRoomIds.filter(id => id !== roomId) 
  }
  user.socketIds = user.socketIds.filter((id) => id !== socketId)
}

export const emitToUser = (userid: string, name: string, payload: any) => {
  io.to(userid).emit(name, payload)
}