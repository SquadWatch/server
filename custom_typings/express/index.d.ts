
declare namespace Express {
    interface Request {
        io: import("socket.io").Server
        user: import("../../database/users").User
    }
}