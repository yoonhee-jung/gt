npm i react-router-dom @reduxjs/toolkit react-redux redux-thunk axios


==PWA 적용==
1.  설치

npm install -D vite-plugin-pwa

2.  Manifest설정
=`vite.config.js`에 pwa Manifest 설정을 추가
=아이콘 이미지는 아래의 사이즈별로 필요
    =180*180(iOS), 192*192(web | android), 512*512(web | android)

3.  서비스 워커 작성
=`/src/sw.js`, `src/swRegister.js` 파일 2개 작성

4.  `src/main.jsx`에 서비스 워커 레지스터 추가

5.  //순서 상관 없음
iOS 대응을 위해 `index.html`에 metadata 설정(iOS 대응 및 Manifest 기본 설정)

6.  위 설정 완료 후 빌드
npm run build

7.  빌드한 것으로 동작하는 내장 서버 실행
npm run preview

ctrl + F5 -> 새로 확인할 때 눌러보는 것이 좋음 그 전 데이터 남아있어서 오류처럼 보이는 때도 있음