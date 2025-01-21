const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const notesRoutes = require('./routes/notesRoutes');

const app = express();

// Cấu hình EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public')); // Chứa các file tĩnh (CSS, JS)

// Sử dụng routes
app.use('/notes', notesRoutes);

// Trang chủ
app.get('/', (req, res) => {
  res.redirect('/notes');
});

// Chạy server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(chalk.green(`Server đang chạy tại http://localhost:${PORT}`));
});
