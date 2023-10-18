const express = require('express');
const app = express();
const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.use(express.static("public"));

app.get("/registration", function (req, res) {
    res.sendFile(__dirname + "/registration.html");
});

app.get("/reg", function (req, res) {
    db.collection('users').add({
       Email: req.query.email,
       Password: req.query.password
    })
    .then(() => {
        res.sendFile(__dirname + "/login.html");
    });
})

app.get("/login", function (req, res) {
    res.sendFile(__dirname + "/login.html");
});
app.get("/authenticate", function (req, res) {
    const email = req.query.email;
    const password = req.query.password;

    console.log("Received email:", email);
    console.log("Received password:", password);
    db.collection('users')
    .where("Email", "==",email)
    .where("Password", "==", password)
    .get()
    .then((docs) => {
        if (docs.size > 0) {
            // Send the content.html file as a response
            res.sendFile(__dirname + "/content.html");
        } else {
            res.send("CHECK YOUR PASSWORD / EMAIL,LOG IN FAILED")
             // You probably want to send a message instead of the file path.
        }
    })
    .catch((error) => {
        console.error("Error authenticating user:", error);
        res.status(500).send("An error occurred during authentication.");
    });
});


app.listen(3056, function () {  
     console.log('Example app listening on port 3010!');
});
