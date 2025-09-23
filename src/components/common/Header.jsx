import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
const navigate = useNavigate();

  return (
    <>
    <h1 onClick={() => navigate('./')}>Green Travel</h1>
    </>
  )
}

export default Header;