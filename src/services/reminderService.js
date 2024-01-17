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

    reminders.forEach((reminder) => {
      // Assuming reminder.date and reminder.time are properly formatted
      const schedule = `${reminder.time.minute} ${reminder.time.hour} ${reminder.date.day} ${reminder.date.month} *`;
      logger.info(`Cron schedule: ${schedule}`); // Add this line to log the schedule string

      const tokenInfo = fcmTokens.find((token) => token.uid === reminder.uid);

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

module.exports = { setupReminders, addReminder, fetchReminders, updateReminder };
