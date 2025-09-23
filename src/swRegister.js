//서비스 워커랑 같은 위치에 생성..
// A in B, .. 자동으로 B 안에 A 가 있는지 확인하고 있으면 등록 실시.

const swRegister = () => {
  if('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register(
      '/sw.js',  //서비스 워커의 경로
      {
        scope: '/',

      }
    )
    .then(registration => {
      console.log('서비스 워커 등록 성공됨', registration);
    })
    .catch(err => {
      console.error('서비스 등록 실패됨', err);
    });
  }
}

export default swRegister;