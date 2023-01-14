require("dotenv").config();
const fs = require("fs");
const { checkConnection } = require("./helpers/checkConnection");
const { sendReport } = require("./helpers/sendReport");

const checkInterval = 30000;

async function main() {
  let lastStatus = fs.readFileSync("status.txt", "utf-8");
  let isConnected = await checkConnection();

  if (!isConnected && lastStatus == "connected") {
    sendReport("disconnected", "perdue");
  }

  if (isConnected && lastStatus == "disconnected") {
    sendReport("connected", "rétablie");
  }
}

setInterval(main, checkInterval);
