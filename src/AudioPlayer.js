import React, {useState, useEffect} from 'react'
import SpotifyPlayer from "react-spotify-web-playback"

function AudioPlayer({accessToken, trackUri}) {
    const [play, setPlay] = useState(false)

    useEffect(()=> setPlay(true), [trackUri])

    function inPlay(state) {
        if(!state.isPlaying) setPlay(false)
    }
    if(!accessToken) return null
    return <SpotifyPlayer token={accessToken} showSaveIcon callback={inPlay} play={play} uris={trackUri ? [trackUri] : []}/>
}

export default AudioPlayer
