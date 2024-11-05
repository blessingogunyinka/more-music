import { useContext, useState, useEffect } from 'react' ; 
import '../styles/LogInSignUpPages.css' ; 
import '../styles/LogInPage.css' ; 
import { SubmitHandler, useForm } from "react-hook-form" ; 
import * as EmailValidator from 'email-validator' ;
import musicLogo from '../svg/musicLogo.svg' ;
import { Link, useNavigate, useSearchParams } from 'react-router-dom' ; 
import { UserModel } from '../models/user' ; 
import * as userApi from "../network/userApi" ; 
import { LoggedInUserContext } from './LoggedInUserProvider';


type FormInput = {
    username: string
    email: string
    password: string
}

type UserModelFull = UserModel & {
    password: string
}


function LogInPage() {

    const { loggedInUser, setLoggedInUser } = useContext(LoggedInUserContext) ; 

    const [error, setError] = useState<string|null>(null) ; 

    const navigate = useNavigate() ; 

    const [searchParams, setSearchParams] = useSearchParams() ; 

    function redirect() {

        const ref = searchParams.get("ref") ; 
        
        try {
            if (ref) {
                navigate(`../${ref}`) ; 
            } else {
                navigate("../my-account") ;
            }
        } catch (error) {        
            navigate("../") ; 
        }
        
    }

    useEffect(() => {
        if (loggedInUser) {
            redirect() ; 
        }
    }, [loggedInUser]) ; 

    const { register, handleSubmit, formState: { errors } } = useForm<FormInput>() ; 
    
    const onSubmit: SubmitHandler<FormInput> = async (credentials: UserModelFull) => {
        try {
            const user = await userApi.logIn(credentials) ; 

            setLoggedInUser({
                username: user.username,
                email: user.email
            }) ; 

            setError(null) ; 

            redirect() ; 
        } catch (error) {
            setError("There was an error logging in.")
        }
    }

    return (
        <>
            <Link to="../">
                <img
                    className="more-music-logo-login-signup-page" 
                    src={musicLogo}  
                />
            </Link>
            
            <div className="login-signup-modal">                
                <form className="login-signup-modal-form" onSubmit={handleSubmit(onSubmit)}>                    
                    <div>Log In</div>
                    <input 
                        {...register('username', { 
                            required: "Username is required.",
                        })}
                        placeholder="Username"
                    />
                    {errors.username && <div className="login-signup-modal-error-message">{errors.username.message}</div>}
                    <input 
                        {...register('email', { 
                            required: "Email is required.",
                            validate: (value) => {
                                if (!EmailValidator.validate(value)) {
                                    return "Please enter a valid email address" ; 
                                }
                                return true ; 
                            }
                        })} 
                        placeholder="Email"
                    />
                    {errors.email && <div className="login-signup-modal-error-message">{errors.email.message}</div>}
                    <input 
                        {...register('password', { 
                            required: "Password is required.",
                        })}
                        type="password"
                        placeholder="Password"
                    />
                    {errors.password && 
                        <div 
                            className="login-signup-modal-error-message"
                            style={{ marginBottom: "-25px" }}
                        >
                            {errors.password.message}
                        </div>
                    }
                    <button className="login-signup-modal-submit-button" type="submit">Submit</button>
                    { !error ? null : <div className="login-signup-modal-error-message">{error}</div> }
                </form>                 
            </div>
            
        </>
    ) ; 
}

export default LogInPage ;