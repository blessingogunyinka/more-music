import express from "express" ; 
import * as TrackController from "../controllers/track.controller"


const router = express.Router() ; 

router.get("/:trackId", TrackController.getTrack) ; 

export default router ; 