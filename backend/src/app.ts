import "dotenv/config" ; 
import express, { Request, Response, NextFunction } from "express" ; 
import playlistRoute from "./routes/playlist.route" ; 
import morgan from "morgan" ;  
import { isHttpError } from "http-errors";
const cors = require('cors') ;  
import searchRoute from "./routes/search.route" ; 
import trackRoute from "./routes/track.route" ; 
import userRoute from "./routes/user.route" ; 
import session from "express-session" ; 
import env from "./utility/validateEnvVar" ; 
import MongoStore from "connect-mongo";


const app = express() ; 

export const store = MongoStore.create({
    mongoUrl: env.MONGODB_ATLAS_CONNECTION_STRING
}) ; 

app.use(session({
    secret: env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*1.5,
    },
    rolling: true,
    store: store
})) ; 

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
}

app.use(cors(corsOptions)) ; 

app.use(morgan("dev")) ; 

app.use(express.json()) ; 

app.use("/api/users", userRoute) ;  

app.use("/api/playlists", playlistRoute) ;  

app.use("/api/search", searchRoute) ; 

app.use("/api/track", trackRoute) ; 

app.use(( error: unknown, req: Request, res: Response, next: NextFunction) => {
    
    console.error(error) ; 
    
    let errorMsg = "There was an undetermined error" ;  
    let httpStatusCode = 500 ;  

    if (isHttpError(error)) {
        httpStatusCode = error.status ; 
        errorMsg = error.message ; 
        if (httpStatusCode !== 404) {
            res.status(httpStatusCode).json({ error: errorMsg }) ; 
        } else {
            res.status(404).json({ error: "Could not find endpoint" }) ;
        }
    } 
    res.status(httpStatusCode).json({ error: errorMsg }) ; 
}) ; 
 
export default app ; 