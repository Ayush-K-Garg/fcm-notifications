const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

// Initialize Firebase Admin SDK
const serviceAccount = require('D:/Web Dev/fcm-notifications/pro-1-d9ae4-firebase-adminsdk-iimfo-d33db4baec.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Set up the express server
const app = express();
app.use(bodyParser.json());

// Endpoint to send notifications
app.post('/send-notification', async (req, res) => {
  const { title, body, topic } = req.body;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    topic: topic,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).send({ message: 'Notification sent', response: response });
  } catch (error) {
    res.status(500).send({ message: 'Error sending notification', error: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
