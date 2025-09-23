 //dispatch, reducer ..
 //addeventlistner('click') 맨 아래 버튼 클릭해서 카드 페이지 추가
 //시/도 에 맞춰서 -군/구-읍/면/동 뜨는데 오류 안 나게..
import { useDispatch, useSelector } from 'react-redux';
import './StayList.css'
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { stayIndex } from '../../store/thunks/stayThunk.js';
import { setScrollEventFlg } from '../../store/slices/staySlice.js';
import { setStayInfo } from '../../store/slices/stayShowSlice.js';
import StayListSelect from './StayListSelect.jsx'


 function StayList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stayList = useSelector(state => state.stay.list);
  const scrollEventFlg = useSelector(state => state.stay.scrollEventFlg);


useEffect(() => {
    // TODO
    // 로컬스토리지에 저장된 날짜를 획득
    //   저장된 날짜 없으면 로컬스토리지에 현재 날짜 저장=
    //   저장된 날짜 있으면 아래처리 속행
    //      오늘날짜랑 비교
    //        날짜가 과거면 로컬 스토리지 및 스테이트 초기화
    //        아직 과거가 아니면 처리속행

    window.addEventListener('scroll', addNextPage);
    
    if(stayList.length === 0) {
      dispatch(stayIndex());
    }

    return () => {
      window.removeEventListener('scroll', addNextPage);
    }
  }, []);

  // 다음 페이지 가져오기
  function addNextPage() {
    // 스크롤 관련 처리
    const docHeight = document.documentElement.scrollHeight; // 문서의 Y축 총 길이
    const winHeight = window.innerHeight; // 윈도우의 Y축 총 길이
    const nowHeight = Math.ceil(window.scrollY); // 현재 스크롤의 Y축 위치
    const viewHeight = docHeight - winHeight; // 스크롤을 끝까지 내렸을 때의 Y축 위치
    
    if(viewHeight === nowHeight && scrollEventFlg) {
      dispatch(setScrollEventFlg(false));
      dispatch(stayIndex());
    }
  }

//상세페이지로 이동
function redirectShow(item) {
  dispatch(setStayInfo(item));
  navigate(`/stays/${item.contentid}`);
}

  return (
    <>
    <StayListSelect />
      <div className="container">
        {
          stayList && 
          stayList.map(item => {
            return (
              <div className="card" onClick={() => {redirectShow(item)}} key={item.contentid + item.createdtime}>
                <div className="card-img" style={{backgroundImage: `url('${item.firstimage}')`}}></div>
                <p className="card-title">{item.title}</p>
                <p className="card-period">업데이트일:{item.modifiedtime}</p>
                <p className="card-addr">{item.addr1}</p>
              </div>
            );
          })
        }
      </div>
     {/* <button type="button" onClick={addNextPage}>더 보기</button> */}
    </>
  )
}


 export default StayList;