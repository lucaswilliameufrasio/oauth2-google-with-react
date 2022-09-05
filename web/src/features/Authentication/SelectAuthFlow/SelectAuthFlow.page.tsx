import { Link } from '@tanstack/react-location'
import './SelectAuthFlow.styles.css'

export function SelectAuthFlowPage() {
  return (
    <div className='auth-flow-container'>
        <Link to="/auth/implicit" className='auth-flow-button'>
          Implicit
        </Link>
        <Link to="/auth/authorization" className='auth-flow-button'>
          Authorization Code
        </Link>     
    </div>
  )
}
