const admin = require("firebase-admin")
const FirebaseServiceAccount = require('./congcampaign-firebase-adminsdk-jhe9y-5f302fd8c9.json');
admin.initializeApp({
    credential: admin.credential.cert(FirebaseServiceAccount)
})


async function sendNotification1(message, deviceTokens) {
    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    }
    const result = await admin.messaging().sendToDevice(deviceTokens, message, options)
    return result
}


module.exports = {
  sendNotification1
};

