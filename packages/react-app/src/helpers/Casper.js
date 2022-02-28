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
      let symbol = await erc20.symbol()
      let decimals = await erc20.decimals()
      let totalSupply = await erc20.totalSupply()
      let balance = await erc20.balanceOf(CLPublicKey.fromHex(key))
  
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
      } else if (secp256k1) {
        console.log('secp256k1 decode key');
         hexKey = decoded.toPrettyString().split('\n')[2].split('|')[1];
      } else {
        console.error('Could not parse algorithm from DER encoding')
      }
    } catch (err) {
      console.error(err);
    }

    return hexKey
}

async function applyArtifact(options) {

    const erc20 = new ERC20Client(
        NODE_ADDRESS,
        CHAIN_NAME,
        EVENT_STREAM_ADDRESS
    );

    await erc20.setContractHash(RFBTC_CONTRACT_HASH)

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
