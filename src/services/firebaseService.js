const admin = require("firebase-admin");
const db = require("../config/firebaseConfig");

const fetchDataFromCollection = async (collectionName) => {
  try {
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(
      `Error fetching data from ${collectionName}: ${error.message}`,
    );
  }
};

const addReminder = async (reminderData) => {
  try {
    const newReminderRef = await db.collection("Reminder").add(reminderData);
    return newReminderRef.id; // Returning the ID of the newly created reminder
  } catch (error) {
    throw new Error(`Error adding new reminder: ${error.message}`);
  }
};

const fetchReminders = async () => {
  try {
    const reminders = await db.collection("Reminder").get();
    return reminders.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error fetching reminders: ${error.message}`);
  }
};

const updateReminder = async (reminderId, reminderData) => {
  try {
    await db.collection("Reminder").doc(reminderId).update(reminderData);
  } catch (error) {
    throw new Error(`Error updating reminder: ${error.message}`);
  }
};

const deleteReminder = async (reminderId) => {
  try {
    await db.collection("Reminder").doc(reminderId).delete();
  } catch (error) {
    throw new Error(`Error deleting reminder: ${error.message}`);
  }
};

const getFcmTokenForUser = async (uid) => {
  const fcmTokens = await fetchDataFromCollection("Fcm_Token");
  return fcmTokens.find((token) => token.uid === uid);
};

const sendNotificationToUser = async (token, message, data) => {
  const payload = {
    notification: {
      title: "Reminder",
      body: message,
    },
    token: token,
  };

  try {
    await admin.messaging().send(payload);

    if (data) {
      // Add Notification History
      db.collection("Notifications").add({
        token: token,
        message: message,
        date: new Date(),
        patientName: data.patientName,
        hospitalName: data?.hospitalName,
        uid: data.uid,
        patientId: data.patientId,
        date: data.date,
        time: data.time,
      });
    }
  } catch (error) {
    throw new Error(`Error sending notification: ${error.message}`);
  }
};

module.exports = {
  fetchDataFromCollection,
  addReminder,
  fetchReminders,
  updateReminder,
  deleteReminder,
  getFcmTokenForUser,
  sendNotificationToUser,
};
