# DRAW_BRIDGE

2022/08 19 August Update 
+ Remove unused code
+ licenses Apache 2.0
+ Contribution Policies
+ Testing docs

### Key Features

#### White Mode

![image](https://github.com/RoleFarming/project11/raw/main/assets/white.png)

#### Dark Mode
![image](https://github.com/RoleFarming/project11/raw/main/assets/dark.png)

# 🏄‍♂️ Quick Start

### Manual setup

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork Draw-Bridge:

```bash
git clone https://github.com/RoleFarming/Draw-Bridge.git
```

> install and start your 👷‍ Hardhat chain:

```bash
cd Draw-Bridge
yarn install
yarn chain
```

> 🛰 deploy your contract:

```bash
cd Draw-Bridge
yarn deploy
```

> configure variables

```javascript
const Supervisor = "<supervisor> // supervisor casper address for manage transfers
const CHAIN_NAME = "casper-test" // cspr chain name
const contractRFBTC = "<contract_address>" // eth contract address for rfbtc
const NODE_ADDRESS="http://138.201.54.44:7777/rpc" // cspr node address
const EVENT_STREAM_ADDRESS="http://138.201.54.44:9999/events/main" // cspr event stream
const RFBTC_CONTRACT_HASH = '<contract_address>' // eth contract address for rfbtc
```

> start your 📱 frontend:

```bash
cd Draw-Bridge
yarn start
```

🌍 You need an RPC key for production deployments/Apps, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js`

📱 Open http://localhost:3000 to see the app

## Testing algo
```
1. Connect Metamask
2. Connect Casper Signer
3. Grab ETH Faucet (for testent)
4. Grab CSPR Faucet (for testent) 
5. Enter amount
6. Push Exchane
7. If you are Supervisor:
7.1 enter CSPR privkey for order processing
7.2 Verify tx and push Approve
7.3 Push Cancel if not sure and back ETH manually
```

## Testing step by step

### Prepare

1. Disable CORS check in Chrome for testing 

DrawBridge is server less Web3 dApp and CORS should be configured by cloud housting like Vercel.app 
To avoid CORS error please install Chrome Extension 'Allow CORS: Access-Control-Allow-Origin8' and then Toggle On it (or other extension if this not works, see https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome)

### Terms

1. Supervisor

Supervisor is ETH administration account who can approve exchange operation ETH to Casper

2. User

User is client who want to produce exhange operation


### Testing sequence

0. You are need two browser User and Supervisor

User will request exchange ETH to CSPR and Supervisor can approve or denied operation

- Supervisor Browser
- User Browser
- Testnet CSPR (here is deployed contract). Get faucet with testnet.cspr.live
- Localhost ETH and Metamask network with ChainId 31337

1. Supervisor setup

1.1 Open Supervisor browser with Metamask and Casper Wallet

1.2 Login to Metamask

1.3 Select Metamask localhost because you deployed contract locally with yarn chain

1.4 Copy Metamask ETH account address

This address named SUPERVISOR

1.5 Edit constants.js

File:
```
packages/react-app/src/constants.js
```
Set variable SUPERVISOR to your Supervisor Metamask account address
```
export const SUPERVISOR = "0x3314b13a30747398d4c62FD1cadF152dB68D9bF4";
```

2. Contract setup

2.1 Deploy contract locally (if you are not did that already)
```
yarn deploy
```
The result of operation should be contract address.
```
$ yarn deploy
yarn run v1.22.17
$ yarn workspace @scaffold-eth/hardhat deploy
$ hardhat deploy --export-all ../react-app/src/contracts/hardhat_contracts.json
Compiling 2 files with 0.8.4
Compilation finished successfully
deploying "YourContract" (tx: 0x469049e11219fd718cb3520aecdefc2146a23040ebf38afa163d526d183bccf0)...: deployed at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 with 1115929 gas
$ hardhat run scripts/publish.js
✅  Published contracts to the subgraph package.
✨  Done in 14.32s.
```
See `deployed at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

This should be in YourContract section
```
packages/react-app/src/contracts/hardhat_contracts.json
...
        "YourContract": {
          "address": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
```
Contract should be connect automaticly for localhost with yarn start.

3. Run app
```
yarn start
```

4. Open User browser

4.1 Connect Metamask

4.2 Connect Casper Signer

4.3 Enter amount to exchange ETH to RFBTC

4.4 Push Exchange Button

4.5 Apply in Metamask Tx and Order

4.6 Then see your order in order list

5. In Supervisor you will see Order details

5.1 Apply or Decline order

5.1.1 Apply exchange operation

5.1.1.1 Enter CSPR private key with test amount received by testnet.cspr.live faucet

5.1.1.2 Push apply button. Verify if no CORS errors and your test browser works without an issues

5.1.1.3 Order should be done and Casper coins should send to User 

5.1.2 Decline

5.1.2.1 Push Decline button in Metamask to cancel order 

## Contribution

Thank you for considering to help out with the source code! We welcome contributions
from anyone on the internet, and are grateful for even the smallest of fixes!

If you'd like to contribute to Draw-Bridge, please fork, fix, commit and send a pull request
for the maintainers to review and merge into the main code base. 

See common Casper Labs contributor guidlines

https://github.com/make-software/how-to-casperlabs/blob/master/CONTRIBUTING.md

## License
The Draw-Bridge is licensed under the Apache License Version 2.0, also included in our repository in the LICENSE file.

