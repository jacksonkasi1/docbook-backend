const logger = require("../utils/logger");

const reminderService = require("../services/reminderService");
const qstashService = require("../services/qstashService");
const firebaseService = require("../services/firebaseService");

exports.refreshReminders = async (req, res) => {
  try {
    await reminderService.setupReminders();
    res.send({ success: true, message: "Reminders refreshed" });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error refreshing reminders" });
  }
};

exports.addReminder = async (req, res) => {
  try {
    // const body = {
      // patientName: "Jackson Kasi",
      // hospitalName: "City Hospital",
      // patientId: "12345",
      // type: "Daily",
      // date: "2024-01-17",
      // time: "08:00",
      // repeatFrequency: "Every Day",
      // repeatDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      // uid: "Ozwx7RXcTCLoz3W4kMAt"
    // };

    const reminderId = await reminderService.addReminder(req.body);

    const payload = {
      ...req.body,
      reminderId: reminderId,
    }

     await qstashService.setCronTrigger(payload);
    res
      .status(201)
      .json({ success: true, message: "Reminder added", id: reminderId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const reminders = await reminderService.fetchReminders();
    res.json(reminders);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    await reminderService.updateReminder(req.params.id, req.body);

    const payload = {
      ...req.body,
      reminderId: req.params.id,
    }

     await qstashService.setCronTrigger(payload);
    res
      .status(201)
      .json({ success: true, message: "Reminder added", id: reminderId });

    res.send({ success: true, message: "Reminder updated" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    await reminderService.deleteReminder(req.params.id);
    res.send({ success: true, message: "Reminder deleted" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.sendReminders = async (req, res) => {
  try {
    const result = await reminderService.sendReminder(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.reminderTestTest = async (req, res) => {
  try {
    const message = "This is a test reminder 📚";

    const payloadData = {
      patientName: "Hospital",
      hospitalName: "Hospital",
      uid: "Ozwx7RXcTCLoz3W4kMAt",
      patientId: "12345",
      date: "2024-01-17",
      time: "08:00",
    };

    const result = await firebaseService.sendNotificationToUser(req.params.fcm_token, message, payloadData);
    res.send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
