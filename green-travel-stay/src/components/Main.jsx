import { useNavigate } from 'react-router-dom';
import './Main.css';

function Main() {
  const navigate = useNavigate();

  return (
    <>
    <h1 className="titleMain">Green Travel</h1>
    <div className="containerMain">
      <img className='title-img' onClick={() => { navigate('/festivals') }} src='/base/andon_tal.png' alt="축제 리스트" />
      <button className="buttonStay" onClick={() => { navigate('/stays')}} type="button">숙박</button>
    </div>
    </>
  )
}

export default Main;