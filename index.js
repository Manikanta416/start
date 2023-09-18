var express = require('express');
var app = express();
var admin = require('firebase-admin');
var serviceAccount = require('./key.json');
app.use(express.static('public'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
app.get('/registration', function (req, res) {
  res.sendFile(__dirname + '/registration.html');
});

app.get('/reg', function (req, res) {
  db.collection('students')
    .add({
      FullName: req.query.first_name,
      Email: req.query.email,
      Password: req.query.password
    })
    .then(() => {
      res.sendFile(__dirname + '/login.html');
    });
});

app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/login.html');
});

app.get('/process_login', function (req, res) {
  db.collection('students')
    .where('Email', '==', req.query.email)
    .where('Password', '==', req.query.password)
    .get()
    .then((docs) => {
      if (docs.size > 0) {
        res.sendFile(__dirname + '/style.html');
      } else {
        res.sendFile(__dirname + '/error.html');
      }
    });
});

app.listen(3010, function () {
  console.log('Example app listening on port 3010!');
});
