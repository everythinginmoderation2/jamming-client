import React from 'react'

function TrackSearchResult({track, chooseTrack}) {
    function handlePlay() {
        chooseTrack(track)
    }
    return (
        <div className="track-search-result" onClick={handlePlay}>
            <img src={track.albumUrl} alt='album art' />
            <div className="track-info">
            <div className="track-title">{track.title}</div>
            <div className="track-artist">{track.artist}</div>
            </div> 
        </div>
    )
}

export default TrackSearchResult
