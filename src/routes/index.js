const express = require('express');
const reminderController = require('../controllers/reminderController');
const router = express.Router();

router.get('/', (req, res) => res.send('Hello World!'));

router.get('/reminder-refresh', reminderController.refreshReminders);

router.get('/reminders', reminderController.getReminders);
router.post('/reminders/add', reminderController.addReminder);
router.post('/reminders/:id', reminderController.updateReminder);
router.delete('/reminders/:id', reminderController.deleteReminder);

router.post("/reminders-send", reminderController.sendReminders);


module.exports = router;
