 //dispatch, reducer ..
 //addeventlistner('click') 맨 아래 버튼 클릭해서 카드 페이지 추가
 //시/도 에 맞춰서 -군/구-읍/면/동 뜨는데 오류 안 나게..

import './StayShow.css'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setStayInfo } from "../../store/slices/stayShowSlice.js"


 function StayShow() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stayInfo = useSelector(state => state.stayShow.stayInfo);
  const stayList = useSelector(state => state.stay.list);

  find(item => params.id === item.contentid);

    useEffect(() => {

const item = stayList.find(item => params.id === item.contentid);
      dispatch(setStayInfo(item));

    }, [])

function redirectBack() {
  navigate(-1);
}

   return (
     <>
    {stayInfo.title &&
    <div className="container">
    <div className="card"> 
    <button type="button" onClick={redirectBack}>되돌아가기</button>
    <div className="card-img" style={{
    backgroundImage:`url('${stayInfo.firstimage}')`}}></div>
    <p className="card-title">{stayInfo.title}</p>
    <p className="card-modifiedtime">업데이트일: {stayInfo.modifiedtime}</p>
    <p className="addr">{stayInfo.addr1}</p>        
    </div>
    </div>
    }
    </>
  )

 }

 export default StayShow;