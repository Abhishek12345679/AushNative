// import express from "express";
const express = require("express");
// const PaytmChecksum = require("paytmchecksum");
// const https = require("https");
const Razorpay = require("razorpay");

const app = express();

// const createOrder = () => {
//     //test

// };

app.get("/", function(req, res) {
    res.send("Hello World");
});
app.get("/initiate", function(req, res) {
    // res.send("Hello World");
    // generateCheckSum();
    res.send("Init");
    initiatePayment();
});

app.get("/orders", function(req, res) {
    var instance = new Razorpay({
        key_id: "rzp_test_JTQ6Nksjcb9tRj",
        key_secret: "2fXQGvQKrEc9CuG9Xcvw1pOW",
    });

    var options = {
        amount: 50000, // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11",
    };
    instance.orders.create(options, function(err, order) {
        console.log(order);
        // return order;
        res.send(order);
    });
    // res.send({ orders: createOrder() });
});

app.listen(3000, () => {
    console.log(`🚀 Server ready at http://localhost:3000`);
});