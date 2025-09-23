import { useNavigate, useParams } from "react-router-dom"
import './FestivalShow.css'
import { useDispatch, useSelector } from "react-redux"
import { dateFormatter } from "../../utils/dateFormatter.js";
import { useEffect } from "react";
import { setFestivalInfo } from "../../store/slices/festivalShowSlice.js";

function FestivalShow() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const festivalInfo = useSelector(state => state.festivalShow.festivalInfo);
  const festivalList = useSelector(state => state.festival.list);
  


// festivalList.find(item => params.id);

find(item => params.id === item.contentid);

  useEffect(() => {
    
const item = festivalList.find(item => params.id === item.contentid);
  dispatch(setFestivalInfo(item));
  
  },[]) //이 부분 useEffect 넣고 설명해주신 웹페이지로 바뀜

  function redirectBack() {
    navigate(-1); //바로 이전 페이지, -2는 두 페이지 전으로.
  }

  return (

    <>
    { festivalInfo.title &&    
    <div className="show-container">
      <button type="button" onClick={redirectBack}>되돌아가기</button>
      <p className="show-title">{festivalInfo.title}</p>
      <p className="show-period">{dateFormatter.withHyphenYMD(festivalInfo.eventstartdate)} ~ {dateFormatter.withHyphenYMD(festivalInfo.eventenddate)}</p>
      <img  className="show-image" src={festivalInfo.firstimage} alt={`${festivalInfo.title}사진`} />
      <p className="show-addr">{`${festivalInfo.addr1}, ${festivalInfo.addr2}`}</p>
    </div>
    
    } 
    </>
  )
}


export default FestivalShow;