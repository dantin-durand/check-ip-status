const { Vonage } = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: process.env.SMS_API_KEY,
  apiSecret: process.env.SMS_API_SECRET,
});

// Fonction pour envoyer un SMS
async function sendSMS(message) {
  const from = process.env.SMS_FROM;
  const to = process.env.SMS_TO;
  const text = message;

  // Envoi du SMS
  await vonage.sms.send({ to, from, text });
}
exports.sendSMS = sendSMS;
