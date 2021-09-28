const express = require("express");
const router = require("./routes/index");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(express.static("data"));

app.use(router.psdRouter);
app.use(router.ytRouter);

module.exports = app;
