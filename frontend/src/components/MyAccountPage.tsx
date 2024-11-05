import { useContext } from 'react';
import '../styles/MyAccountPage.css';
import { Link } from 'react-router-dom';
import musicLogo from '../svg/musicLogo.svg' ;
import { LoggedInUserContext } from './LoggedInUserProvider';


function MyAccountPage() {

    const { loggedInUser, setLoggedInUser } = useContext(LoggedInUserContext) ;
    
    return (
        <>   
            { loggedInUser ?
            <> 
            <div className="my-account-page-main-container">
                <div className="my-account-page-welcome-text">Welcome {loggedInUser?.username}</div>
            </div>
            <Link to="../">
                <img
                    className="my-account-page-more-music-logo" 
                    src={musicLogo}  
                />
            </Link>
            </>
            :
            <> 
            <div className="my-account-page-main-container">
                <div className="my-account-page-login-or-signup-text">Please log in or sign up.</div>
            </div>
            <Link to="../">
                <img
                    className="my-account-page-more-music-logo" 
                    src={musicLogo}  
                />
            </Link>
            </>
            }
        </> 
    ) ;
}

export default MyAccountPage ;
