const express = require('express');
const reminderController = require('../controllers/reminderController');
const router = express.Router();

router.get('/', (req, res) => res.send('Hello World!'));
router.post('/', (req, res) => res.send('Hello World!'));

router.get('/reminder-refresh', reminderController.refreshReminders);

router.get('/reminders', reminderController.getReminders);

router.post('/reminders/add', reminderController.addReminder);
router.post('/reminders/:id', reminderController.updateReminder);
router.delete('/reminders/:id', reminderController.deleteReminder);

// upstash
router.post("/reminders-send", reminderController.sendReminders);

/**
 * ____________
 * TEST ROUTES
 * ____________
 */
router.get('/notification-test/:fcm_token', reminderController.reminderTestTest);

// fTrKT5J4QlKNW_BnSAo00E:APA91bF8I9kNuo5Xm6_2a72xxxxxxxxxxxxxxxxxxxxxzv


module.exports = router;
