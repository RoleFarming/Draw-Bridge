# DRAW_BRIDGE

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

> Testing
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


## Contribution

Thank you for considering to help out with the source code! We welcome contributions
from anyone on the internet, and are grateful for even the smallest of fixes!

If you'd like to contribute to Draw-Bridge, please fork, fix, commit and send a pull request
for the maintainers to review and merge into the main code base. 

See common Casper Labs contributor guidlines

https://github.com/make-software/how-to-casperlabs/blob/master/CONTRIBUTING.md

## License
The Draw-Bridge is licensed under the Apache License Version 2.0, also included in our repository in the LICENSE file.

