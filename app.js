const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const connectDB = require('./config/db')
const noteRoutes =require('./routes/notesRoutes');
require("./config/db")
require('dotenv').config

const app = express();
connectDB()
// Cấu hình EJS
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true }));
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public')); // Chứa các file tĩnh (CSS, JS)

// Sử dụng routes
app.use('/', noteRoutes);

// Chạy server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(chalk.green(`Server is running at http://localhost:${PORT}`));
});
