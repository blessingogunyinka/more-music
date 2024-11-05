import { useState, useEffect } from "react" ; 
import musicLogo from '../svg/musicLogo.svg' ;
import "../styles/MusicTrackPage.css" ; 
import { Link, useLocation, useParams } from "react-router-dom";
import AddToPlaylistOptions from "./AddToPlaylistOptions";
import { MusicTrackModel } from "../models/track"
import { getTrackTimeMinAndSec } from "../utility/getTrackTimeMinAndSec";
import { fetchResponse } from "../network/fetchResponse";
import LoadingSpinner from "./LoadingSpinner";
const pixelWidth = require("string-pixel-width") ; 


type MusicTrackType = Omit<MusicTrackModel, "createdAt" | "updatedAt">


function MusicTrackPage() {

    const location = useLocation() ; 

    const { trackId } = useParams() ;
    
    const [trackData, setTrackData] = useState<MusicTrackType>() ; 

    const [trackDataLoading, setTrackDataLoading] = useState<JSX.Element>(
        <LoadingSpinner topProp="35%" leftProp="50%" positionProp="absolute" />
    ) ; 

    useEffect(() => {
        async function fetchTrackData() {
            try {
                                
                const response = await fetchResponse(`http://localhost:5000/api/track/${trackId}`, { method: "GET" }) ; 
                const data = await response.json() ; 
                setTrackData(data) ; 
                                            
            } catch (error) {
                setTrackDataLoading(
                    <div className="music-track-page-main-container">
                        <h2 className="music-track-page-error-message">
                            There was an error getting the track data. Try refreshing the page.
                        </h2>
                    </div>
                )
                console.log(error) ; 
            }
        }

        if (!location.state) {
            fetchTrackData() ; 
        } else {
            setTrackData(location.state.trackData) ;            
        }
    }, [])

    const trackNamePixelWidth: number = pixelWidth(trackData?.trackName, { font: 'Times New Roman', size: 16 }) ;

    let trackNameFontSize: string ; 

    if (trackNamePixelWidth >= 317) {
        trackNameFontSize = "3cqw" ; 
    } else if (trackNamePixelWidth <= 87) {
        trackNameFontSize = "7cqw" ;  
    } else {
        trackNameFontSize = (trackNamePixelWidth*(-4/260) + 8.51263).toString() + "cqw" ; 
    }

    return (
        <>  
            { trackData ?
            <div className="music-track-page-main-container">
                <div className="music-track-page-track-info-container">
                    <img
                        className="music-track-page-track-info-artwork" 
                        src={trackData?.artworkUrl100}
                    />                
                    <div className="music-track-page-track-info-title-container">
                            <h1 
                                className="music-track-page-track-info-name"
                                style={{ fontSize: trackNameFontSize }}
                            >
                                {trackData?.trackName}
                            </h1>                        
                    </div>

                </div>

                <div className="music-track-page-track-info-artist-album-release-length-container">
                    <div className="music-track-page-track-info-artist"><b>{trackData?.artistName}</b></div>
                    <span>•</span>
                    <div className="music-track-page-track-info-album">{trackData?.collectionName}</div>
                    <span>•</span>
                    <div className="music-track-page-track-info-release">{trackData?.releaseDate ? new Date(trackData?.releaseDate).getFullYear() : null}</div>
                    <span>•</span>
                    <div className="music-track-page-track-info-length">{location.state ? location.state.trackTime : getTrackTimeMinAndSec(trackData?.trackTimeMillis) }</div>
                </div>

                <div className="music-track-page-preview-audio-text">Preview</div>

                <audio
                    className="music-track-page-preview-audio-player" 
                    controls
                    src={trackData?.previewUrl}
                >
                </audio>
                
                { trackData ? 
                <AddToPlaylistOptions 
                    marginProp={"80px 0px"} 
                    trackData={trackData} 
                />
                : null
                }
            
            </div> : trackDataLoading }
            
            <Link to="../">
                <img
                    className="music-track-page-more-music-logo" 
                    src={musicLogo}  
                />
            </Link>            
        </>
    ) ; 
}
 
export default MusicTrackPage ; 