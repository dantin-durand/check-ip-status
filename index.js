const fs = require("fs");
const net = require("net");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Adresse IP à surveiller

// Intervalle de vérification en millisecondes (1 minute = 60000 millisecondes)
const checkInterval = 60000;

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

// Fonction pour envoyer un e-mail
async function sendEmail(subject, message) {
  // Configuration du transporteur de courrier électronique (modifiez ces paramètres selon votre propre configuration)
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_ENCRYPTION == "ssl" ? true : false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // Configuration du courrier électronique
  let mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: process.env.MAIL_TO_ADDRESS,
    subject: subject,
    text: message,
  };

  // Envoi du courrier électronique
  await transporter.sendMail(mailOptions);
}

// Fonction pour vérifier la connexion à l'IP spécifiée
async function checkConnection() {
  return new Promise((resolve, reject) => {
    let socket = net.createConnection(
      process.env.IP_PORT,
      process.env.IP_ADDRESS
    );
    socket.on("connect", () => {
      socket.end();
      resolve(true);
    });
    socket.on("error", () => {
      resolve(false);
    });
  });
}

// Fonction principale
async function main() {
  // Chargement de l'état actuel (connecté ou déconnecté) à partir du fichier
  let currentStatus = fs.readFileSync("status.txt", "utf-8");

  // Vérification de la connexion
  let isConnected = await checkConnection();

  console.log("status: " + isConnected);

  // Si la connexion est perdue et que l'état actuel est "connecté", envoyer une alerte par e-mail et mettre à jour l'état dans le fichier
  if (!isConnected && currentStatus == "connected") {
    await sendEmail(
      "Connexion perdue - [" + getFormattedDate() + "]",
      "La connexion à l'IP spécifiée a été perdue."
    );
    fs.writeFileSync("status.txt", "disconnected");
    // write in log file
    fs.appendFileSync(
      "log.txt",
      "[" + getFormattedDate() + "] - disconnected\n"
    );
  }

  // Si la connexion est rétablie et que l'état actuel est "déconnecté", envoyer une alerte par e-mail et mettre à jour l'état dans le fichier
  if (isConnected && currentStatus == "disconnected") {
    await sendEmail(
      "Connexion rétablie - [" + getFormattedDate() + "]",
      "La connexion à l'IP spécifiée a été rétablie."
    );
    fs.writeFileSync("status.txt", "connected");
    // write in log file
    fs.appendFileSync(
      "log.txt",
      "[" + getFormattedDate() + "] - reconnected\n"
    );
  }
}

// Exécution de la fonction principale toutes les minutes
// setInterval(main, checkInterval);
main();
