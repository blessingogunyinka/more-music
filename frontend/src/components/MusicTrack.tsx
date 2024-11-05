import React from 'react'
import "../styles/MusicTrack.css" ; 
import { Link } from 'react-router-dom' ; 
import AddToPlaylistOptions from './AddToPlaylistOptions' ;
import RemoveFromPlaylistOptions from "./RemoveFromPlaylistOptions"
import { MusicTrackModel } from "../models/track"
import { TiDeleteOutline } from 'react-icons/ti';
import { getTrackTimeMinAndSec } from '../utility/getTrackTimeMinAndSec';


type MusicTrackType = Omit<MusicTrackModel, "createdAt" | "updatedAt">

interface MusicTrackProps {
    isPlaylistPage: boolean,
    trackData: MusicTrackType
    searchResultNumber: number
    removeTrackFromPlaylist?: (removedTrackId: number) => boolean 
}


function MusicTrack({ isPlaylistPage, trackData, searchResultNumber, removeTrackFromPlaylist }: MusicTrackProps) {
    
    const { trackId, artistName, collectionName, trackName, 
            previewUrl, artworkUrl100, releaseDate, 
            trackExplicitness, trackTimeMillis } = trackData ; 
    
    const isExplicit = trackExplicitness === "explicit" ? true : false ; 

    const artistsStyles = isExplicit ? { marginLeft: 23, bottom: 17 } : {}

    const trackTime = getTrackTimeMinAndSec(trackTimeMillis) ; 

    const [playlistOptionsDisplay, setPlaylistOptionsDisplay] = React.useState("none") ; 


    function handlePlaylistOptionsButton(event: React.MouseEvent<HTMLInputElement> & React.MouseEvent<SVGElement, MouseEvent>) {
        event.preventDefault() ; 

        const display = playlistOptionsDisplay === "none" ? "flex" : "none" ; 

        setPlaylistOptionsDisplay(display) ; 
    }

    function handleRemoveFromPlaylistButton(event: React.MouseEvent<HTMLInputElement>) {
        event.preventDefault() ; 

    }
    
    const [addToPlaylistOption, setAddToPlaylistOption]= React.useState({
        addToExistingPlaylist: false, createNewPlaylistToAddTo: false 
    }) ; 

    function handleClickAddToPlaylistOption(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.preventDefault() ; 
        const input = event.target as HTMLElement ;

        if (input) {
            if (input.className === "music-track-playlist-options-add-to-existing-playlist-button") {
                const replacementObject = { 
                    addToExistingPlaylist: addToPlaylistOption.addToExistingPlaylist || true, 
                    createNewPlaylistToAddTo: false
                }
                setAddToPlaylistOption(replacementObject)
            } else {
                const replacementObject = { 
                    addToExistingPlaylist: false, 
                    createNewPlaylistToAddTo: addToPlaylistOption.createNewPlaylistToAddTo || true
                }
                setAddToPlaylistOption(replacementObject)
            }
        }
    }

    return (
        <>
            <div
                className="music-track-main-container" 
                style={{ display: "contents" }}
            >
                <Link
                    to={`../track/${trackId}`}
                    state={ { trackData, trackTime }}
                    style={{ display: "contents" }} 
                >
                    <div className="music-track-stack-container">

                        <div className="music-track-list-number">{searchResultNumber}</div>
                        
                        <div className="music-track-title-container">
                            <div className="music-track-artwork-container">
                                <img
                                    className="music-track-artwork" 
                                    src={artworkUrl100}
                                />
                            </div>
                            <div className="music-track-title-stack">
                                <div className="music-track-name"><b>{trackName}</b></div>
                                {isExplicit && <div className="music-track-explicitness"><span>E</span></div>}
                                <div className="music-track-artists" style={artistsStyles}>{artistName}</div>
                            </div>
                        </div>

                        <div className="music-track-album">{collectionName}</div>

                        <div className="music-track-length">{trackTime}</div>
                        
                        { isPlaylistPage ?
                        <TiDeleteOutline 
                            size="28px"
                            className="music-track-remove-from-playlist-delete-icon"  
                            onClick={handlePlaylistOptionsButton}                                       
                        />
                        :  
                        <div 
                            className="music-track-add-to-playlist-options-button"
                            onClick={handlePlaylistOptionsButton}
                        >
                            •••
                        </div> }
                    </div>
                </Link>
                { isPlaylistPage && removeTrackFromPlaylist ? 
                <RemoveFromPlaylistOptions 
                    displayProp={playlistOptionsDisplay} 
                    trackId={trackData.trackId}
                    removeTrackFromPlaylist={removeTrackFromPlaylist}
                />                                
                : 
                <AddToPlaylistOptions 
                    displayProp={playlistOptionsDisplay} 
                    trackData={trackData} 
                /> 
                }
            </div> 
        </>
    ) ; 
} 
 
export default MusicTrack ;
