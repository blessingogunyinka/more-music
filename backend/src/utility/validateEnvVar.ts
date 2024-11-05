import { cleanEnv } from "envalid" ; 
import { port, str } from "envalid/dist/validators"


export default cleanEnv(process.env, {
    MONGODB_ATLAS_CONNECTION_STRING: str(),
    PORT: port(),
    EXPRESS_SESSION_SECRET: str()
})