
export function getTrackTimeMinAndSec( trackTimeMilliseconds: number | undefined): string | null {
    if (!trackTimeMilliseconds) {
        return null ; 
    }
    const trackTimeMinutes = trackTimeMilliseconds >= 60000 ? Math.floor((trackTimeMilliseconds/60000)).toString() : "00"
    const trackTimeSeconds = trackTimeMilliseconds%60000 === 0 ? "00" : ((trackTimeMilliseconds/60000%1)*60).toFixed(0).toString() ; 
    const trackTimeMinAndSec = trackTimeMinutes + ":" + ( Number(trackTimeSeconds) < 10 ? "0" + trackTimeSeconds : trackTimeSeconds ) 
    return trackTimeMinAndSec ; 
}