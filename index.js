const express = require("express");
const moment = require("moment");
const admin = require("firebase-admin");
const app = express();
const port = 3000;
const serviceAccount = require("./docbook-67847-firebase-adminsdk-dxh7i-1f387b44c9.json");
const cron = require("node-cron");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://docbook-67847.firebaseio.com",
});
const db = admin.firestore();

const fetchDataFromFirestore = async () => {
  const snapshot = await db.collection("Reminder").get();
  const reminders = [];

  snapshot.forEach((doc) => {
    reminders.push({ id: doc.id, ...doc.data() });
  });

  return reminders;
};
const fetchDataFromFcmToken = async () => {
  const snapshot = await db.collection("Fcm_Token").get();
  const fcmToken = [];

  snapshot.forEach((doc) => {
    fcmToken.push({ id: doc.id, ...doc.data() });
  });

  return fcmToken;
};

const setupReminders = (reminders, fcmData) => {
    console.log("here hitting")
  reminders.forEach((reminder) => {
    console.log("inside", reminder)
    let date = moment(`${reminder.date} ${reminder?.time}`, "YYYY-MM-DD hh:mm");
    let tokens = fcmData.filter((i) => i?.uid == reminder?.uid);
    if (tokens.length > 0) {
      cron.schedule(date.format("m H D M d"), () => {
        // Schedule notification every day at 8 AM "44 11 * * *"date.format("m H D M d")
        sendNotificationToUser(
          tokens[0]?.token,
          "Your scheduled notification message"
        );
      });
    } else {
      console.log("No token found");
    }
  });
};

function sendNotificationToUser(token, message) {
  // Retrieve the user's FCM token from the database
  const payload = {
    notification: {
      title: "Your Notification Title",
      body: message,
    },
    token: token,
  };

  admin
    .messaging()
    .send(payload)
    .then((response) => {
      console.log("Notification sent successfully:", response);
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
    });
}

// Example: Run the process
const runProcess = async () => {
  const reminders = await fetchDataFromFirestore();
  const fcmData = await fetchDataFromFcmToken();
  setupReminders(reminders, fcmData);
};

app.get('/refresh', (req,res)=>{
    runProcess().then(()=>{
        console.log("Success")
        res.send({
            success: true,
            message: "Success"
        })
    })
})

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
