const express = require("express");
const routes = require("./routes");
const apiLogger = require("./middleware/apiLogger");

const app = express();

app.use(apiLogger); // Log every API call
app.use(routes);

module.exports = app;
