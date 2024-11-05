import { useContext, useEffect, useState } from 'react';
import musicLogo from '../svg/musicLogo.svg' ;
import '../styles/LogOutPage.css' ;
import { Link, useNavigate } from 'react-router-dom';
import * as userApi from "../network/userApi" ; 
import { LoggedInUserContext } from './LoggedInUserProvider';


function LogOutPage() {

    const { loggedInUser, setLoggedInUser } = useContext(LoggedInUserContext) ;

    const [error, setError] = useState<string|null>(null) ; 

    const navigate = useNavigate() ; 

    useEffect(() => {
        async function handleLogOut() {
            try {
                await userApi.logOut() ; 
                setLoggedInUser(null) ; 
                navigate("../") ; 
            } catch (error) {
                setError("There was an error logging out. Try refreshing the page.") ;
            }
        }
        handleLogOut() ; 
    }, []) ; 


    return (
        <>
            <div className="logout-page-main-container">
                { loggedInUser ?
                    <>
                    { !error ?
                        <div className="logout-page-main-text">Logging Out</div>                                
                        : 
                        <div>{error}</div>                            
                    }                        
                    </> 
                    :
                    <div className="logout-page-main-text">Logged out. Redirecting</div> 
                }
            </div> 
            <Link to="../">
                <img
                    className="logout-page-more-music-logo" 
                    src={musicLogo}  
                />
            </Link>
        </>
    ) ;
}

export default LogOutPage ;
