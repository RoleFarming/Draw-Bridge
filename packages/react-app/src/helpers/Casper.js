import { ERC20Client } from "casper-erc20-js-client";
import { Keys, CasperClient, CasperServiceByJsonRPC, CLPublicKey, DeployUtil } from "casper-js-sdk";

import ASN1 from '@lapo/asn1js';
import Base64 from '@lapo/asn1js/base64';
import Hex from '@lapo/asn1js/hex';

import {
    CLValueParsers,
    CLValueBuilder,
    CLPublicKeyTag,
    encodeBase16,
    decodeBase16,
    encodeBase64,
    decodeBase64
} from "casper-js-sdk";
  
// CASPER 00 [

//const CHAIN_NAME="casper-net-1"
const CHAIN_NAME="casper-test"
//const NODE_ADDRESS="http://localhost:11101/rpc"
//const EVENT_STREAM_ADDRESS="http://localhost:18101/events/main"
const NODE_ADDRESS="http://138.201.54.44:7777/rpc"
const EVENT_STREAM_ADDRESS="http://138.201.54.44:9999/events/main"
const RFBTC_CONTRACT_HASH = '55ee24b578546688dfd0f3026cd5f8c2208f332b76b8017b75a62c6e0981b61b'

// CASPER 00 ]

async function getContractArtifacts(addr, key) {
    const erc20 = new ERC20Client(
        NODE_ADDRESS,
        CHAIN_NAME,
        EVENT_STREAM_ADDRESS
      );

      try {
      
      await erc20.setContractHash(addr)
      let name = await erc20.name()
//      console.log('name1', name)
      let symbol = await erc20.symbol()
//      console.log('symbol1', symbol)
      let decimals = await erc20.decimals()
//      console.log('decimals1', decimals)
      let totalSupply = await erc20.totalSupply()
//      console.log('totalSupply1', totalSupply)
      let balance = await erc20.balanceOf(CLPublicKey.fromHex(key))
//      console.log('balance1', balance)
  
      return {
          name,
          symbol,
          decimals,
          totalSupply,
          balance
      }
    }
    catch (e) {
        return {
            err: e
        }
    }
}

function privkeyDecode(val) {
    let reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
    const der = reHex.test(val)
      ? Hex.decode(val)
      : Base64.unarmor(val);
    let decoded = ASN1.decode(der);
    console.log(decoded)

    let hexKey = null

    try {
      let ed25519 = decoded
        .toPrettyString()
        .includes('curveEd25519');
      let secp256k1 = decoded.toPrettyString().includes('secp256k1');
      if (ed25519) {
        console.log('ed25519 decode key');
          hexKey = decoded.toPrettyString().split('\n')[4].split('|')[1];
//          this.secretKeyBase64.onChange(encodeBase64(decodeBase16(hexKey)));
//            return hexKey
      } else if (secp256k1) {
        console.log('secp256k1 decode key');
         hexKey = decoded.toPrettyString().split('\n')[2].split('|')[1];
//          this.secretKeyBase64.onChange(encodeBase64(decodeBase16(hexKey)));
          //return hexKey
      } else {
        console.error('Could not parse algorithm from DER encoding')
      }
    } catch (err) {
      console.error(err);
    }

    return hexKey
}

