import FlakeId from '@brecert/flakeid'
import { io } from '../socket';

import {getQueueVideoDetails, getVideoDetails} from '../youtubeClient'
const flake = new FlakeId({
  mid: 42,
  timeOffset: (2013 - 1970) * 31536000 * 1000
});

type Await<T> = T extends PromiseLike<infer U> ? U : T


type QueueVideo = Await<ReturnType<typeof getQueueVideoDetails>>;
type Video = Await<ReturnType<typeof getVideoDetails>>;
export interface Room {
  id: string
  creatorId: string
  connectedUserIds: string[]
  queue: QueueVideo[],
  nowPlaying: {
    video: Video | null,
    startedTimestamp: null | number
    skipped: number
  }
}
const rooms: { [key: string]: Room } = {};


export const debugRooms = () => rooms;


export const createRoom = (creatorId: string) => {
  const id = flake.gen().toString();
  const room: Room = {
    id: id,
    creatorId,
    connectedUserIds: [],
    nowPlaying: {
      video: null,
      startedTimestamp: null,
      skipped: 0
    },
    queue: []
  }
  rooms[id] = room;
  return room
}
export const getRoom = (roomId: string) => {
  return rooms[roomId]
}

export const addConnectedUserToRoom = (roomId: string, userId: string) => {
    if (rooms[roomId].connectedUserIds.includes(userId)) return;
    emitToRoom(roomId, "USER_JOIN", {userId})
    rooms[roomId].connectedUserIds.push(userId)
}
export const emitToRoom = (roomId: string, name: string, payload: any) => {
    io.to(roomId).emit(name, payload)
}
export const removeUserFromRoom = (roomId: string, userId: string) => {
    rooms[roomId].connectedUserIds = rooms[roomId].connectedUserIds.filter(id => id !== userId);
    emitToRoom(roomId, "USER_LEAVE", {userId})
}
export const emitRoomDetails = (roomId: string, userId: string, socketId: string) => {
    const participants = rooms[roomId].connectedUserIds.map((id) => {return{id}})
    const creatorId = rooms[roomId].creatorId
    io.to(socketId).emit("DETAILS", {room: {participants, creatorId}, me: {id: userId}});
}


export const queueVideo = async (roomId: string, videoId: string) => {
  const room = rooms[roomId];
  // nothing is queued, instantly play video
  if (!room.nowPlaying.video && !room.queue.length) {
    room.nowPlaying.video = await getVideoDetails(videoId);
    emitToRoom(room.id, "PREPARE_PLAY_VIDEO", room.nowPlaying)
    return;
  }

}