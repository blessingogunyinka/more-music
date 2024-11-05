import { MusicTrackModel } from "./track"

export interface PlaylistModel {
    _id: string,
    name: string,
    description?: string,
    tracks: Array<MusicTrackModel>,
    createdAt: string,
    updatedAt: string
}