'use strict';

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const data = require('./data');
const JWT_SECRET = "cameraStore@123";
const PORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/api/products', (req, res) => {
  return res.json(data.products);
});

app.post('/api/products', (req, res) => {
  let products = [], id = null;
  let cart = JSON.parse(req.body.cart);
  if (!cart) return res.json(products)
  for (let i = 0; i < data.products.length; i++) {
    id = data.products[i].id.toString();
    if (cart.hasOwnProperty(id)) {
      data.products[i].qty = cart[id]
      products.push(data.products[i]);
    }
  }
  return res.json(products);
});

app.post('/api/auth', (req,res) => {
  let user = data.users.filter((user) => {
    return user.name == req.body.name && user.password == req.body.password;
  });
  if (user.length){
      let token_payload = {name: user[0].name, password: user[0].password};
      let token = jwt.sign(token_payload, JWT_SECRET, { expiresIn: '2h' });
      let response = { message: 'Token Created, Authentication Successful!', token: token};
      return res.status(200).json(response);
  } else {
      return res.status("409").json("Authentication failed.");
  }
});

app.listen(PORT);
console.log('express server running on port ' + PORT);