import { InferSchemaType, Schema, model } from "mongoose";


const musicTrackSchema = new Schema({
    trackId: { type: Number, required: true },
    artistName: { type: String, required: true },
    collectionName: { type: String, required: true },
    trackName: { type: String, required: true },
    previewUrl: { type: String, required: true },
    artworkUrl100: { type: String, required: true },
    releaseDate: { type: String, required: true },
    trackExplicitness: { type: String, required: true }, 
    trackTimeMillis: { type: Number, required: true },
}, { _id: false, timestamps: true }) ; 


const playlistSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String },
    tracks: [musicTrackSchema],
}, { timestamps: true }) ; 

type Playlist = InferSchemaType<typeof playlistSchema> ; 

export default model<Playlist>("Playlist", playlistSchema) ; 



