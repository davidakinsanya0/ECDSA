const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");

// Generate a random private key
const privateKey = hexToBytes("8b6e76b1a1b1163c5ac7b0f550941df0874f1c871674891372ce8d88ec332506"); // secp256k1.utils.randomPrivateKey();

// Get the public key (uncompressed form)
const publicKey = secp256k1.getPublicKey(privateKey);

// Hash the public key using Keccak-256 (drop the 0x04 prefix byte first)
const hash = keccak256(publicKey.slice(1));

// Take the last 20 bytes as the Ethereum address
const address = hash.slice(-20);

console.log(`Private Key: ${toHex(privateKey)}`);
console.log(`Public Key: ${toHex(publicKey)}`);
console.log(`Address: ${toHex(address)}\n`);
