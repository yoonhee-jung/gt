import { KEY_LOCALSTORAGE_STAY_FLG, KEY_LOCALSTORAGE_STAY_LIST, KEY_LOCALSTORAGE_STAY_PAGE } from "../configs/keysStay.js"
import { KEY_LOCALSTORAGE_CLEAR_DATE, KEY_LOCALSTORAGE_FESTIVAL_FLG } from "../configs/keys.js"



export const localStorageUtilStay = {

  clearLocalstorage: () => {
    localStorage.clear()
  }, // localstorage와 관련된 책임은 모두 localStorageUtil에 주기 위해.. 코드 분리하는 것. 그러면 분석이 쉬워짐.. 


  setLocalStorage: (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
  },
  getLocalStorage: (key) => {
    return localStorage.getItem(key)
  },
  //역할 중심

  /**
   * 로컬스토리지에 페스티벌 스크롤 플래그 저장
   * @param {boolean} flg 
   */
  setFestivalScrollFlg: (flg) => {
    localStorage.setItem(KEY_LOCALSTORAGE_FESTIVAL_FLG, JSON.stringify(flg));
  },

   /**
   * 로컬스토리지에 페스티벌 스크롤 플래그 반환
   * @param {boolean} flg 
   */
  getFestivalScrollFlg: () => {
    return JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE_FESTIVAL_FLG))
  },
/**
 * 로컬스토리지에 로컬스토리지 클리어 날짜 저장
 * @param {string} dateYMD 
 */
  setClearDate: (dateYMD) => {
    localStorage.setItem(KEY_LOCALSTORAGE_CLEAR_DATE, dateYMD)

  },

  /**
   * 로컬스토리지의 로컬스토리지 클리어 날짜 반환
   * @returns {string | null}
   * 
   */
  getClearDate: () => {
    return localStorage.getItem(KEY_LOCALSTORAGE_CLEAR_DATE)
  },




  /* 로컬스토리지에 페스티벌 리스트 저장
 * @param {[]} festivalList
 */
  setStayList: (data) => {
    localStorage.setItem(KEY_LOCALSTORAGE_STAY_LIST, JSON.stringify(data))
  },
  /**로컬스토리지의 페스티벌 리스트 반환
   * @returns {[]} festivalList
   */
  getStayList: () => {
    return JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE_STAY_LIST))
  },
/**
 * @param {number} pageNo
 * 로컬 스토리지에 페스티벌 페이지 번호 저장
 */
  setStayPage: (pageNo) => {
    localStorage.setItem(KEY_LOCALSTORAGE_STAY_PAGE, pageNo.toString())
    // localStorage.setItem(KEY_LOCALSTORAGE_FESTIVAL_PAGE, JSON.stringify(pageNo))
  },
  getStayPage: () => {
    return parseInt(localStorage.getItem(KEY_LOCALSTORAGE_STAY_PAGE))
  },
  //책임 중심


  /**
   * 로컬스토리지에 페스티벌 스크롤 플래그 저장
   * @param {boolean} flg 
   */
  setStayScrollFlg: (flg) => {
    localStorage.setItem(KEY_LOCALSTORAGE_STAY_FLG, JSON.stringify(flg));
  },

   /**
   * 로컬스토리지에 페스티벌 스크롤 플래그 반환
   * @param {boolean} flg 
   */
  getStayScrollFlg: () => {
    return JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE_STAY_FLG))
  },
/**
 * 로컬스토리지에 로컬스토리지 클리어 날짜 저장
 * @param {string} dateYMD 
 */
 

  /**
   * 로컬스토리지의 로컬스토리지 클리어 날짜 반환
   * @returns {string | null}
   * 
   */

}


  