import { RequestHandler } from "express" ;


export const searchTracks: RequestHandler = async (req, res, next) => {

    let searchQuery ; 

    if (typeof req.query.q === "string") {
        searchQuery = encodeURI(req.query.q) ; 
    } else {
        return res.sendStatus(400) ; 
    }

    const searchData = await 
    fetch(`https://itunes.apple.com/search?term=${searchQuery}&country=us&media=music&entity=song`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Error getting search data from iTunes")
        }
        return response.json()
    })
    .then(data => { return data.results })
    .catch(error => { 
        console.log(error) ;
        return [] ;  
    })

    if (searchData) {
        const destructuredSearchData = searchData.map((trackData: any) => {
            return {
                trackId: trackData.trackId,
                artistName: trackData.artistName,
                collectionName: trackData.collectionName,
                trackName: trackData.trackName,
                previewUrl: trackData.previewUrl,
                artworkUrl100: trackData.artworkUrl100,
                releaseDate: trackData.releaseDate,
                trackExplicitness: trackData.trackExplicitness,
                trackTimeMillis: trackData.trackTimeMillis
            }
             
        })
        res.status(200).send(destructuredSearchData)
    } else {
        res.status(500).send(searchData)
    }
}