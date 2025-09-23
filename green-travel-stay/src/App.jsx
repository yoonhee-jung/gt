import Header from './components/common/Header.jsx';
import './App.css';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { useEffect } from 'react';
import { localStorageUtil } from './utils/localStorageUtil.js';
import { dateFormatter } from './utils/dateFormatter.js';
import BeforeInstallPrompt from './components/BeforeInstallPrompt.jsx';


function App() {

  useEffect(( )=> {  
    const clearDate = localStorageUtil.getClearDate();
    // const now = new Date()
    const nowDate = dateFormatter.formatDateToYMD(new Date());
    
    
      if ( clearDate !== nowDate )
        { 
          localStorageUtil.clearLocalstorage();
          localStorageUtil.setClearDate(nowDate);
          window.location.reload(); //쉽게 돌아가는 방법.. state가 초기화 되지 않는 현상을 해결하기 위해, 강제로 화면 새로 고침
        } 


  }, [])

  return (
    <>
      <BeforeInstallPrompt></BeforeInstallPrompt>
      <Header />
      <main>
        <Outlet />
      </main>

      {/* 스크롤 초기화, 최상위 컴포넌트에 한 번만 추가 */}
      <ScrollRestoration></ScrollRestoration>

    </>
  )
}

export default App;
