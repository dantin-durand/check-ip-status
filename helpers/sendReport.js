const fs = require("fs");
const { sendEmail } = require("./sendEmail");
const { sendSMS } = require("./sendSMS");
const { getFormattedDate } = require("./getFormattedDate");

async function sendReport(status, translatedStatus) {
  try {
    const title = `Connexion ${translatedStatus} - [${getFormattedDate()}]`;
    const message = `La connexion à l'IP spécifiée a été ${translatedStatus} le ${getFormattedDate()}`;

    await sendEmail(title, message);
    await sendSMS(message);

    fs.writeFileSync("status.txt", status);
    // write in log file
    fs.appendFileSync(
      "log.txt",
      "[" + getFormattedDate() + "] - " + status + "\n"
    );
  } catch (error) {
    console.error(error);
  }
}
exports.sendReport = sendReport;
