import React, { useContext, useEffect, useState } from "react"
import "../styles/AddToPlaylistOptions.css" ; 
import { SubmitHandler, useForm } from "react-hook-form";
import { MusicTrackModel } from "../models/track"
import LoadingSpinner from "./LoadingSpinner";
import { PlaylistModel as Playlist } from "../models/playlist"
import { fetchResponse } from "../network/fetchResponse";
import { TiDeleteOutline } from "react-icons/ti";
import { UserModel } from "../models/user";
import { LoggedInUserContext } from './LoggedInUserProvider';


type MusicTrackType = Omit<MusicTrackModel, "createdAt" | "updatedAt">

interface AddToPlaylistOptionsProps {
    displayProp?: string
    marginProp?: string
    trackData: MusicTrackType
    loggedInUser?: UserModel|null
    setLoggedInUser?: React.Dispatch<React.SetStateAction<UserModel | null>>
}

type FormInputAddToExistingPlaylist = {
    playlistId: string
}

type FormInputCreateNewPlaylistToAddTo = {
    playlistName: string,
    playlistDescription: string
}

type FormState = {
    addToExistingPlaylist: {
        inputEnabled: boolean,
        submitEnabled: boolean
    },
    createNewPlaylistToAddTo: {
        inputDisabled: boolean,
        submitEnabled: boolean
    }
}

type PlaylistSelection = Playlist & {
    selected: boolean,
    alreadyContainsTrack: boolean
}

interface SubmitStatus {
    addToExistingPlaylist: { display: boolean, status: boolean|null, statusMsg: string|null }
    createNewPlaylistToAddTo: { display: boolean, status: boolean|null, statusMsg: string|null }
}


