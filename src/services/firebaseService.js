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

const sendNotificationToUser = async (token, message) => {
  const payload = {
    notification: {
      title: "Reminder",
      body: message,
    },
    token: token,
  };

  try {
    await admin.messaging().send(payload);
  } catch (error) {
    throw new Error(`Error sending notification: ${error.message}`);
  }
};

module.exports = {
  fetchDataFromCollection,
  addReminder,
  fetchReminders,
  updateReminder,
  sendNotificationToUser,
};
