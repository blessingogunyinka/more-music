import { RequestHandler } from "express" ;


export const getTrack: RequestHandler = async (req, res, next) => {

    const trackId = req.params.trackId ; 

    const trackData = await 
    fetch(`https://itunes.apple.com/lookup?id=${trackId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Error getting track data from iTunes")
        }
        return response.json()
    })
    .then(data => { return data.results[0] })
    .catch(error => { 
        console.log(error) ;
        return null ; 
    }) ;  

    if (trackData) {
        const filteredTrackData = {
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
        res.status(200).send(filteredTrackData)
    } else {
        res.status(500).send(trackData)
    }
}