const net = require("net");

// Fonction pour vérifier la connexion à l'IP spécifiée

async function checkConnection() {
  console.log("Checking connection...");
  return new Promise((resolve, reject) => {
    let socket = net.createConnection(
      process.env.IP_PORT,
      process.env.IP_ADDRESS,
      { timeout: 1000 }
    );
    socket.on("connect", () => {
      socket.end();
      console.log("Connection OK");
      resolve(true);
    });
    socket.on("error", () => {
      console.log("Connection ERROR");
      resolve(false);
    });
  });
}
exports.checkConnection = checkConnection;
