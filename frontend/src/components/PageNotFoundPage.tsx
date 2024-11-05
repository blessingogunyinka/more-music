import '../styles/PageNotFoundPage.css' ; 
import musicLogo from '../svg/musicLogo.svg' ;
import { Link } from 'react-router-dom';


interface PageNotFoundPageProps {

}

function PageNotFoundPage({}: PageNotFoundPageProps) {
    
    return (
        <>
            <Link to="../">
                <img
                    className="page-not-found-page-more-music-logo" 
                    src={musicLogo}  
                />             
            </Link>            
            <h2 
                style={{ 
                    justifySelf: "center", 
                    alignSelf: "center", 
                    textAlign: "center",
                    marginTop: "150px"
                }}
            >
                Page Not Found
            </h2>
        </>
    ) ; 
}

export default PageNotFoundPage ;