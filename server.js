const express = require('express');
const TronWeb = require('tronweb');
const bodyParser = require('body-parser')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = "https://apiforextrade.xyz"
const testfullNode = "https://apiforextrade.xyz"

const app = express();
app.use(bodyParser.json())


app.get('/createaddress', (req, res) => {
try {
const tronWeb = new TronWeb({fullHost: fullNode});
    TronWeb.createAccount().then(
        (data) => {
            res.status(200).json(data)
        }
    )
     } catch (error) {
        res.status(400).json({error: error});
        console.log(error)
    }
})

app.post('/balance', async(req, res) => {
    try {
        const {address,private_key} = req.body;
        const tronWeb = new TronWeb({fullHost: fullNode, privateKey: private_key});
        const balance = await tronWeb.trx.getBalance(address);
        console.log(balance);
        res.status(200).json({balance})
    } catch (error) {
        res.status(404).json({error: error});
        console.error(error)
    }
});

app.post('/send', async (req, res) => {
    try {
      const { fromAddress, toAddress, privateKey, amount } = req.body;
      const tronWeb = new TronWeb({fullHost: fullNode, privateKey: privateKey});
      const transaction = await tronWeb.transactionBuilder.sendTrx(toAddress, amount, fromAddress);
      const signedTransaction = await tronWeb.trx.sign(transaction, privateKey);
      const result = await tronWeb.trx.sendRawTransaction(signedTransaction);
      console.log(result);
      res.status(200).json({ message: 'Transaction sent successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.error(error);
    }
  });
  

app.listen(process.env.PORT || 3000)
