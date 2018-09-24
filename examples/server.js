var express = require('express');
var bodyParser = require('body-parser');

const { Instamojo, Config, Buyer, Transaction, Refund } = require('../')

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

var instamojoConfig = new Config({
    api_key : 'test_2b6705413656927c9dd852dc6d4',
    auth_token : 'test_f066bcbc92f42dbeff9c7ad605d',
    redirect_url : 'http://localhost:3000/payment/status',
})
var txn = new Transaction({
    amount: 100,
    purpose: 'Testing plugin',
    send_sms: true,
    send_email: true
})
var buyer = new Buyer({
    name: 'Namrata',
    email: 'nam9503t@gmail.com',
    phone: '9503269526'
})
var payment = {
    payment_id: "MOJO8920005A47551893",
    type: "QFL",
    body: "Not Satisfied"
  }
app.get('/', function(req, res){

    var instamojo = new Instamojo(instamojoConfig, txn, buyer)

    instamojo.initiatePayment(function(error, response, body){
        if(!error && response.statusCode == 201){
        
          res.json(JSON.parse(body));
        }
        else if(!error){
            res.json(JSON.parse(response))
        }        
        else {
            res.send(error)
        }
      })
})
app.get('/payment/status', function(req, res){
    res.send('We got it')
})
app.get('/refunds', function (req, res) {
    var instamojo = new Instamojo(instamojoConfig, payment);
  
    instamojo.refunds(function(error, response, body){
      if(!error && response.statusCode == 201){
  
        res.json(JSON.parse(body));
      }
      else if(!error){
          res.json(response);
      }
      else {
          res.send(error);
      }
    })
  })
app.listen('3000', function () {
    console.log('Server at 3000')
})