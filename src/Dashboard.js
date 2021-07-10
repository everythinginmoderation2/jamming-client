import React, { useState, useEffect } from 'react'
import useAuth from './useAuth'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import AudioPlayer from './AudioPlayer'
import axios from 'axios'

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.REACT_APP_client_id
})

function Dashboard({ code }) {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState("")

    function chooseTrack(track) {
        setPlayingTrack(track)
        setSearch("")
        setLyrics("")
    }

    useEffect(() => {
        if(!playingTrack) return
        axios.get(`http://localhost:5000/lyrics`, {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist,
            }
        }).then(res => {
            setLyrics(res.data.lyrics)
        })
    }, [playingTrack])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if (!search) return setSearchResults([])
        if (!accessToken) return
        let cancel = false;
        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return
            setSearchResults(res.body.tracks.items.map(track => {
                const smallestAlbumImage = track.album.images.reduce((smallest, image) =>
                    image.height < smallest.height ? image : smallest
                    , track.album.images[0])
                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlbumImage.url
                }
            }))
        })
        return () => cancel = true;
    }, [search, accessToken])

    const onSubmit = (e) => {
        console.log(search)
        e.preventDefault();
        spotifyApi.searchTracks(search).then(res => setSearchResults(res.body.tracks.items.map(track => {
            const smallestAlbumImage = track.album.images.reduce((smallest, image) =>
                image.height < smallest.height ? image : smallest
                , track.album.images[0])
            return {
                artist: track.artists[0].name,
                title: track.name,
                uri: track.uri,
                albumUrl: smallestAlbumImage.url
            }
        })))
        console.log(searchResults)
    }

    return (
        <div className="search-form-container">
            <form onSubmit={onSubmit}>
                <input type="search" placeholder="Search Songs/Artists" value={search} onChange={(e) => setSearch(e.target.value)} />
                <button type="submit" onClick={onSubmit}>Search</button>
            </form>
            <div className="song-list">
            {searchResults.map(track => (<TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />))}
            {searchResults.length === 0 && (<div className="song-lyrics" style={{whiteSpace: "pre"}}>{lyrics}</div>)}
            </div>
            <div className="audio-player"><AudioPlayer accessToken={accessToken} trackUri={playingTrack?.uri} /></div>
        </div>
    )
}

export default Dashboard
