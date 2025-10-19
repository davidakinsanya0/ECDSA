const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

function bigIntTo32Bytes(num) {
  const bytes = new Uint8Array(32);
  let n = num;
  for (let i = 31; i >= 0; i--) {
    bytes[i] = Number(n & 0xffn);
    n >>= 8n;
  }
  return bytes;
}

async function recoverKey(message, signature, recovery) {
  const newSignature = secp256k1.Signature.fromCompact(toHex(signature), recovery);
  
  const {r, s} = newSignature;
  const compactBytes = new Uint8Array(64);

  compactBytes.set(bigIntTo32Bytes(r), 0);
  compactBytes.set(bigIntTo32Bytes(s), 32);   
  
  const sig = secp256k1.Signature.fromCompact(compactBytes, recovery);
  console.log(sig);
  //return sig.recoverPublicKey(message).toHex();
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
  // TODO: Create a sigunature from the client-side.
  // TODO: Recover public address from the signature.


 
   const { messageHash, signature, recovery } = req.body;
   const signatureInBytes = new Uint8Array(Object.values(signature));
   const recovered = recoverKey(messageHash, signatureInBytes, recovery);
   // console.log(recovered);
  

  /*
  // const { signature, recipient, amount } = req.body;

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
