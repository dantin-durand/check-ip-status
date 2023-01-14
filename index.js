const fs = require("fs");
require("dotenv").config();
const { checkConnection } = require("./helpers/checkConnection");
const { sendReport } = require("./helpers/sendReport");

async function main() {
  let lastStatus = fs.readFileSync("status.txt", "utf-8");
  let isConnected = await checkConnection();

  if (!isConnected && lastStatus == "connected") {
    await sendReport("disconnected", "perdue");
  }

  if (isConnected && lastStatus == "disconnected") {
    await sendReport("connected", "rétablie");
  }
}

(async () => {
  console.log("Monitoring started");
  await main();
  console.log("Monitoring ended");
})();