async function t(orderIndex, order) {
    const erc20 = new ERC20Client(
        NODE_ADDRESS,
        CHAIN_NAME,
        EVENT_STREAM_ADDRESS
      );
      
      await erc20.setContractHash('55ee24b578546688dfd0f3026cd5f8c2208f332b76b8017b75a62c6e0981b61b')
      let name1 = await erc20.name()
  
      let csprR = order.cspr
  
      let pub = '0193e3756754318727cd9524e8da7ee49e4a7575dfbcdd5f97b82bde4027210045'
      let priv = 'MC4CAQAwBQYDK2VwBCIEINqUImg6kZJrU1nma6dhGd6J0Rxew4cYYtTcsoqe7Yn9'
  //               'MC4CAQAwBQYDK2VwBCIEINqUImg6kZJrU1nma6dhGd6J0Rxew4cYYtTcsoqe7Yn9'
    //  020193e3756754318727cd9524e8da7ee49e4a7575dfbcdd5f97b82bde4027210045
  //    020193e3756754318727cd9524e8da7ee49e4a7575dfbcdd5f97b82bde4027210045
  
      let pubKey = Uint8Array.from(Buffer.from(pub, 'hex'))
      let privKey = Uint8Array.from(Buffer.from(priv));//Buffer.from(priv, 'hex'))
      let privKey2 = Uint8Array.from(Buffer.from(priv, 'base64'))
  //    type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex';
  
  //let privKey1 = Keys.Secp256K1.parsePrivateKey(privKey, 'der');
      let privKey1 = Keys.Secp256K1.readBase64WithPEM(priv);
  
      const publicKey = Keys.Ed25519.parsePublicKey(pubKey)
      const privateKey = Keys.Ed25519.parsePrivateKey(
  //      privKey1
        Keys.Ed25519.readBase64WithPEM(priv)
      );
  
      //let keyPair = SignKeyPair(publicKey, privateKey)
      let keyPair = {
        publicKey: publicKey,
        secretKey: Keys.Ed25519.readBase64WithPEM(priv) //privateKey
      }
  
      let keys1 = Keys.Ed25519.new();
      let keys2 = Keys.Secp256K1.new();
  
  //    let keys = new Keys.Ed25519(keyPair)
  
      const publicKey1 = pubKey //Keys.Secp256K1.parsePublicKey(pubKey)
  //    const publicKey2 = Keys.Secp256K1.parsePublicKey(pub)
      const publicKey3 = Keys.Secp256K1.parsePublicKey(Buffer.from(pub, 'hex'), 'raw')
  
      const pk0 = Keys.Secp256K1.readBase64WithPEM(priv)
  
      const privateKey1 = Keys.Secp256K1.parsePrivateKey(
        Keys.Secp256K1.readBase64WithPEM(priv), 'raw'
      );
  
      let keys = new Keys.Secp256K1(publicKey1, privateKey)
  
      let pubkey222 = Keys.Secp256K1.privateToPublicKey(privateKey)
  
      function privkeyDecode(val) {
        let reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
        const der = reHex.test(val)
          ? Hex.decode(val)
          : Base64.unarmor(val);
        let decoded = ASN1.decode(der);
        console.log(decoded)
  
        let hexKey = null
  
        try {
          let ed25519 = decoded
            .toPrettyString()
            .includes('curveEd25519');
          let secp256k1 = decoded.toPrettyString().includes('secp256k1');
          if (ed25519) {
            console.log('ed25519 decode key');
              hexKey = decoded.toPrettyString().split('\n')[4].split('|')[1];
  //          this.secretKeyBase64.onChange(encodeBase64(decodeBase16(hexKey)));
  //            return hexKey
          } else if (secp256k1) {
            console.log('secp256k1 decode key');
             hexKey = decoded.toPrettyString().split('\n')[2].split('|')[1];
  //          this.secretKeyBase64.onChange(encodeBase64(decodeBase16(hexKey)));
              //return hexKey
          } else {
            console.error('Could not parse algorithm from DER encoding')
          }
        } catch (err) {
          console.error(err);
        }
  
        return hexKey
      }
      let hexKey = privkeyDecode(priv)
  
      let hexKey1 = decodeBase16(hexKey)
      let hexKey2 = encodeBase64(decodeBase16(hexKey))
  
      let secretKey00 = Keys.Ed25519.parsePrivateKey(hexKey1);
      let publicKey00 = Keys.Ed25519.privateToPublicKey(secretKey00);
      let keyPair00 = Keys.Ed25519.parseKeyPair(publicKey00, secretKey00);
      keys = keyPair00
  //    let privKey1 = Keys.Ed25519.readBase64WithPEM(priv);
  //    let keys = new Keys.Ed25519(pubKey, privKey1)
  
  //    let ok = keys.verify(sig, msg)
  
  //let transferAmount = "2500000000"
  //let paymentAmount = "2500000000"
    let transferAmount = "5555"
  //  let paymentAmount = "10000000000000"
    let paymentAmount = "10000000000"
    
      csprR = "0145556637f1c3e3fd6cf548a7e493565c9312b743dd9b5964fea88f8a81a9e939"
      //"76f952c8b0a14ebe01540382f3b3455eb6a4c4c142172e34db784edb3ddfdb61"
  
  //    KEYS0_PUB=0145556637f1c3e3fd6cf548a7e493565c9312b743dd9b5964fea88f8a81a9e939
  //KEYS0_ACCOUNT=account-hash-76f952c8b0a14ebe01540382f3b3455eb6a4c4c142172e34db784edb3ddfdb61
  
  
      let b = Uint8Array.from(Buffer.from(csprR, 'hex'))
      const recipientPublicKey = Keys.Ed25519.parsePublicKey(
        b
      );
  
      //    let b = Uint8Array.from(Buffer.from(csprR, 'hex'))
  //    let recipient = CLValueBuilder.publicKey(b, CLPublicKeyTag.ED25519)
  //    let recipient = CLValueBuilder.publicKey(recipientPublicKey, CLPublicKeyTag.SECP256K1)
      let recipient = CLValueBuilder.publicKey(recipientPublicKey, CLPublicKeyTag.ED25519)
      let qq = recipient.toHex()
      let qq1 = recipient.isEd25519()
      let qq2 = recipient.isSecp256K1()
      let ww = CLPublicKey.fromHex(csprR)
      recipient = ww

  //    const recipientKey = Keys.Ed25519.new();
  //    let zz = recipient.clType().toString()// === PUBLIC_KEY_ID)
  //    let zz1 = PUBLIC_KEY_ID
  
  //    let yy = new CLAccountHash(recipient.toAccountHash());
  //    let yy2  = new CLKey(yy)
  
  //    let r1 = new CLKey(new CLAccountHash((recipient as CLPublicKey).toAccountHash()));
  //    let r2 = new CLKey(recipient);
  //    let hh = ww.toAccountHash();
  //    let csprTx = await erc20.transfer(keys, recipientKey.publicKey, transferAmount, paymentAmount);
  console.log({keys, recipient, transferAmount, paymentAmount});
  let csprTx = await erc20.transfer(keys, recipient, transferAmount, paymentAmount);
  //    transfer(keys: Keys.AsymmetricKey, recipient: RecipientType, transferAmount: string, paymentAmount: string, ttl?: number): Promise<string>;
  /*
  export declare enum CLPublicKeyTag {
    ED25519 = 1,
    SECP256K1 = 2
  }*/

  return csprTx;
}

