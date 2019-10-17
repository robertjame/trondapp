const TronWeb = require('tronweb');
const express = require('express')
var bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use("/source",express.static(__dirname + "/source"));

app.get('/', function (req, res) {
    res.render("Index");
});

const fullNode = "https://api.shasta.trongrid.io"
const solidityNode = "https://api.shasta.trongrid.io";
const eventServer = "https://api.shasta.trongrid.io";
const privateKey = 'a0a484325217d9ffeabd2d8589fec8a9afebdcc1d232f322511d93651b234571'; // Enter Private key of your account

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

tronWeb.setAddress('TQpxMpbEedHE2nPig4DNKvuERxjzStdR2V'); //Enter Address of your account

let contractAddress = '41ad00ed154f10acd30fbdb7c946291005d84dfcb4' //Enter Your Smart Contract Address
let abi = [{"constant":false,"inputs":[{"name":"value","type":"string"}],"name":"postMessage","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMessage","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]

let instance = tronWeb.contract(abi, contractAddress);

let args = {
    callValue:0,
    shouldPollResponse: true
}

app.post('/post', async function(req, res) {
    let para = req.body.postmessage
    try{
        let connection = await instance.postMessage(para).send(args);
        console.log(connection)
        res.send({
                'data':'success'
        })
    } catch(error){
        console.log(error)
    }
});

app.get('/get', async function(req, res) {
    let connection = await instance.getMessage().call();
    res.send(connection);
});

app.listen(8001, function(){
    console.log("Server started at 8001...");
}); 