export default function AddToPlaylistOptions({ displayProp, marginProp, trackData }: AddToPlaylistOptionsProps) {

    const { loggedInUser, setLoggedInUser } = useContext(LoggedInUserContext) ;
    
    const [playlistSelections, setPlaylistSelections] = useState<Array<PlaylistSelection>>([]) ; 

    const [getPlaylistsError, setGetPlaylistsError] = useState<boolean>(false) ; 

    useEffect(() => {
        async function getPlaylists() {
            try {                
                const response = await fetchResponse("http://localhost:5000/api/playlists", { method: "GET" }) ; 
                
                const playlists = await response.json() ; 
                
                const alteredPlaylists = playlists.map((playlist: Playlist) => {

                    let containsTrack = false ; 
                    if ( playlist.tracks.find(track => track.trackId === trackData.trackId) ) {
                        containsTrack = true ; 
                    }
                    return {
                        ...playlist,
                        selected: false,
                        alreadyContainsTrack: containsTrack
                    }
                })

                setPlaylistSelections(alteredPlaylists) ; 
            } catch (error) {
                setGetPlaylistsError(true) ; 
                console.error(error) ; 
            }
        }
        getPlaylists() ; 
    }, [loggedInUser]) ; 


    const { register: registerCreateNew, 
            handleSubmit: handleSubmitCreateNew, 
            formState: { errors: errorsCreateNew },
            reset: resetCreateNew 
        } = useForm<FormInputCreateNewPlaylistToAddTo>() ; 


    const { register: registerAddToExisting, 
            handleSubmit: handleSubmitAddToExisting, 
            formState: { errors: errorsAddToExisting }
        } = useForm<FormInputAddToExistingPlaylist>() ;


    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
        addToExistingPlaylist: { display: false, status: null, statusMsg: null },
        createNewPlaylistToAddTo: { display: false, status: null, statusMsg: null }
    }) ; 


    const onSubmitCreateNew: SubmitHandler<FormInputCreateNewPlaylistToAddTo> = async (data) => {

        try {

            const form = { 
                ...formState, 
                createNewPlaylistToAddTo: {
                    inputDisabled: true,
                    submitEnabled: false
                }
            } ; 

            setFormState(form) ; 
            
            const { playlistName, playlistDescription } = data ; 
        
            const response = await fetchResponse(`http://localhost:5000/api/playlists/`, { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: playlistName,
                    description: playlistDescription,
                    tracks: [trackData]
                }) 
            }) ; 

            const newPlaylist = await response.json() ; 

            const newPlaylistSelections = [
                ...playlistSelections,
                {   
                    ...newPlaylist,
                    selected: false,
                    alreadyContainsTrack: true
                }
            ]
    
            setPlaylistSelections(newPlaylistSelections) ; 

            const updatedSubmitStatus = {
                ...submitStatus,
                createNewPlaylistToAddTo: { display: true, status: true, statusMsg: "Submission successful" }
            }
            setSubmitStatus(updatedSubmitStatus) ; 

        } catch (error) {
            console.error(error) ;

            const updatedSubmitStatus = {
                ...submitStatus,
                createNewPlaylistToAddTo: { display: true, status: false, statusMsg: "Submission failed" }
            }
            setSubmitStatus(updatedSubmitStatus) ; 

        }
              
        const form = { ...formState, 
            createNewPlaylistToAddTo: {
                inputDisabled: true,
                submitEnabled: true
            } 
        }

        setFormState(form)

    }

    function clearFormCreateNew() {

        const form = { ...formState, 
            createNewPlaylistToAddTo: {
                inputDisabled: false,
                submitEnabled: true
            } 
        }

        setFormState(form) ; 

        resetCreateNew() ; 

        const updatedSubmitStatus = {
            ...submitStatus,
            createNewPlaylistToAddTo: { display: false, status: null, statusMsg: null }
        }
        setSubmitStatus(updatedSubmitStatus) ; 

    }

    

    const onSubmitAddtoExisting = async () => {
        
        try { 

            const form = { 
                ...formState, 
                addToExistingPlaylist: {
                    inputEnabled: false,
                    submitEnabled: false
                } 
            }
            setFormState(form)
            
            const selectedPlaylist = playlistSelections.find(playlist => playlist.selected === true)
            
            let playlistId ; 
            if (selectedPlaylist) {
                playlistId = selectedPlaylist._id ; 
            }

            const response = await fetchResponse(`http://localhost:5000/api/playlists/${playlistId}`, { 
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    addTracks: [trackData]
                })
            })

            const updatedPlaylist = await response.json() ; 

            const newPlaylistSelections = playlistSelections.map(playlist => {
                if (playlist._id === updatedPlaylist._id ) {
                    return {
                        ...updatedPlaylist,
                        selected: false,
                        alreadyContainsTrack: true
                    }
                } else {
                    return playlist
                }
            }) ; 

            setPlaylistSelections(newPlaylistSelections) ; 

            const updatedSubmitStatus = {
                ...submitStatus,
                addToExistingPlaylist: { display: true, status: true, statusMsg: "Submission successful" }
            }
            setSubmitStatus(updatedSubmitStatus) ; 
            
        } catch (error) {
            console.error(error) ;
            
            const updatedSubmitStatus = {
                ...submitStatus,
                addToExistingPlaylist: { display: true, status: false, statusMsg: "Submission failed" }
            }
            setSubmitStatus(updatedSubmitStatus) ; 
        }
        
        const form = { ...formState, 
            addToExistingPlaylist: {
                inputEnabled: true,
                submitEnabled: false
            } 
        } ; 

        setFormState(form) ; 

    }

    function closeSubmitStatus() {
        const updatedSubmitStatus = {
            ...submitStatus,
            addToExistingPlaylist: { display: false, status: null, statusMsg: null }
        }
        setSubmitStatus(updatedSubmitStatus) ; 

        const form = { ...formState, 
            addToExistingPlaylist: {
                inputEnabled: true,
                submitEnabled: true
            } 
        } ; 

        setFormState(form) ;
    }

    const [formState, setFormState] = useState<FormState>({
        addToExistingPlaylist: {
            inputEnabled: true,
            submitEnabled: true
        },
        createNewPlaylistToAddTo: {
            inputDisabled: false,
            submitEnabled: true
        }
    })

  
    function handleClickPlaylistSelection(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {

        event.preventDefault() ; 

        const input = event.target as HTMLElement ; 

        if (input) {
            const newPlaylistArray = playlistSelections.map(playlist => {
                if (input.id === playlist._id) {
                    return { ...playlist, selected: !playlist.selected }
                } 
                else {
                    return { ...playlist, selected: false }                    
                }
            })
            setPlaylistSelections(newPlaylistArray)
        }

    }


    const [addToPlaylistOption, setAddToPlaylistOption]= useState({
        addToExistingPlaylist: false, createNewPlaylistToAddTo: false 
    }) ; 


    function handleClickAddToPlaylistOption(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {

        event.preventDefault() ; 

        const input = event.target as HTMLElement ;

        if (input) {

            if (input.className.startsWith("music-track-add-to-playlist-options-add-to-existing-playlist-button")) {
                const replacementObject = { 
                    addToExistingPlaylist: !addToPlaylistOption.addToExistingPlaylist,
                    createNewPlaylistToAddTo: false
                }
                setAddToPlaylistOption(replacementObject)
            } else {
                const replacementObject = { 
                    addToExistingPlaylist: false, 
                    createNewPlaylistToAddTo: !addToPlaylistOption.createNewPlaylistToAddTo
                }
                setAddToPlaylistOption(replacementObject)
            }
        }
    }

    
	return (

        <div
            className="music-track-add-to-playlist-options"
            style={{ display: displayProp, margin: marginProp }}
        >
            <div className="music-track-add-to-playlist-options-add-to-playlist-buttons">
                <div
                    className={`music-track-add-to-playlist-options-add-to-existing-playlist-button${
                        addToPlaylistOption.addToExistingPlaylist ? "-selected" : ""}`
                    }
                    onClick={handleClickAddToPlaylistOption}
                >
                    Add to an existing playlist
                </div>
                <div
                    className={`music-track-add-to-playlist-options-create-new-playlist-button${
                        addToPlaylistOption.createNewPlaylistToAddTo ? "-selected" : ""}`
                    }
                    onClick={handleClickAddToPlaylistOption}
                >
                    Create new playlist to add to
                </div>
            </div>

            { addToPlaylistOption.addToExistingPlaylist ?
            <>

            { loggedInUser ?
            <>

            { formState.addToExistingPlaylist.inputEnabled ?
            <div 
                className="music-track-add-to-playlist-options-add-to-existing-playlist-selections"
                onSubmit={handleSubmitAddToExisting(onSubmitAddtoExisting)}
            >

                <div>Your Playlists</div>
                
                { !getPlaylistsError ?
                <>
                {playlistSelections.map((playlist) => {
                    return !playlist.alreadyContainsTrack ? (
                        <div
                            onClick={handleClickPlaylistSelection}
                            className={`music-track-playlist-options-add-to-existing-playlist-name${playlist.selected ? "-selected" : ""}`}
                            id={playlist._id}
                            {...registerAddToExisting('playlistId', { 
                                validate: () => {
                                    const selectedPlaylist = playlistSelections.find(playlist => playlist.selected === true)
                                    if (!selectedPlaylist) {
                                        return "Please select a playlist if you want to submit" ; 
                                    }
                                    return true ; 
                                }
                            })} 
                        >
                            {playlist.name}
                        </div>                        
                    ) : (
                        <div 
                            className="music-track-playlist-options-add-to-existing-playlist-name-disabled"
                            id={playlist._id}
                        >
                            {playlist.name}
                        </div>
                    )
                })}
                </>
                : 
                <h4 className="music-track-playlist-options-add-to-existing-playlist-get-playlists-error">
                    Error getting playlists.
                </h4> 
                }

                { playlistSelections.length === 0 && !getPlaylistsError ?
                    <div>
                        You don't have any playlists.
                    </div>
                    : null
                }
                
            </div> : 
            <LoadingSpinner marginTopProp="65px" marginBottomProp="75px" positionProp="relative" /> 
            }

            </> : <div>Log in or sign up.</div> }

            { loggedInUser ?
            <>

            { errorsAddToExisting.playlistId && 
                <div className="music-track-add-to-playlist-options-form-error-message">
                    {errorsAddToExisting.playlistId.message}
                </div>
            }

            { formState.addToExistingPlaylist.submitEnabled ?
            <div 
                className="music-track-add-to-playlist-options-add-to-existing-playlist-submit-button"
                onClick={handleSubmitAddToExisting(onSubmitAddtoExisting)}
            >
                Submit
            </div> : null 
            }

            </> : null }

            { submitStatus.addToExistingPlaylist.display ?
            <div 
                className={`music-track-add-to-playlist-options-add-to-existing-playlist-submit-status-${
                    submitStatus.addToExistingPlaylist.status ? "success" : "failed"
                }`}
            >
                <div>{submitStatus.addToExistingPlaylist.statusMsg}</div>
                <TiDeleteOutline
                    size="22px"
                    className="music-track-add-to-playlist-options-add-to-existing-playlist-submit-status-close-icon"
                    onClick={closeSubmitStatus} 
                />
                <div 
                    className="music-track-add-to-playlist-options-add-to-existing-playlist-submit-status-close-icon-hover-modal"
                >
                    Close
                </div> 
            </div> : null 
            }
            </> : null 
            }


            { addToPlaylistOption.createNewPlaylistToAddTo ? 
            <>

            { loggedInUser ?
            <>

            <form 
                className="music-track-add-to-playlist-options-create-new-playlist-form"
                onSubmit={handleSubmitCreateNew(onSubmitCreateNew)}
            >
                <textarea
                    className="music-track-add-to-playlist-options-create-new-playlist-form-input-name"
                    placeholder="Playlist name"
                    {...registerCreateNew('playlistName', { 
                        required: "Playlist name is required."
                    })} 
                    disabled={formState.createNewPlaylistToAddTo.inputDisabled}
                />
                { errorsCreateNew.playlistName && 
                <div className="music-track-add-to-playlist-options-form-error-message">
                    {errorsCreateNew.playlistName.message}
                </div>
                }
                <textarea
                    className="music-track-add-to-playlist-options-create-new-playlist-form-input-description"
                    placeholder="Description"
                    {...registerCreateNew('playlistDescription')} 
                    disabled={formState.createNewPlaylistToAddTo.inputDisabled}
                />
            </form> 

            </> : <div>Log in or sign up.</div> }
                    
            { formState.createNewPlaylistToAddTo.submitEnabled ?
            <>

                { loggedInUser ?
                <>

                { !submitStatus.createNewPlaylistToAddTo.display ?
                <div 
                    className="music-track-add-to-playlist-options-create-new-playlist-submit-button"
                    onClick={handleSubmitCreateNew(onSubmitCreateNew)}
                >
                    Submit
                </div> : null }

                </> : null }


                { submitStatus.createNewPlaylistToAddTo.display ? 
                <>
                    <div 
                        className={`music-track-add-to-playlist-options-create-new-playlist-submit-status-${
                            submitStatus.createNewPlaylistToAddTo.status ? "success" : "failed"
                        }`}
                    >
                        {submitStatus.createNewPlaylistToAddTo.statusMsg}
                    </div> 
                    <div 
                        className="music-track-add-to-playlist-options-create-new-playlist-clear-form"
                        onClick={clearFormCreateNew}
                    >
                        Clear Form
                    </div>
                </> 
                : null }
            </> : <LoadingSpinner marginTopProp="-20px" marginBottomProp="10px" positionProp="relative"/> }

            </>
            : null }

        </div>

	) ; 
}
