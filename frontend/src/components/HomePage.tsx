import musicLogo from '../svg/musicLogo.svg' ;
import '../styles/HomePage.css';
import SearchBar from "./SearchBar" ;


function HomePage() {
    
    return (
        <>
            <div className="home-page-center-stack-container">
                <img
                    className="home-page-more-music-logo" 
                    src={musicLogo}  
                />
                <SearchBar />   
            </div>
        </>
    ) ;
}

export default HomePage ;
