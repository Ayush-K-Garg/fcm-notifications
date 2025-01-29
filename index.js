require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

// Ensure FIREBASE_CREDENTIALS is properly loaded
if (!process.env.FIREBASE_CREDENTIALS) {
  console.error("❌ Firebase credentials not found in environment variables.");
  process.exit(1);
}

// Parse JSON safely
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} catch (error) {
  console.error("❌ Error parsing Firebase credentials JSON:", error.message);
  process.exit(1);
}

// Check if `project_id` exists
if (!serviceAccount.project_id) {
  console.error("❌ Invalid Firebase credentials: 'project_id' is missing.");
  process.exit(1);
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Set up Express server
const app = express();
app.use(bodyParser.json());

// Endpoint to send notifications
app.post('/send-notification', async (req, res) => {
  const { title, body, topic } = req.body;

  const message = {
    notification: { title, body },
    topic,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).send({ message: 'Notification sent', response });
  } catch (error) {
    res.status(500).send({ message: 'Error sending notification', error: error.message });
  }
});
console.log("Firebase Credentials:", process.env.FIREBASE_CREDENTIALS ? "Loaded" : "Not Found");

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
