 //dispatch, reducer ..
 //addeventlistner('click') 맨 아래 버튼 클릭해서 카드 페이지 추가
 //시/도 에 맞춰서 -군/구-읍/면/동 뜨는데 오류 안 나게..


import './StayList.css'
import { useState } from "react";


 function StayList() {
  const [staysSi, setStaysSi] = useState("default");
  const [staysGu, setStaysGu] = useState("default");
  const [staysDong, setStaysDong] = useState("default");

  const imageUrl = "http://tong.visitkorea.or.kr/cms/resource/06/2907806_image2_1.jpeg";

  return (
    <>
    <h4>숙박업소 리스트</h4>
    <div>
    <select value={staysSi} onChange={(e) => setStaysSi(e.target.value)}>
      <option value="default">시/도</option>
      <option value="seoul">서울</option>
      <option value="daegu">대구</option>
      <option value="busan">부산</option>
    </select>
    <select value={staysGu} onChange={(e) => setStaysGu(e.target.value)}>
      <option value="default">군/구</option>
      <option value="junggu">중구</option>
      <option value="namgu">남구</option>
      <option value="dalseonggun">달성군</option>
    </select>
    <select value={staysDong} onChange={(e) => setStaysDong(e.target.value)}>
      <option value="default">읍/면/동</option>
      <option value="hwawon">화원읍</option>
      <option value="dasa">다사읍</option>
      <option value="hyunpung">현풍읍</option>
    </select>
    </div>

    <div className="containerStay">
    <div className="cardStay">
            <div className="cardStay-img" style={{
            backgroundImage:`url("${imageUrl}")`}}></div>
            <p className="cardStay-title">서로재</p>
            <p className="cardStay-modifiedtime">20250414</p>
            <p className="addrStay">강원특별자치도 고성군 토성면 봉포2길 12</p>
            </div>
            <div className="cardStay">
            <div className="cardStay-img" style={{
            backgroundImage:`url("${imageUrl}")`}}></div>
            <p className="cardStay-title">서로재</p>
            <p className="cardStay-modifiedtime">20250414</p>
            <p className="addrStay">강원특별자치도 고성군 토성면 봉포2길 12</p>
            </div>
            </div>
    </>
  )

 }

 export default StayList;