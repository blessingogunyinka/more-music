import { useState, useEffect } from 'react' ; 
import MusicTrack from "./MusicTrack" ; 
import "../styles/SearchPage.css" ; 
import { MusicTrackModel } from "../models/track"
import SearchBar from './SearchBar' ;
import { Link } from 'react-router-dom' ;
import musicLogo from '../svg/musicLogo.svg' ;
import { useLocation, useSearchParams } from "react-router-dom" ;
import { fetchResponse } from '../network/fetchResponse';
import LoadingSpinner from './LoadingSpinner' ;


type MusicTrackType = Omit<MusicTrackModel, "createdAt" | "updatedAt">


function SearchPage() {

    const [searchParams, setSearchParams] = useSearchParams() ; 

    const searchParametersExist = Boolean(searchParams.has("q") && searchParams.get("q") !== "") ; 
    
    const location = useLocation() ; 

    const [searchData, setSearchData] = useState<Array<MusicTrackType>>() ; 

    const [searchResultsLoading, setSearchResultsLoading] = useState<JSX.Element|null>(null) ; 


    useEffect(() => {
        async function getSearchData(urlSearchQuery: string) {
            try {
                const response = await fetchResponse(`http://localhost:5000/api/search?q=${encodeURI(urlSearchQuery)}`, { method: "GET" })
                const data = await response.json() ; 
                setSearchData(data) ; 
            } catch(error) {
                setSearchResultsLoading(
                    <h2>There was an error getting the search results. Try refreshing the page.</h2>
                )
            }            
        }

        if (searchParametersExist) {
            const q = searchParams.get("q") ; 
            if (q) {
                setSearchResultsLoading(<LoadingSpinner topProp="35%" positionProp="absolute" />) ; 
                getSearchData(q) ; 
            }
        } else {
            setSearchResultsLoading(null) ; 
        }
    }, [location]) ; 

    return (
        <>
            <div className="search-page-center-stack-container">
                <div className="search-page-search-bar-container">
                    <SearchBar />
                </div>
                { !searchData ? searchResultsLoading :
                searchData.length !== 0 ?                
                <div className="search-page-track-list-items-container">
                    <div className="search-page-track-list-items-header">
                        <p className="search-page-track-list-item-number">#</p>
                        <p className="search-page-track-list-item-title">Title</p>
                        <p className="search-page-track-list-item-album-name">Album</p>
                        <p className="search-page-track-list-item-length">Length</p>
                        <p className="search-page-track-list-item-add-to-playlist"></p>
                    </div>                        
                    { searchData.map((trackObj, index) => { 
                        return (
                            <MusicTrack 
                                trackData={trackObj} 
                                isPlaylistPage={false}
                                searchResultNumber={index+1}
                            />
                        ) 
                    })}                        
                </div> 
                : <h1>No Results Found</h1> }
            </div>
            <Link to="../">
                <img
                    className="search-page-more-music-logo" 
                    src={musicLogo}  
                />
            </Link>            
        </>
    ) ; 
}
 
export default SearchPage ; 