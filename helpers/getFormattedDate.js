// get formatted date with time
function getFormattedDate() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return (
    dt + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds
  );
}
exports.getFormattedDate = getFormattedDate;
