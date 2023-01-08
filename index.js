const fs = require("fs");
const net = require("net");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Adresse IP à surveiller
const ipAddress = process.env.IP_ADDRESS;

// Intervalle de vérification en millisecondes (30 secondes)
const checkInterval = 30000;

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
    let socket = net.createConnection(80, ipAddress);
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

  console.log("isConnected: " + isConnected);

  // Si la connexion est perdue et que l'état actuel est "connecté", envoyer une alerte par e-mail et mettre à jour l'état dans le fichier
  if (!isConnected && currentStatus == "connected") {
    await sendEmail(
      "Connexion perdue",
      "La connexion à l'IP spécifiée a été perdue."
    );
    fs.writeFileSync("status.txt", "disconnected");
  }

  // Si la connexion est rétablie et que l'état actuel est "déconnecté", envoyer une alerte par e-mail et mettre à jour l'état dans le fichier
  if (isConnected && currentStatus == "disconnected") {
    await sendEmail(
      "Connexion rétablie",
      "La connexion à l'IP spécifiée a été rétablie."
    );
    fs.writeFileSync("status.txt", "connected");
  }
}

// Exécution de la fonction principale toutes les minutes
setInterval(main, checkInterval);
// main();
