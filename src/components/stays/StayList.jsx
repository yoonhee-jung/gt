 //dispatch, reducer ..
 //addeventlistner('click') 맨 아래 버튼 클릭해서 카드 페이지 추가
 //시/도 에 맞춰서 -군/구-읍/면/동 뜨는데 오류 안 나게..import { useEffect } from "react";
import StayListSelect from './StayListSelect.jsx';

// 이미 만든 카드 컴포넌트 재사용

export default function StayList() {

 return (
    <>
      <StayListSelect />
    </>
  )
   
}
<!-- git push -->