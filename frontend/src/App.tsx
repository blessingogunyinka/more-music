import './styles/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LogInPage from './components/LogInPage';
import HomePage from './components/HomePage';
import SignUpPage from './components/SignUpPage';
import SearchPage from './components/SearchPage' ; 
import MusicTrackPage from './components/MusicTrackPage' ; 
import MyAccountPage from './components/MyAccountPage';
import MyPlaylistsPage from './components/MyPlaylistsPage';
import PlaylistPage from './components/PlaylistPage';
import LogOutPage from './components/LogOutPage';
import NavigationMenu from "./components/NavigationMenu" ; 
import LoggedInUserProvider from "./components/LoggedInUserProvider" ;
import PageNotFoundPage from './components/PageNotFoundPage';
  
 
function App() {

    return (
        <>
        <LoggedInUserProvider>       
            <BrowserRouter>
                <NavigationMenu />
                <Routes>                
                    <Route index element={<HomePage />} />
                    <Route path="/login" element={<LogInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/track/:trackId" element={<MusicTrackPage />} />
                    <Route path="/my-account" element={<MyAccountPage />} />
                    <Route path="/my-account/my-playlists" element={<MyPlaylistsPage />} />
                    <Route path="/my-account/my-playlists/:playlistId" element={<PlaylistPage />} />
                    <Route path="/logout" element={<LogOutPage />} />
                    <Route path="/*" element={<PageNotFoundPage />} />
                </Routes>
            </BrowserRouter>   
        </LoggedInUserProvider>      
        </>
    );
}

export default App ;


