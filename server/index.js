const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex, hexToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

async function recoverKey(message, signature) {
  const {r, s, recovery} = signature;
  const sig = new secp256k1.Signature(BigInt(r), BigInt(s), recovery);
  return sig.recoverPublicKey(hexToBytes(message)).toHex();
}

const balances = {
  "f883e87d61fb8e11ea127ca8f9eddf5aa5240a7c": 100, // Priv Key:  8b6e76b1a1b1163c5ac7b0f550941df0874f1c871674891372ce8d88ec332506
  "79cbea124aaa07cd3fb97d96fbf9da671d127d13": 50, // Priv Key: 7b2e8a1591cfcd61de8045f5397f0fe01befb93514c1cf9161afc7247422b32e
  "3c713d3ed35cfda832033f9fc665a2202ae92243": 75, // Priv Key: e9b4a31e0e5bb098cd25c239a5fdee8fa2dfef2c39658d30f50dfcf06c6f5d3f
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {


 
  const { messageHash, signature, payload } = req.body;
  const recovered = recoverKey(messageHash, signature);
  let recoveredAddress = "";

  recovered.then((str) => {
    const publicKey = hexToBytes(str);
    const hash = keccak256(publicKey.slice(1));
    const address = hash.slice(-20);

    recoveredAddress = toHex(address);
  })
  

  /*
  // const { signature, recipient, amount } = payload;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
    */
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
