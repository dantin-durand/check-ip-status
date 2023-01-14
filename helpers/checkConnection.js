const net = require("net");

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
exports.checkConnection = checkConnection;
