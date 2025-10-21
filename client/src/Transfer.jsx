import { useState } from "react";
import server from "./server";

import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes, hexToBytes  } from "ethereum-cryptography/utils";

function hashMessage(message) {
  const messageToBytes = utf8ToBytes(message);
  const messageHash = keccak256(messageToBytes);
  return messageHash;
}

async function signMessage(msg, key) {
  const msgHashed = hashMessage(msg);
  const signature = secp256k1.sign(msgHashed, key);
  return signature;
}

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    let tx = {
          sender: address,
          amount: parseInt(sendAmount),
          recipient
        }

    let txObj = JSON.stringify(tx);
  
    const signedMsg = await signMessage(txObj, privateKey);
    const msgHashed = toHex(hashMessage(txObj));


    const obj = {
      r: signedMsg.r.toString(),
      s: signedMsg.s.toString(),
      recovery: signedMsg.recovery,
    }

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        messageHash: msgHashed,
        signature: obj,
        payload: tx
      });

  
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
