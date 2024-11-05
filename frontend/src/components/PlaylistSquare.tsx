import React, { useState } from "react"
import '../styles/PlaylistSquare.css' ;
import { Link } from 'react-router-dom' ;
import { TiDeleteOutline } from "react-icons/ti" ;
import { SubmitHandler, useForm } from "react-hook-form" ;
import { PlaylistModel as Playlist } from "../models/playlist"
import LoadingSpinner from "./LoadingSpinner";
import { fetchResponse } from "../network/fetchResponse";


interface PlaylistSquareProps {
    playlist: Playlist,
}

type FormInputEditPlaylist = {
    playlistName: string,
    playlistDescription: string
}

type FormAbled = {
    inputDisabled: boolean,
    submitEnabled: boolean|null
}

type SubmitStatus = {
    editPlaylist: { display: boolean, status: boolean|null, statusMsg: string|null }
}


function PlaylistSquare({ playlist }: PlaylistSquareProps) {

    const [playlistSquare, setPlaylistSquare] = useState<Playlist>(playlist) ; 

    const [deletePlaylist, setDeletePlaylist] = useState<boolean|null>(false) ; 

    const [deletePlaylistError, setDeletePlaylistError] = useState<boolean>(false) ; 
        
    const [formAbled, setFormAbled] = useState<FormAbled>({
        inputDisabled: false,
        submitEnabled: true
    }) ; 

    const [displayForm, setDisplayForm] = useState<boolean>(false) ; 

    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
        editPlaylist: { display: false, status: null, statusMsg: null }
    }) ;

    const { register: registerEditPlaylist,
        handleSubmit: handleSubmitEditPlaylist,
        formState: { errors: errorsEditPlaylist },
        reset: resetEditPlaylist
    } = useForm<FormInputEditPlaylist>({
        defaultValues: {
            playlistName: playlistSquare.name,
            playlistDescription: playlistSquare.description
        }
    }) ;


    async function handleClickDeletePlaylist(event: React.MouseEvent<SVGElement, MouseEvent>) {
        event.preventDefault() ; 

        try {
            setDeletePlaylist(null) ; 

            const input = event.target as HTMLElement ; 
            const playlistId = input.id.replace("delete_", "") ;

            await fetchResponse(`http://localhost:5000/api/playlists/${playlistId}`, { method: "DELETE" }) ; 

            setDeletePlaylist(true) ; 
        } catch (error) {
            setDeletePlaylist(false) ; 
            setDeletePlaylistError(true) ; 
        }

    }


    const onSubmitEditPlaylist: SubmitHandler<FormInputEditPlaylist> = async (data) => {

        try {

            const form = { 
                inputDisabled: true,
                submitEnabled: false
            }
    
            setFormAbled(form)
    
            const { playlistName, playlistDescription } = data ;
            
            const response = await fetchResponse(`http://localhost:5000/api/playlists/${playlistSquare._id}`, { 
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: playlistName,
                    description: playlistDescription
                }) 
            }) ; 

            const editedPlaylist = await response.json() ; 

            setPlaylistSquare(editedPlaylist) ; 

            const updatedSubmitStatus = {
                editPlaylist: { display: true, status: true, statusMsg: "Submission successful" }
            }

            setSubmitStatus(updatedSubmitStatus) ; 
            
        } catch (error) {
            
            const updatedSubmitStatus = {
                editPlaylist: { display: true, status: false, statusMsg: "Submission failed" }
            }

            setSubmitStatus(updatedSubmitStatus) ; 

        }
        
        const form = { inputDisabled: true, submitEnabled: null }
        
        setFormAbled(form)
    }


    function closeSubmitStatus() {
        const updatedSubmitStatus = {
            editPlaylist: { display: false, status: null, statusMsg: null }
        }
        setSubmitStatus(updatedSubmitStatus) ;

        const form = { inputDisabled: false, submitEnabled: true }
        
        setFormAbled(form)
    }



    return (
        <>
            { !deletePlaylist ? 
            <div className="playlist-square-main-container">
                <div className="playlist-square-container"> 
                    { deletePlaylist === false ?
                    <>                                                  
                    <Link 
                        to={`./${playlistSquare._id}`} 
                        style={{ display: "contents"}}
                    >                                
                        <div className="playlist-square">
                            <div className="playlist-square-playlist-name"><b>{playlistSquare.name}</b></div>         
                            <div className="playlist-square-playlist-description">{playlistSquare.description}</div>                              
                        </div>                        
                    </Link>
                    <TiDeleteOutline 
                        size="33px"
                        className="playlist-square-delete-playlist-icon"  
                        onClick={handleClickDeletePlaylist}    
                        id={`delete_` + playlistSquare._id}                                   
                    />
                    <div className="playlist-square-delete-playlist-icon-hover-modal">Delete Playlist</div> 
                    <div 
                        className="playlist-square-edit-playlist-button"
                        onClick={() => setDisplayForm(prev => !prev)}
                        id={'edit_' + playlistSquare._id}
                    >
                        Edit
                    </div> 
                    </>
                    : 
                    <div className="playlist-square">
                        <LoadingSpinner />                             
                    </div>  
                    }

                    { deletePlaylistError ?
                        <h3 className="playlist-square-delete-playlist-error-message">
                            Error Deleting Playlist
                        </h3>
                        : null
                    }
                                                
                </div>
                { displayForm ?
                <>
                <form                     
                    className="playlist-square-edit-playlist-form"
                    onSubmit={handleSubmitEditPlaylist(onSubmitEditPlaylist)}
                >
                    <textarea
                        className="playlist-square-edit-playlist-form-input-name"
                        placeholder="Playlist name"
                        {...registerEditPlaylist('playlistName')}
                        disabled={formAbled.inputDisabled}
                    />
                    { errorsEditPlaylist.playlistName && 
                    <div className="playlist-square-form-error-message">
                        {errorsEditPlaylist.playlistName.message}
                    </div>
                    }
                    <textarea
                        className="playlist-square-edit-playlist-form-input-description"
                        placeholder="Description"
                        {...registerEditPlaylist('playlistDescription')} 
                        disabled={formAbled.inputDisabled}
                    />
                </form> 

                { formAbled.submitEnabled === true ?
                <div 
                    className="playlist-square-edit-playlist-submit-button"
                    onClick={handleSubmitEditPlaylist(onSubmitEditPlaylist)}
                >
                    Submit
                </div> 
                : formAbled.submitEnabled === false ?
                <LoadingSpinner marginBottomProp="10px" positionProp="relative" /> 
                : null
                } 
                </>
                : null }

                { submitStatus.editPlaylist.display ?
                <>
                    <div 
                        className={`playlist-square-edit-playlist-submit-status-${
                            submitStatus.editPlaylist.status ? "success" : "failed"
                        }`}
                    >
                        <div>{submitStatus.editPlaylist.statusMsg}</div>
                        <TiDeleteOutline
                            size="22px"
                            className="playlist-square-edit-playlist-submit-status-close-icon" 
                            onClick={closeSubmitStatus}
                        />
                        <div 
                            className="playlist-square-edit-playlist-submit-status-close-icon-hover-modal"
                        >
                            Close
                        </div>
                    </div>
                </>
                : null
                }
            </div> 
            : null }
        </>
    ) ; 
}

export default PlaylistSquare ; 