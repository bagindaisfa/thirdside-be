var express = require('express');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const customer = require('./routes/customer/customer');
const payment_method = require('./routes/payment_method/payment_method');
const product = require('./routes/product/product');

var app = express();
var port = process.env.PORT || 3002;
app.timeout = 600000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
app.use('/api', customer);
app.use('/api', payment_method);
app.use('/api', product);

// Listen
app.listen(port);
console.log('Listening on localhost:' + port);
