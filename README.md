# Qstash Headless Reminder (poc)

No need to rely on Node.js, cron, or npm anymore; [Qstash](https://upstash.com) will handle the cron job. If it fails, it will retry itself, and we can also monitor cron jobs.

This repository contains a simple backend for users to create appointments with doctors. Additionally, it will send push notifications to users' mobile devices when the appointment meeting is scheduled.

This repository contains a simple backend built with:

- **Express.js**: For handling server-side operations.
- **Firebase (DB)**: Utilized for managing the database.
- **Qstash (Headless Cron)**: Handling scheduled tasks seamlessly.

**Note:** Firebase, Qstash data, and keys in this repository will be deleted soon.

For more details on optional parameters and configuration, refer to [Qstash Documentation](https://upstash.com/docs/qstash/howto/publishing#optional-parameters-and-configuration).
