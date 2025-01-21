import { useContext, useEffect, useState } from 'react' ; 
import '../styles/LogInSignUpPages.css' ; 
import '../styles/SignUpPage.css' ; 
import { SubmitHandler, useForm } from "react-hook-form" ; 
import * as EmailValidator from 'email-validator' ;
import { passwordStrength } from 'check-password-strength' ;
import musicLogo from '../svg/musicLogo.svg' ;
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LoggedInUserContext } from './LoggedInUserProvider';
import * as userApi from "../network/userApi" ; 


type FormInput = {
    username: string
    email: string
    password: string
}


function SignUpPage() {

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
    
    const onSubmit: SubmitHandler<FormInput> = async (credentials) => {
        try {
            const newUser = await userApi.signUp(credentials) ; 
            setLoggedInUser({
                username: newUser.username,
                email: newUser.email
            }) ; 
            setError(null) ; 
            redirect() ; 
        } catch (error) {
            setError("There was an error signing up.")
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
                    <div>Sign Up</div>
                    <input 
                        {...register('username', { 
                            required: "Username is required.",
                            minLength: {
                                value: 5,
                                message: "Usernme must be 5 or more characters."
                            }
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
                            validate: (value) => {
                                if (passwordStrength(value).id < 2) {
                                    return "Password isn't strong enough."
                                }
                                return true ; 
                            }
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

export default SignUpPage ;