// get-public-key.js (Revised Export Logic)
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Construct the path relative to the script's execution directory
const privateKeyPath = path.resolve('dist.pem');

try {
  // Check if the file exists before reading
  if (!fs.existsSync(privateKeyPath)) {
    throw new Error(`Private key file not found at: ${privateKeyPath}`);
  }

  const privateKeyPem = fs.readFileSync(privateKeyPath, 'utf8');

  // 1. Create the private key object
  const privateKey = crypto.createPrivateKey(privateKeyPem);

  // 2. Create the corresponding public key object from the private key
  const publicKey = crypto.createPublicKey(privateKey);

  // 3. Export the public key object in SPKI/DER format
  const publicKeyDer = publicKey.export({
    type: 'spki', // SubjectPublicKeyInfo format (standard for public keys)
    format: 'der' // DER encoding (binary)
  });

  // 4. Convert the binary DER public key to Base64
  const publicKeyBase64 = publicKeyDer.toString('base64');

  console.log("Public Key (Base64 for manifest.json 'key' field):");
  console.log(publicKeyBase64);

} catch (error) {
  console.error("Error extracting public key:", error);
  if (error.message.includes('not found')) {
     console.error("\nPlease ensure the 'dist.pem' file exists in the same directory where you run this script.");
  } else if (error.message.includes('bad base64 decode') || error.message.includes('PEM routines') || error.message.includes('invalid key type')) {
     console.error("\nThe 'dist.pem' file might be corrupted or not a valid PEM private key.");
  } else {
     console.error("\nAn unexpected error occurred. Check Node.js version compatibility or the key file format.");
  }
}