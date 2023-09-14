const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', __dirname + '/views'); // Set the views directory


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(express.static(__dirname + '/public'));

// MySQL Connections
const db = mysql.createConnection({
  host: 'sql8.freemysqlhosting.net',
  user: 'sql8643947',
  password: '37zsfeVvQp',
  database: 'sql8643947'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Routes
app.get('/', (req, res) => {
  res.render('register');
});



app.post('/register', (req, res) => {
  const { username, password, password2 } = req.body;

  // Check if passwords match
  if (password !== password2) {
    return res.status(400).send('Passwords do not match');
  }

  app.use(
    session({
      secret: 'your-secret-key', // Replace with a secure secret key
      resave: true,
      saveUninitialized: true,
    })
  );

  db.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    (err, results) => {
      if (err) {
        console.error('MySQL error:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.append('Registration Successful');
        res.redirect('/login');
      }
    }
  );
});


app.post('/main', (req, res) => {
  res.render('main')
});
app.get('/login', (req, res) => {
  // Render the 'login.ejs' template and pass data if needed
  res.render('login', { message: 'Already a member?' });
  
});
// Start the server
const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});