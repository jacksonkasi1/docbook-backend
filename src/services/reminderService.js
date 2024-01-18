const cron = require("node-cron");
const {
  fetchDataFromCollection,
  sendNotificationToUser,
  addReminder,
  fetchReminders,
  updateReminder,
} = require("./firebaseService");
const logger = require("../utils/logger");

const setupReminders = async () => {
  try {
    const reminders = await fetchDataFromCollection("Reminder");
    const fcmTokens = await fetchDataFromCollection("Fcm_Token");

    console.log({fcmTokens});

    reminders.forEach((reminder) => {
      // Parsing the time and date
      const timeParts = reminder.time.split(":"); // Splits "HH:MM:SS"
      const dateParts = reminder.date.split("-"); // Splits "YYYY-MM-DD"

      // Assuming the cron job needs to be set daily at the specified time
      const schedule = `${timeParts[1]} ${timeParts[0]} * * *`; // "minute hour * * *"

      logger.info(`Cron schedule: ${schedule}`);

      const tokenInfo = fcmTokens.find((token) => token.uid === reminder.uid);

      console.log({tokenInfo});

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

module.exports = {
  setupReminders,
  addReminder,
  fetchReminders,
  updateReminder,
};
