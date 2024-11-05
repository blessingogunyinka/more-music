import express from "express" ; 
import * as PlaylistController from "../controllers/playlist.controller"


const router = express.Router() ; 

router.get("/", PlaylistController.getPlaylists) ;  

router.get("/:playlistId", PlaylistController.getPlaylist) ; 

router.post("/", PlaylistController.createPlaylist) ; 

router.patch("/:playlistId", PlaylistController.updatePlaylist) ; 

router.delete("/:playlistId", PlaylistController.deletePlaylist) ; 

export default router ; 