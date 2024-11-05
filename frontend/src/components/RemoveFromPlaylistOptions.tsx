import React from "react" ; 
import "../styles/RemoveFromPlaylistOptions.css"
import { fetchResponse } from "../network/fetchResponse";
import { useParams } from "react-router-dom";


interface RemoveFromPlaylistOptionsProps {
    displayProp: string
    trackId: number
    removeTrackFromPlaylist: (removedTrackId: number) => boolean 
}

export default function RemoveFromPlaylistOptions({ displayProp, trackId, removeTrackFromPlaylist }: RemoveFromPlaylistOptionsProps) {

    const params = useParams() ; 

    const [removeTrackResult, setRemoveTrackResult] = React.useState<boolean>() ; 


    async function handleClickRemoveTrack(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.preventDefault() ; 
        
        try {

            const playlistId = params.playlistId ; 
            
            const response = await fetchResponse(`http://localhost:5000/api/playlists/${playlistId}`, { 
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    deleteTracks: [trackId]
                }) 
            }) ; 

            const updatedPlaylist = await response.json() ; 

            const result = removeTrackFromPlaylist(trackId) ; 
    
            setRemoveTrackResult(result) ; 
            
        } catch (error) {
            setRemoveTrackResult(false) ; 
        }
    }


    return (
        <div
            className="music-track-remove-from-playlist-options"
            style={{ display: displayProp }}
        >
            { removeTrackResult !== false ?
            <>
            <div
                className={`music-track-remove-from-playlist-confirmation-button${
                   false ? "-selected" : ""}`
                }
            >
                Are you sure you want to remove this track from this playlist?
            </div>

            <div 
                className="music-track-remove-from-playlist-remove-button"
                onClick={handleClickRemoveTrack}
            >
                Remove
            </div> 
            </>
            :  
            <div className="music-track-remove-from-playlist-front-end-error">
                Something went wrong, try refreshing the page.
            </div> 
            }
        </div>
    )
}
