export const dateCalculater = {
  /**
   * 현시간기준 timstamp만큼 과거의 날짜를 계산하여 Date객체 반환
   * @param {number} timestamp 
   * @returns {Date} Date
   */
  getPastDate: (timestamp) => {
    const now = new Date();
    return new Date(now - timestamp);
  }
}