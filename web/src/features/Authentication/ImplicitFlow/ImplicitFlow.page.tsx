import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { env } from '../../../app/Env'
import './ImplicitFlow.styles.css'

export function ImplicitFlow() {
  async function handleSuccess(credentialResponse: CredentialResponse) {
    console.log(credentialResponse)

    const isValid = await axios.post(`${env.apiUrl}/auth/google/verify`, null, {
      headers: {
        'Content-Type': 'application/json',
        token: credentialResponse.credential ?? '',
      },
    })

    console.log('isValid', isValid)
  }

  function handleError() {
    console.log('Login Failed')
  }

  return (
    <div className='implicit-container'>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
      />
    </div>
  )
}
