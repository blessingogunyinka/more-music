import express from "express" ; 
import * as SearchController from "../controllers/search.controller"


const router = express.Router() ; 

router.get("/", SearchController.searchTracks) ; 

export default router ; 