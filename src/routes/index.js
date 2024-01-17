const express = require('express');
const reminderController = require('../controllers/reminderController');
const router = express.Router();

router.get('/', (req, res) => res.send('Hello World!'));

router.get('/reminder-refresh', reminderController.refreshReminders);


router.get('/reminders', reminderController.getReminders);
router.post('/reminders/add', reminderController.addReminder);
router.post('/reminders/:id', reminderController.updateReminder);


module.exports = router;
