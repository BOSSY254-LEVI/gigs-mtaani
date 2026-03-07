import nacl from "tweetnacl";
import { decodeBase64, decodeUTF8, encodeBase64, encodeUTF8 } from "tweetnacl-util";

const identityKeyStorage = "gigs-mtaani-identity-keypair";

export type KeyPair = {
  publicKey: string;
  secretKey: string;
};

export function getOrCreateIdentityKeyPair(): KeyPair {
  const existing = localStorage.getItem(identityKeyStorage);
  if (existing) {
    return JSON.parse(existing) as KeyPair;
  }

  const pair = nacl.box.keyPair();
  const keyPair = {
    publicKey: encodeBase64(pair.publicKey),
    secretKey: encodeBase64(pair.secretKey)
  };
  localStorage.setItem(identityKeyStorage, JSON.stringify(keyPair));
  return keyPair;
}

export function encryptForRecipient(plaintext: string, recipientPublicKeyB64: string, senderSecretKeyB64: string) {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const boxed = nacl.box(
    decodeUTF8(plaintext),
    nonce,
    decodeBase64(recipientPublicKeyB64),
    decodeBase64(senderSecretKeyB64)
  );

  return {
    ciphertext: encodeBase64(boxed),
    nonce: encodeBase64(nonce)
  };
}

export function decryptFromSender(ciphertextB64: string, nonceB64: string, senderPublicKeyB64: string, recipientSecretKeyB64: string) {
  const opened = nacl.box.open(
    decodeBase64(ciphertextB64),
    decodeBase64(nonceB64),
    decodeBase64(senderPublicKeyB64),
    decodeBase64(recipientSecretKeyB64)
  );

  if (!opened) {
    return null;
  }

  return encodeUTF8(opened);
}

