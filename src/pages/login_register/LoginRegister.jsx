import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';
import './login_register.scss';

function Login() {
    const [token, setToken] = useState(null)
    const handleLoginWithGoogle = useGoogleLogin({
        onSuccess: async (response) => {
            console.log(response)
            setToken(response.access_token)
            const resGoogle = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`)
            // const resGoogle = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`)
            console.log(resGoogle)
        },
    
})
    return (
        <>
        <div 
            className="btn google-login" role="button" 
            onClick={handleLoginWithGoogle}
        >
            <button id="login-with-google" hidden></button>
            <img src="https://play.google.com/store/apps/dev?id=5700313618786177705&hl=en_US&gl=US" alt="" className="google-img" />
            <p className="btn-login-desc">Đăng nhập bằng Google</p>
        </div>
        {
            token
            &&
            <>
                <h1 className='token'>Access_Token:</h1>
                <h1 className='token'>{token}</h1>
            </>
        }
        </>
    )
}

export default Login;