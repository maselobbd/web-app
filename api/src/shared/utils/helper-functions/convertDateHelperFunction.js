function convertToSqlDatetime(dateStr) {

    const [month, day, year] = dateStr.split("/");
  
    const sqlDatetime = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} 00:00:00`;
  
    return sqlDatetime;
  }

function convertDateTimeToStandard(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year} ${hours}:${minutes}`;
}
module.exports = {convertToSqlDatetime, convertDateTimeToStandard}