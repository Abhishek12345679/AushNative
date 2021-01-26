const express = require("express");
require("dotenv").config();

const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function(req, res) {
    res.send("Hello World");
});
app.get("/initiate", function(req, res) {
    // res.send("Hello World");
    // generateCheckSum();
    res.send("Init");
    initiatePayment();
});

app.post("/orders", function(req, res) {
    console.log(req.body);
    const { amount, currency, receipt } = req.body;

    var instance = new Razorpay({
        key_id: process.env.KEY,
        key_secret: process.env.SECRET,
    });

    var options = {
        amount: amount, // amount in the smallest currency unit
        currency: currency,
        receipt: receipt,
    };
    instance.orders.create(options, function(err, order) {
        console.log(order);
        res.send(order);
    });
});

app.post("/verifysignature", function(req, res) {
    // console.log("helllooo");
    console.log(req.body);
    // res.send(req.body);

    const { order_id, razor_pid, signature } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.SECRET);

    hmac.update(order_id + "|" + razor_pid);
    let generatedSignature = hmac.digest("hex");

    let isSignatureValid = generatedSignature == signature;

    console.log(isSignatureValid);
    res.json({ status: isSignatureValid });

    // add order to firebase or mark order as successful in previously added order
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`🚀 Server ready at http://localhost:3000`);
});