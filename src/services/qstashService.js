const axios = require("axios");
const moment = require("moment");

const dayOfWeekMap = {
  Sunday: "0",
  Monday: "1",
  Tuesday: "2",
  Wednesday: "3",
  Thursday: "4",
  Friday: "5",
  Saturday: "6",
};

const generateCronExpression = (type, date, time, repeatDays) => {
  const timeParts = moment(time, "HH:mm").format("m H").split(" ");
  const dateParts = date.split("-");

  switch (type) {
    case "Daily":
      return `${timeParts[0]} ${timeParts[1]} * * *`;
    case "Weekly":
      const daysOfWeek = repeatDays.map((day) => dayOfWeekMap[day]).join(",");
      return `${timeParts[0]} ${timeParts[1]} * * ${daysOfWeek}`;
    case "Monthly":
      return `${timeParts[0]} ${timeParts[1]} ${dateParts[2]} * *`;
    case "Yearly":
      return `${timeParts[0]} ${timeParts[1]} ${dateParts[2]} ${dateParts[1]} *`;
    case "Once":
      // For a one-time event, set it to the specific minute, hour, day, month
      return `${timeParts[0]} ${timeParts[1]} ${dateParts[2]} ${dateParts[1]} ${dateParts[0]}`;
    default:
      return ""; // Default case, can be adjusted as needed
  }
};

const setCronTrigger = async (body) => {
  const url =
    "https://qstash.upstash.io/v2/schedules/https://docbook-be.onrender.com/api/reminders-send";

  const token =
    "eyJVc2VySUQiOiI5NGIyMTA2Mi0wZDU3LTQxYzQtOWEzMC00YTIyMTU5NTJkNGMiLCJQYXNzd29yZCI6Ijc5ODc4NTUzOThmMzRjMzk5NDI4YWYwMjk0MzhmNGFkIn0=";
  const cronExpression = generateCronExpression(
    body.type,
    body.date,
    body.time,
    body.repeatDays,
  );

  try {
    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Upstash-Cron": cronExpression,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error setting cron trigger:", error);
    throw error;
  }
};

module.exports = { setCronTrigger };
