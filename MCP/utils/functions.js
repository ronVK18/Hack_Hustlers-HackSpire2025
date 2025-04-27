export const isHoliday=(date = new Date()) => {
    // Check if it's Sunday
    if (date.getDay() === 0) {
      return { isHoliday: true, holidayName: "Sunday" };
    }
    
    // US holidays 2025 - [month, day, name]
    const holidays = [
      [0, 1, "New Year's Day"],
      [0, 20, "Martin Luther King Jr. Day"],
      [1, 17, "Presidents' Day"],
      [4, 26, "Memorial Day"],
      [5, 19, "Juneteenth"],
      [6, 4, "Independence Day"],
      [8, 1, "Labor Day"],
      [9, 13, "Columbus Day"],
      [10, 11, "Veterans Day"],
      [10, 27, "Thanksgiving"],
      [11, 25, "Christmas"]
    ];
  
    const month = date.getMonth();
    const day = date.getDate();
    
    const holiday = holidays.find(h => h[0] === month && h[1] === day);
    return holiday ? 
      { isHoliday: true, holidayName: holiday[2] } : 
      { isHoliday: false, holidayName: null };
  }
// module.exports = { isHoliday };
export const predictWeather=(date = new Date()) => {
    const month = date.getMonth(); // 0-11 (Jan-Dec)
    
    // Simple seasonal predictions (Northern Hemisphere)
    if (month >= 11 || month <= 1) {
      // Winter (Dec-Feb)
      return 'cloudy';
    } else if (month >= 2 && month <= 4) {
      // Spring (Mar-May)
      return 'rainy';
    } else if (month >= 5 && month <= 8) {
      // Summer (Jun-Sep)
      return 'clear';
    } else {
      // Fall (Oct-Nov)
      return 'cloudy';
    }
  }