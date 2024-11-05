import { RequestHandler } from "express";
import PlaylistModel from "../models/playlist.model" 
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { makeshiftSessionUserId } from "../controllers/user.controller" ;

export const getPlaylists: RequestHandler = async (req, res, next) => {

    const authUserId = makeshiftSessionUserId ; 

    try {
        if (!authUserId) {
            throw Error("Undefined user ID.")
        }
        const playlists = await PlaylistModel.find({ userId: authUserId }).exec() ; 
        res.status(200).json(playlists) ; 
    } catch (error) {
        next(error) ; 
    }
}

export const getPlaylist: RequestHandler = async (req, res, next) => {

    const playlistId = req.params.playlistId ; 
    const authUserId = makeshiftSessionUserId ;

    try {

        if (!authUserId) {
            throw Error("Undefined user ID.")
        }

        if (!mongoose.isValidObjectId(playlistId)) {
            throw createHttpError(400, "Playlist ID is invalid")
        }

        const playlist = await PlaylistModel.findById(playlistId).exec() ; 

        if (!playlist) {
            throw createHttpError(404, "The requested playlist was not found") ; 
        }

        if (!playlist.userId.equals(authUserId)) {
            throw createHttpError(401, "You are unauthorized to access this playlist") ; 
        }

        res.status(200).json(playlist) ; 
    } catch (error) {
        next(error) ; 
    }
}

type MusicTrack = {
    trackId: number,
    artistName: string,
    collectionName: string,
    trackName: string,
    previewUrl: string,
    artworkUrl100: string,
    releaseDate: Date,
    trackExplicitness: string, 
    trackTimeMillis: number
}

interface CreatePlaylistRequestBody {
    name?: string,
    description?: string,
    tracks?: Array<MusicTrack>,
}

export const createPlaylist: RequestHandler<unknown, unknown, CreatePlaylistRequestBody, unknown> = async (req, res, next) => {
    const { name } = req.body ; 
    const { description } = req.body ; 
    const { tracks } = req.body ; 
    const authUserId = makeshiftSessionUserId ;

    try {

        if (!authUserId) {
            throw Error("Undefined user ID.")
        }

        if (!name) {
            throw createHttpError(400, "To create a playlist, you must at least give it a name")
        }

        const newPlaylist = await PlaylistModel.create({
            userId: authUserId,
            name: name,
            description: description,
            tracks: tracks
        }) ; 

        res.status(201).json(newPlaylist) ; 
    } catch (error) {
        next(error) ; 
    }
}



interface UpdatePlaylistParams {
    playlistId: string
}

interface UpdatePlaylistRequestBody {
    name?: string,
    description?: string,
    addTracks?: Array<MusicTrack>,
    deleteTracks?: Array<number>,
}

export const updatePlaylist: RequestHandler<UpdatePlaylistParams, unknown, UpdatePlaylistRequestBody, unknown> = async (req, res, next) => {

    const playlistId = req.params.playlistId ; 
    const newName = req.body.name ; 
    const newDescription = req.body.description ; 
    const { addTracks, deleteTracks } = req.body ; 
    const authUserId = makeshiftSessionUserId ;

    try {

        if (!authUserId) {
            throw Error("Undefined user ID.")
        }

        if (!mongoose.isValidObjectId(playlistId)) {
            throw createHttpError(400, "Playlist ID is invalid")
        }

        const playlist = await PlaylistModel.findById(playlistId).exec() ; 

        if (!playlist) {
            throw createHttpError(404, "The playlist was not found")
        }

        if (!playlist.userId.equals(authUserId)) {
            throw createHttpError(401, "You are unauthorized to access this playlist") ; 
        }

        if (newName) {
            playlist.name = newName ; 
        }

        if (newDescription) {
            playlist.description = newDescription ; 
        }

        if (Array.isArray(addTracks) && addTracks.length > 0) {
            playlist.tracks.push(...addTracks)
        } 

        await playlist.save() ;

        if (Array.isArray(deleteTracks) && deleteTracks.length > 0) {

            await PlaylistModel.updateOne(
                { _id: playlistId },
                { $pull: { tracks: { trackId: { $in: deleteTracks } } } }
            )

        } 

        const updatedPlaylist = await PlaylistModel.findById(playlistId).exec() ; 

        res.status(200).json(updatedPlaylist) ; 
        
    } catch (error) {
        next(error) ;  
    }
}


export const deletePlaylist: RequestHandler = async (req, res, next) => {
    
    const playlistId = req.params.playlistId ; 
    const authUserId = makeshiftSessionUserId ;

    try {

        if (!authUserId) {
            throw Error("Undefined user ID.")
        }

        if (!mongoose.isValidObjectId(playlistId)) {
            throw createHttpError(400, "Playlist ID is invalid")
        }

        const playlist = await PlaylistModel.findById(playlistId).exec() ; 

        if (!playlist) {
            throw createHttpError(404, "The playlist was not found")
        }

        if (!playlist.userId.equals(authUserId)) {
            throw createHttpError(401, "You are unauthorized to access this playlist") ; 
        }

        await playlist.deleteOne() ; 

        res.sendStatus(204) ; 

    } catch (error) {
        next(error) ; 
    }

}

