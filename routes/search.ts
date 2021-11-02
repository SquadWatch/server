import { Router } from "express";
import { createUser } from "../database/users";
import authenticate from "../middlewares/authenticate";
import { searchYoutube, searchChannelVideos } from "../youtubeClient";

const router = Router()


// search
router.get("/:value", async (req, res) => {
    const value = req.params.value;
    if (!value || !value.trim()) {
        res.json([]);
        return;
    }
    if (value.startsWith("channel:")) {
        const id = value.split("channel:")[1];
        res.json(await searchChannelVideos(id))
        return;
    }
    res.json(await searchYoutube(value))

})


export default router;