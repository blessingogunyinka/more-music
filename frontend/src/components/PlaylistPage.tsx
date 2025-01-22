import { useContext, useEffect, useState } from 'react' ;
import '../styles/PlaylistPage.css' ;
import { Link, useParams } from 'react-router-dom' ;
import musicLogo from '../svg/musicLogo.svg' ;
import MusicTrack from './MusicTrack';
import { PlaylistModel as Playlist } from "../models/playlist"
import { fetchResponse } from '../network/fetchResponse';
import LoadingSpinner from './LoadingSpinner';
import { LoggedInUserContext } from './LoggedInUserProvider';


function PlaylistPage() {

    const { loggedInUser, setLoggedInUser } = useContext(LoggedInUserContext) ;

    const [playlist, setPlaylist] = useState<Playlist>() ;     

    const [playlistLoading, setPlaylistLoading] = useState<JSX.Element>(
        <LoadingSpinner topProp="35%" leftProp="50%" positionProp="absolute" />
    ) ; 

    const params = useParams() ; 

    const numOfTracks = playlist?.tracks.length ; 

    const totalPlaylistTimeMillis = playlist?.tracks.reduce((total, track) => {
        return total + track.trackTimeMillis ; 
    }, 0)


    function getTotalPlaylistTrackTime(trackTimeMilliseconds: number|undefined) {

        if (trackTimeMilliseconds) { 
            const trackTimeHours = Math.floor(trackTimeMilliseconds/3600000) ; 
            const trackTimeMinutes = Math.floor(trackTimeMilliseconds%3600000/60000) ; 
            const trackTimeSeconds = Math.floor(trackTimeMilliseconds%3600000%60000/1000) ; 

            const hoursMinutesSeconds = (trackTimeHours ? trackTimeHours.toString() + ` hour${trackTimeHours > 1 ? "s" + " " : ""}` : "")
            + (trackTimeMinutes ? trackTimeMinutes.toString() + ` min${trackTimeMinutes > 1 ? "s" + " " : ""}` : "")
            + (trackTimeSeconds ? trackTimeSeconds.toString() + " sec" : "")
            
            return hoursMinutesSeconds ; 
        }
        else {
            return null ; 
        }
        
    }


    function removeTrackFromPlaylist(removedTrackId: number): boolean {

        if (playlist) {
            const removedTrackIndex = playlist.tracks.findIndex(track => track.trackId === removedTrackId) ; 
            if (removedTrackIndex !== -1) {
                const updatedTracksArray = playlist?.tracks.slice() ; 
                updatedTracksArray.splice(removedTrackIndex, 1)
                const updatedPlaylist = { ...playlist, tracks: updatedTracksArray } ; 
                setPlaylist(updatedPlaylist) ;
                return true ; 
            } else {
                return false ; 
            }
        } else {
            return false ; 
        }
    }


    useEffect(() => {
        async function fetchPlaylist(playlistId: string) {
            try {
                const response = await fetchResponse(`${process.env.REACT_APP_BACKEND_URL}/api/playlists/${playlistId}`, { method: "GET" }) ; 
                const playlist = await response.json() ; 
                setPlaylist(playlist) ; 
            } catch (error) {
                setPlaylistLoading(
                    <div className="playlist-page-main-container">
                        <h2 className="playlist-page-error-message">
                            There was an error getting the playlist data.
                        </h2>
                    </div>
                )
            }
        }
 
        try {
            const playlistId = params.playlistId ;
            if (playlistId) {
                fetchPlaylist(playlistId) ; 
            } else {
                throw Error()
            }
        } catch (error) {
            setPlaylistLoading(
                <div className="playlist-page-main-container">
                    <h2 className="playlist-page-error-message">
                        Playlist ID is somehow undefined. Check the URL or try refreshing the page.
                    </h2>
                </div>
            )
        }
    }, [])
    

    return (
        <>
        { loggedInUser ?
        <>
            { !playlist ? playlistLoading : 
            <div className="playlist-page-main-container">

                <div className="playlist-page-playlist-info-container">

                    <div className="playlist-page-playlist-info-title-container">
                        <div className="playlist-page-playlist-info-playlist-text"><span>Playlist</span></div>
                        <h1 
                            className="playlist-page-playlist-info-name"
                        >
                            {playlist?.name}
                        </h1>
                        
                        <div className="playlist-page-playlist-info-description">{playlist?.description}</div>
                        <div className="playlist-page-playlist-info-details-container">
                            <div className="playlist-page-playlist-info-created-by">Created by <b>{loggedInUser.username}</b></div>
                            <span>•</span>
                            <div className="playlist-page-playlist-info-number-of-songs">{numOfTracks + ` song${numOfTracks !== 1 ? "s" : ""}`}</div>
                            { numOfTracks ? <span>•</span> : null }
                            <div className="playlist-page-playlist-info-total-length">
                                Total Playlist Time: {getTotalPlaylistTrackTime(totalPlaylistTimeMillis)}
                            </div>
                        </div>
                    </div>

                </div>

                
                { numOfTracks !== 0 ? 
                <div className="playlist-page-track-list-items-container">
                    <div className="playlist-page-track-list-items-header">
                        <p className="playlist-page-track-list-item-number">#</p>
                        <p className="playlist-page-track-list-item-title">Title</p>
                        <p className="playlist-page-track-list-item-album-name">Album</p>
                        <p className="playlist-page-track-list-item-length">Length</p>
                        <p className="playlist-page-track-list-item-add-to-playlist"></p>
                    </div>
                    { playlist?.tracks.map((track, index) => { 
                        return (                            
                            <MusicTrack 
                                isPlaylistPage={true} 
                                trackData={track} 
                                searchResultNumber={index+1}
                                removeTrackFromPlaylist={removeTrackFromPlaylist}
                            />                            
                        ) 
                    })}   
                </div> 
                : <h1>You don't have any songs in this playlist.</h1> 
                }            
            </div> 
            }

            <Link to="../">
                <img
                    className="playlist-page-more-music-logo" 
                    src={musicLogo}  
                />
            </Link>
        </>
        : 
        <>
        <div className="playlist-page-main-container">
            <h1 style={{ marginTop: "150px" }}>Please log in or sign up.</h1> 
        </div>
        <Link to="../">
            <img
                className="playlist-page-more-music-logo" 
                src={musicLogo}  
            />
        </Link>
        </> 
        }
        </>
    ) ;
}

export default PlaylistPage ;

