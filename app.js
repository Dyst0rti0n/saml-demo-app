const express = require('express');
const saml2 = require('saml2-js');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60000 * 60 * 24 }
}));

// SAML Service Provider (SP) options
const sp_options = {
  entity_id: "http://localhost:3000/metadata.xml",
  private_key: fs.readFileSync("private-key.pem").toString(),
  certificate: fs.readFileSync("certificate.pem").toString(),
  assert_endpoint: "http://localhost:3000/assert"
};
const sp = new saml2.ServiceProvider(sp_options);

// SAML Identity Provider (IdP) options
const idp_options = {
  sso_login_url: "http://localhost:7000/saml/sso",
  certificates: [fs.readFileSync("idp-public-cert.pem").toString()]
};
const idp = new saml2.IdentityProvider(idp_options);

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Login route
app.get('/login', (req, res) => {
  sp.create_login_request_url(idp, {}, (err, login_url) => {
    if (err) return res.sendStatus(500);
    res.redirect(login_url);
  });
});

// Assertion Consumer Service (ACS) endpoint
app.post('/assert', (req, res) => {
  sp.post_assert(idp, { request_body: req.body, allow_unencrypted_assertion: true }, (err, saml_response) => {
    if (err) return res.sendStatus(500);
    req.session.name_id = saml_response.user.name_id;
    res.render('welcome', { name_id: saml_response.user.name_id });
  });
});

// Vulnerability Demonstration Routes
// XSS Vulnerability
app.get('/xss', (req, res) => {
  const userInput = req.query.input || '';
  res.send(`<h1>User Input: ${userInput}</h1>`);
});

// SQL Injection Vulnerability
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE user (id INT, name TEXT)");
  db.run("INSERT INTO user (id, name) VALUES (1, 'Alice')");
  db.run("INSERT INTO user (id, name) VALUES (2, 'Bob')");
});

app.get('/user', (req, res) => {
  const userId = req.query.id;
  db.get(`SELECT name FROM user WHERE id = ${userId}`, (err, row) => {
    if (err) return res.sendStatus(500);
    res.send(`User: ${row.name}`);
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
