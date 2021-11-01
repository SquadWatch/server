import { Router } from "express";
import { createRoom } from "../database/rooms";
import authenticate from "../middlewares/authenticate";

const router = Router()


// create room
router.post("/",authenticate, (req, res) => {
    const room = createRoom(req.user.id);
    res.send(room)
})


export default router;