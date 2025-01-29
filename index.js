const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

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

// Use environment variable for port or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
