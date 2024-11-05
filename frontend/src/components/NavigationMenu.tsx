import React, { useContext, useEffect, useState } from 'react' ; 
import '../styles/NavigationMenu.css' ;
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import * as userApi from "../network/userApi" ; 
import LoadingSpinner from './LoadingSpinner';
import { LoggedInUserContext } from './LoggedInUserProvider';


function NavigationMenu() {
    
    const { loggedInUser, setLoggedInUser } = useContext(LoggedInUserContext) ;

    const location = useLocation() ; 

    const navigate = useNavigate() ; 

    const [pathname, setPathname] = useState<string>(location.pathname.replace("/", "")) ; 

    useEffect(() => {        
        async function getUser() {
            try {
                const user = await userApi.getUserLoggedIn() ; 
                setLoggedInUser(user) ; 
            } catch (error) {
                console.error(error) ; 
            }
        }
        getUser() ; 
    }, []) ;


    useEffect(() => { 
        setPathname(location.pathname.replace("/", "")) ; 
    }, [location]) ;


    const [searchParams, setSearchParams] = useSearchParams() ;
    
    const searchParametersExist = Boolean(searchParams.has("q") && searchParams.get("q") !== "") ;

    function encodedPathnameAndParams(): string {
        const encodedPathname = encodeURIComponent(pathname) ; 
        let encodedSearchParameters = "" ; 
        const queryParameter = searchParams.get("q") ; 

        if (searchParametersExist && queryParameter && pathname === "search") {
            encodedSearchParameters = "%3F" + "q" + "%3D" + encodeURIComponent(queryParameter) ; 
        }

        return encodedPathname + encodedSearchParameters ; 
    }

    const [loading, setLoading] = useState(false) ; 

    const [error, setError] = useState<null|string>(null) ; 

    async function handleLogOut(event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) {
        event.preventDefault() ; 
        try {
            setLoading(true) ; 
            await userApi.logOut() ; 
            setLoggedInUser(null) ; 
            setLoading(false) ; 
        } catch (error) {
            console.error(error) ;
            setError("Error logging out.\nRefresh the page.") ;
        }
    }

    const pageNotFound = pathname !== "" && pathname !== "search" && !pathname.startsWith("track/") && pathname !== "my-account"
    && !pathname.startsWith("my-account/my-playlists") && pathname !== "signup" && pathname !== "login" ; 

    return (
        <div className="navigation-menu-buttons-stack">
            { !loading ?
            <>
            { loggedInUser ?
                <>
                { pathname === "" || pathname === "search" || pathname.startsWith("track/") || pathname.startsWith("my-account/my-playlists") ?
                    <Link to="../my-account"><p>My Account</p></Link>
                    :
                    null
                }
                { pathname === "" || pathname === "my-account" || pathname === "search" || pathname.startsWith("track/") ?
                    <Link to="../my-account/my-playlists"><p>My Playlists</p></Link>
                    :
                    null
                }
                { pathname === "my-account" || pathname.startsWith("track/") || pathname.startsWith("my-account/my-playlists") ?
                    <Link to="../search"><p>Search</p></Link>
                    :
                    null
                }
                { pathname === "" || pathname === "my-account" || pathname === "search" || pathname.startsWith("track/") || pathname.startsWith("my-account/my-playlists") ?
                    <p onClick={handleLogOut}>Log Out</p>
                    :
                    null
                }
                { pageNotFound ?
                    <>
                    <Link to="../my-account"><p>My Account</p></Link>
                    <Link to="../my-account/my-playlists"><p>My Playlists</p></Link>
                    <Link to="../search"><p>Search</p></Link>
                    <p onClick={handleLogOut}>Log Out</p>
                    </>
                    : null
                }
                <div className="navigation-menu-error-message">
                    {error}
                </div> 
                </>
                :
                <>
                { pathname === "" || pathname === "my-account" || pathname === "login" || pathname === "search" || pathname.startsWith("track/") || pathname.startsWith("my-account/my-playlists") ?
                    <>
                    { pathname === "" || pathname === "login" ?
                        <Link to="../signup"><p>Sign Up</p></Link>
                        : <Link to={`../signup?ref=${encodedPathnameAndParams()}`}><p>Sign Up</p></Link> 
                    }
                    </>
                    : null
                }
                { pathname === "" || pathname === "my-account" || pathname === "signup" || pathname === "search" || pathname.startsWith("track/") || pathname.startsWith("my-account/my-playlists") ? 
                    <>
                    { pathname === "" || pathname === "signup" ? 
                        <Link to="../login"><p>Log In</p></Link>
                        : <Link to={`../login?ref=${encodedPathnameAndParams()}`}><p>Log In</p></Link> 
                    }
                    </>
                    :
                    null
                }
                { pathname === "my-account" || pathname === "signup" || pathname === "login" || pathname.startsWith("track/") || pathname.startsWith("my-account/my-playlists") ? 
                    <Link to="../search"><p>Search</p></Link>
                    :
                    null
                }
                { pageNotFound ?
                    <>
                    <Link to="../signup"><p>Sign Up</p></Link>
                    <Link to="../login"><p>Log In</p></Link>
                    <Link to="../search"><p>Search</p></Link>
                    </>
                    : null
                }
                </>
            }
            </> : <LoadingSpinner marginLeftProp="-90px" marginTopProp="30px" /> }
        </div>

    ) ; 
}

export default NavigationMenu ; 