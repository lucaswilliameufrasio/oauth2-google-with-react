import { Link } from '@tanstack/react-location'
import './Navbar.styles.css'

export function Navbar() {
  return (
    <div className='container'>
        <Link to='/' activeOptions={{ exact: true }} className='navigation-button'>
          Select Another Flow
        </Link>
    </div>
  )
}
