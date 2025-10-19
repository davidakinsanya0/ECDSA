const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

// Generate a random private key
const privateKey = secp256k1.utils.randomPrivateKey();

// Get the public key (uncompressed form)
const publicKey = secp256k1.getPublicKey(privateKey);

// Hash the public key using Keccak-256 (drop the 0x04 prefix byte first)
const hash = keccak256(publicKey.slice(1));

// Take the last 20 bytes as the Ethereum address
const address = hash.slice(-20);

console.log(`Private Key: ${toHex(privateKey)}`);
console.log(`Public Key: ${toHex(publicKey)}`);
console.log(`Address: ${toHex(address)}\n`);