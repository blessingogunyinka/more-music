import { useContext, useEffect, useState } from 'react' ;
import '../styles/MyPlaylistsPage.css' ;
import { Link } from 'react-router-dom' ;
import musicLogo from '../svg/musicLogo.svg' ;
import { PlaylistModel as Playlist } from "../models/playlist"
import { SubmitHandler, useForm } from "react-hook-form" ;
import LoadingSpinner from './LoadingSpinner';
import PlaylistSquare from './PlaylistSquare';
import { fetchResponse } from '../network/fetchResponse';
import { LoggedInUserContext } from './LoggedInUserProvider';


type FormInputEditOrCreateNew = {
    playlistName: string,
    playlistDescription: string
}

type FormAbled = {
    inputDisabled: boolean,
    submitEnabled: boolean
}

type SubmitStatus = {
    createNewPlaylist: { display: boolean, status: boolean|null, statusMsg: string|null }
}

function MyPlaylistsPage() {

    const { loggedInUser, setLoggedInUser } = useContext(LoggedInUserContext) ;
    
    const [playlists, setPlaylists] = useState<Array<Playlist>>() ; 

    const [playlistsLoading, setPlaylistsLoading] = useState<JSX.Element>(<LoadingSpinner />)

    const [displayForm, setDisplayForm] = useState<boolean>(false)
    
    const [formAbled, setFormAbled] = useState<FormAbled>({
        inputDisabled: false,
        submitEnabled: true
    }) ; 

    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
        createNewPlaylist: { display: false, status: null, statusMsg: null }
    }) ;

    const { register: registerCreateNew, 
        handleSubmit: handleSubmitCreateNew, 
        formState: { errors: errorsCreateNew },
        reset: resetCreateNew 
    } = useForm<FormInputEditOrCreateNew>() ;

    const onSubmitCreateNew: SubmitHandler<FormInputEditOrCreateNew> = async (data) => {
        
        try {

            const form = { 
                inputDisabled: true,
                submitEnabled: false
            }
    
            setFormAbled(form)
            
            const { playlistName, playlistDescription } = data ; 
            
            const response = await fetchResponse(`${process.env.REACT_APP_BACKEND_URL}/api/playlists/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: playlistName,
                    description: playlistDescription,
                })
            }) ; 

            const newPlaylist = await response.json() ; 
            
            let newPlaylistsArray: Array<Playlist> = [] ; 

            if (playlists) {
                newPlaylistsArray = [
                    ...playlists,
                    newPlaylist
                ]
            }

            setPlaylists(newPlaylistsArray) ; 

            const updatedSubmitStatus = {
                createNewPlaylist: { display: true, status: true, statusMsg: "Submission successful" }
            }
            setSubmitStatus(updatedSubmitStatus) ; 
           
        } catch (error) {

            const updatedSubmitStatus = {
                createNewPlaylist: { display: true, status: false, statusMsg: "Submission failed" }
            }
            setSubmitStatus(updatedSubmitStatus) ; 

        }

        const form = { inputDisabled: true, submitEnabled: true }
        
        setFormAbled(form)
        
    }


    function clearFormCreateNew() {

        const form = { inputDisabled: false, submitEnabled: true } ; 

        setFormAbled(form) ; 

        resetCreateNew() ; 

        const updatedSubmitStatus = {
            createNewPlaylist: { display: false, status: null, statusMsg: null }
        }

        setSubmitStatus(updatedSubmitStatus) ; 

    }

    useEffect(() => {
        async function getPlaylists() {
            try {
                const response = await fetchResponse(`${process.env.REACT_APP_BACKEND_URL}/api/playlists`, { method: "GET" }) ; 
                const playlists = await response.json() ; 
                setPlaylists(playlists)
            } catch (error) {
                setPlaylistsLoading(<h2>There was an error getting your playlists.</h2>)
                console.error(error) ;
            }
        }
        getPlaylists() ; 
    }, [])

    
    return ( 
        <>
            <div className="my-playlists-page-main-container">
                { loggedInUser ?
                <>
                <div className="my-playlists-page-my-playlists-text">My Playlists</div>
                <div 
                    className="my-playlists-page-create-new-playlist"
                    onClick={() => setDisplayForm(prev => !prev)}
                >
                    Create New Playlist
                </div>

                { displayForm ? 
                <>
                <form                     
                    className="my-playlists-page-create-new-playlist-form"
                    onSubmit={handleSubmitCreateNew(onSubmitCreateNew)}
                >
                    <textarea
                        className="my-playlists-page-create-new-playlist-form-input-name"
                        placeholder="Playlist name"
                        {...registerCreateNew('playlistName', { 
                            required: "Playlist name is required."
                        })} 
                        disabled={formAbled.inputDisabled}
                    />
                    { errorsCreateNew.playlistName && 
                    <div className="my-playlists-page-form-error-message">
                        {errorsCreateNew.playlistName.message}
                    </div>
                    }
                    <textarea
                        className="my-playlists-page-create-new-playlist-form-input-description"
                        placeholder="Description"
                        {...registerCreateNew('playlistDescription')} 
                        disabled={formAbled.inputDisabled}
                    />
                </form>

                { formAbled.submitEnabled ?
                <div 
                    className="my-playlists-page-create-new-playlist-submit-button"
                    onClick={handleSubmitCreateNew(onSubmitCreateNew)}
                >
                    Submit
                </div> : <LoadingSpinner marginTopProp="-20px" marginBottomProp="10px" positionProp="relative" /> 
                }

                { submitStatus.createNewPlaylist.display ?
                <> 
                    <div 
                        className={`my-playlists-page-create-new-playlist-submit-status-${
                            submitStatus.createNewPlaylist.status ? "success" : "failed"
                        }`}
                    >
                        <div>{submitStatus.createNewPlaylist.statusMsg}</div>
                    </div>
                    <div 
                        className="my-playlists-page-create-new-playlist-clear-form"
                        onClick={clearFormCreateNew}
                    >
                        Clear Form
                    </div>
                </>
                : null
                }

                </> : null }

                <div className="my-playlists-page-playlists-container">
                    { !playlists ? playlistsLoading 
                    : playlists.length !== 0 ? 
                    <> { playlists.map((playlist) => <PlaylistSquare playlist={playlist} />)} </>
                    : <h1>You don't have any playlists.</h1> }
                </div>
                </> 
                : 
                <>
                <div className="my-playlists-page-login-or-signup-text">Please log in or sign up.</div>
                </>
                }
            </div>
            <Link to="../">
                <img
                    className="my-playlists-page-more-music-logo" 
                    src={musicLogo}  
                />
            </Link>
        </>
    ) ;
}

export default MyPlaylistsPage ;

