import { Router } from "express";
import { createUser } from "../database/users";
import authenticate from "../middlewares/authenticate";

const router = Router()


// create user
router.post("/", (req, res) => {
    const token = createUser();
    res.send(token);
})


export default router;