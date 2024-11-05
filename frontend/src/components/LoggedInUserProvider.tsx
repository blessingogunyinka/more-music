import React, { ReactNode, createContext } from 'react';
import '../styles/MyAccountPage.css';
import { UserModel } from '../models/user';


interface LoggedInUserProviderProps {
    children: ReactNode
}

type LoggedInUserContextType = {
    loggedInUser: UserModel|null
    setLoggedInUser: React.Dispatch<React.SetStateAction<UserModel|null>>
} 

const defaultLoggedInUserContext: LoggedInUserContextType = {
    loggedInUser: null,
    setLoggedInUser: () => {}
}

export const LoggedInUserContext = createContext(defaultLoggedInUserContext) ; 

function LoggedInUserProvider({ children }: LoggedInUserProviderProps) {

    const [loggedInUser, setLoggedInUser] = React.useState<UserModel|null>(null) ; 
    
    return (
        <LoggedInUserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
            {children}
        </LoggedInUserContext.Provider>

    ) ;
}

export default LoggedInUserProvider ;