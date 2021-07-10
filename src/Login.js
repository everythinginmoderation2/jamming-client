import React from 'react'


const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_client_id}&response_type=code&redirect_uri=${process.env.REACT_APP_redirect_uri}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`

function Login() {

    return (
        <div className="login-container">
            <a href={AUTH_URL}>Login with Spotify</a>
        </div>
    )
}

export default Login
