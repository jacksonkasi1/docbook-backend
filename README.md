# Qstash Headless Reminder (poc)

No need to rely on Node.js, cron, or npm anymore; [Qstash](https://upstash.com) will handle the cron job. If it fails, it will retry itself, and we can also monitor cron jobs.

This repository contains a simple backend for users to create appointments with doctors. Additionally, it will send push notifications to users' mobile devices when the appointment meeting is scheduled.

This repository contains a simple backend built with:

- **Express.js**: For handling server-side operations.
- **Firebase (DB)**: Utilized for managing the database.
- **Qstash (Headless Cron)**: Handling scheduled tasks seamlessly.

---

### Cons of Legacy Node.js Cron Jobs:

- **Deployment Dependency:**
  - Redeploying code can disrupt Node.js cron jobs, leading to potential failures and missed tasks during deployment periods.

- **Limited Monitoring:**
  - Traditional Node.js cron jobs lack built-in monitoring, making it challenging to easily track, identify, and troubleshoot issues.

- **Manual Retry:**
  - In case of failure, manual intervention is required to trigger a retry, which may lead to delays in critical task execution.

- **Management Complexity:**
  - Managing traditional Node.js cron jobs lacks a centralized system, making it more complex to organize and monitor cron tasks efficiently.

- **Server Dependence:**
  - Running cron jobs within a Node.js server can limit server resources and hinder scalability, especially in a serverless architecture.

### Pros of Qstash (Headless Cron):

- **Automatic Retry:**
  - Qstash automates job retry on failure, ensuring tasks are retried without manual intervention, improving reliability.

- **Continuous Operation During Deployment:**
  - Redeploying code does not impact Qstash cron jobs, ensuring uninterrupted operation during code updates or deployments.

- **Built-in Monitoring:**
  - Qstash provides a management system with built-in monitoring capabilities, simplifying the tracking and troubleshooting of cron jobs.

- **Serverless Support:**
  - Qstash supports a serverless approach, allowing for efficient resource utilization without the need for a dedicated server for cron jobs.

- **Reliability and Predictability:**
  - Qstash offers a more reliable and predictable environment for cron jobs, reducing the likelihood of task failures.

---

**Note:** Firebase, Qstash data, and keys in this repository will be deleted soon.

For more details on optional parameters and configuration, refer to [Qstash Documentation](https://upstash.com/docs/qstash/howto/publishing#optional-parameters-and-configuration).
