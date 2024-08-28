


const currentTimeInIST = () => {
  const currentTime = new Date();
  const utcTime = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);
  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (UTC+5:30)
  const istTime = new Date(utcTime + istOffset);
  return istTime;
};