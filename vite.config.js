import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({


    registerType: 'autoUpdate', //서비스 워커 자동 업데이트
    strategies: 'injectManifest', //커스텀 서비스워커 사용 설정
    srcDir: 'src', //커스텀 서비스워커가 배치되어 있는 디렉터리
    filename: 'sw.js', //커스텀 서비스워커 파일명
    includeAssets: [
      //로컬 경로의 이미지 참조(PWA에 포함 시킬 정적 파일)
      '/icons/icon-180.png',
      '/icons/icon-192.png',
      '/icons/icon-512.png',
      '/base/andon_tal.png',
      //슬러시가 웹서버의 루트 경로 기준
    ],
    manifest: {
      name: 'Green Travel', //PWA 어플 이름 ..설치 배너에 표시
      short_name: '', //홈 화면 아이콘 아래에 표시될 이름
      description: '관광 정보 제공', //어플 설명
      theme_color: '#fff', //브라우저 UI 테마 색상
      background_color: '#ffffff36', //기본 배경색
      language: 'ko', //언어 설정
      display: 'standalone', //브라우저 없이 어플처럼 독립 실행
      orientation: 'portrait', //어플 실행 시 뷰의 기본 방향을 세로로 설정
      start_url: '/', //메인화면이면 /, 리스트화면이면 /festivals .. PWA가 설치되어 있을 때, 홈화면에서 어플을 실행했을 때 처음 열릴 URL 설정
      icons: [
        //편의를 위해 public 디렉토리에 배치하고 사용할 것
        
        {
          src: '/icons/icon-192.png', //로컬 경로 설정
          sizes: '192x192', //아이콘 크기 지정
          type: 'image/png', //해당 파일의 타입
          purpose: 'any',
        
          //Window(Edge, Chrome on Desktop 등)일 때 'any'로 설정된 것 중 가장 첫 번째 아이콘을 사용.

          //android(Edge, Chrome 등등 모바일용 브라우저)일 때 'maskable'을 우선 사용
          
          //iOS()일 때 manifest를 무시하고 index.html의 <link rel="apple-touch-icon">만 사용
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png', 
          purpose: 'maskable',
        },
      ],
    }
  })],
})