async function applyArtifact(options) {
// await t(options.orderIndex, options.order)
//    return await t(options.orderIndex, options.order)

    const erc20 = new ERC20Client(
        NODE_ADDRESS,
        CHAIN_NAME,
        EVENT_STREAM_ADDRESS
    );

    await erc20.setContractHash(RFBTC_CONTRACT_HASH)
    let name1 = await erc20.name()


    try {
        let hexKey = privkeyDecode(options.privkey);
  
        let hexKey1 = decodeBase16(hexKey);

        let secretKey00 = Keys.Ed25519.parsePrivateKey(hexKey1);
        let publicKey00 = Keys.Ed25519.privateToPublicKey(secretKey00);
        let keyPair00 = Keys.Ed25519.parseKeyPair(publicKey00, secretKey00);
        let keys = keyPair00

        let v = parseFloat(options.order.amount)
        let transferAmount = CLValueBuilder.u256(v).value().toString()

        let paymentAmount = "10000000000"

        let recipient = CLPublicKey.fromHex(options.order.cspr)

        console.log({keys, recipient, transferAmount, paymentAmount});
        let csprTx = await erc20.transfer(keys, recipient, transferAmount, paymentAmount);

        return csprTx;
    }
    catch (e) {
        return {
            err: e
        }
    }
}

const CasperHelper = {
    getContractArtifacts,
    applyArtifact
}

export default CasperHelper;
