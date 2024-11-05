import app from "./app" ; 
import env from "./utility/validateEnvVar"
import mongoose from "mongoose"


const port = env.PORT ; 

mongoose.connect(env.MONGODB_ATLAS_CONNECTION_STRING)
.then(() => {
    console.log("Mongoose connected") ; 
    app.listen(port, () => {
        console.log("Server running on port: " + port) ; 
    }) ; 
})
.catch(console.error)
