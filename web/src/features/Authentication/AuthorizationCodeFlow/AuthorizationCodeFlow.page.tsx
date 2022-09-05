import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { env } from '../../../app/Env';
import './AuthorizationCodeFlow.styles.css'

export function AuthorizationCodeFlow() {
  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      console.log('code', code)

      // http://localhost:9798/auth/google backend that will exchange the code
      const tokens = await axios.post(`${env.apiUrl}/auth/google`, {  
        code,
      });
  
      console.log(tokens);
    },
    flow: 'auth-code',
  })

  return (
    <div className='authorization-container'>
      <button onClick={() => login()} className='authorization-signing-button'>Sign in with Google 🚀 </button>
    </div>
  )
}
