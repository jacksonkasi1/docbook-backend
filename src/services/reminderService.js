const cron = require("node-cron");
const {
  fetchDataFromCollection,
  sendNotificationToUser,
  addReminder,
  deleteReminder,
  fetchReminders,
  updateReminder,
  getFcmTokenForUser,
} = require("./firebaseService");
const logger = require("../utils/logger");

const setupReminders = async () => {
  try {
    const reminders = await fetchDataFromCollection("Reminder");
    const fcmTokens = await fetchDataFromCollection("Fcm_Token");

    console.log({ fcmTokens });

    reminders.forEach((reminder) => {
      // Parsing the time and date
      const timeParts = reminder.time.split(":"); // Splits "HH:MM:SS"
      const dateParts = reminder.date.split("-"); // Splits "YYYY-MM-DD"

      // Assuming the cron job needs to be set daily at the specified time
      const schedule = `${timeParts[1]} ${timeParts[0]} * * *`; // "minute hour * * *"

      logger.info(`Cron schedule: ${schedule}`);

      const tokenInfo = fcmTokens.find((token) => token.uid === reminder.uid);

      console.log({ tokenInfo });

      if (tokenInfo) {
        cron.schedule(schedule, () => {
          sendNotificationToUser(
            tokenInfo.token,
            `Reminder for ${reminder.patientName}`,
          )
            .then(() =>
              logger.log(`Notification sent to ${reminder.patientName}`),
            )
            .catch((error) =>
              logger.error(`Error sending notification: ${error.message}`),
            );
        });
      } else {
        logger.log(`No token found for user ID: ${reminder.uid}`);
      }
    });
  } catch (error) {
    logger.error(`Error in setupReminders: ${error.message}`);
    throw error;
  }
};

const sendReminder = async (data) => {
  logger.info(`Preparing to send reminder: ${data.patientName}`);

  try {
    const tokenInfo = await getFcmTokenForUser(data.uid);

    if (!tokenInfo) {
      logger.warn(`No FCM token found for user ID: ${data.uid}`);
      throw new Error(`FCM token not found for user ID: ${data.uid}`);
    }

    logger.info(JSON.stringify(tokenInfo));

    const result =  await sendNotificationToUser(
      tokenInfo.token,
      `Reminder for ${data.patientName}`,
      data,
    );
    logger.log(`Notification sent to ${data.patientName}`);
    return result;
  } catch (error) {
    // Ensure the second argument is an object for error logging
    logger.error(`Error in sendReminder`, { message: error.message });
    throw error; // Re-throw the error for further handling if necessary
  }
};

module.exports = {
  setupReminders,
  addReminder,
  fetchReminders,
  updateReminder,
  deleteReminder,
  sendReminder,
  sendNotificationToUser,
};
