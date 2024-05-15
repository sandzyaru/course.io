const express = require('express');
const config = require('config');
const path = require('path');
const sqlite3 = require('sqlite3').verbose(); // добавлено
const { open } = require('sqlite'); // добавлено
const auth = require('./middleware/auth.middleware');
const sequelize = require('./config/database'); 
const User = require('./models/User');
const { log } = require('console');
const app = express();

app.use(express.json({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/user', require('./routes/user.routes'));

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


const PORT = config.get('port') || 5000;

async function start() {
  try {
    sequelize.sync({ force: false }).then(() => {
      console.log('Database and tables synchronized!');
    }).catch((error) => {
      console.error('Error syncing database:', error);
    });
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}


start();

