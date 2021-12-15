import { Alert, Button, Col, Menu, Row, message, Dropdown, InputNumber, Divider, Image, Input } from "antd";
import img1 from "./path31.png";
import "antd/dist/antd.css";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import {
  Account,
  Contract,
  Faucet,
  GasGauge,
  Header,
  Ramp,
  ThemeSwitch,
  NetworkDisplay,
  FaucetHint,
  NetworkSwitch,
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import { Home, ExampleUI, Hints, Subgraph } from "./views";
import { useStaticJsonRPC } from "./hooks";

const { ethers } = require("ethers");
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/scaffold-eth/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Alchemy.com & Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

import {CasperClient,CasperServiceByJsonRPC, CLPublicKey,DeployUtil } from "casper-js-sdk";
//import { config } from "chai";

//Create Casper client and service to interact with Casper node.
const apiUrl = 'http://65.21.111.173:7777/rpc';
const casperService = new CasperServiceByJsonRPC(apiUrl);
const casperClient = new CasperClient(apiUrl);


/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];


let casper = {
  connected: false,
  publicKey: ''
}

function App(props) {
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = ["localhost", "mainnet", "rinkeby"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);
  const location = useLocation();

  /// 📡 What chain are your contracts deployed to?
  const targetNetwork = NETWORKS[selectedNetwork]; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

  // 🛰 providers
  if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // const contractConfig = useContractConfig();

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts, "DAI", "balanceOf", [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ]);

  // keep track of a variable from the contract in the local React state:
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  // SUPERVISOR [

  const Supervisor = '0xe30f99Bd110b8E6AD8711cbe4ed135eEFbb1Aa3c'

  // SUPERVISOR ]
  // COIN [

  function tornEthereum() {
    return {
      symbol: 'ETH',
      price: 1,
      address: address
    }
  }

  function tornCasper() {
    return {
      symbol: 'RFBTC',
      price: 2,
      address: '0x11'
    }
  }

  const coinsDef = [
    {
      symbol: 'ETH',
      torn: tornEthereum
    },
    {
      symbol: 'RFBTC',
      torn: tornCasper
    }
  ]

  let selectedCoinLeft = 'ETH'
  let selectedCoinRight = 'RFBTC'

  let coinsExchange = [
    // default ETH -> RFBTC
    coinsDef[0],
    coinsDef[1]
  ]

  // COIN ]
  // IPFS [

  const ipfsAPI = require("ipfs-http-client");

  console.log('ipfsAPI', ipfsAPI)
  const infura = { host: "ipfs.infura.io", port: "5001", protocol: "https" };
  const ipfs = ipfsAPI(infura);

  new Promise((async (t, e) => {
//    let files = await ipfs.files.ls('/examples')
//    console.log('files', files)

    // example obj
//    const obj = {
//      a: 1,
//      b: [1, 2, 3],
//      c: {
//        ca: [5, 6, 7],
//        cb: 'foo'
//      }
//    }

//    const cid = '/ipfs/Qmfoo'
//    const updatedCid = await ipfs.object.patch.setData(cid, new TextEncoder().encode('more data'))

//    const cid = await ipfs.dag.put(obj, { format: 'dag-cbor', hashAlg: 'sha2-256' })
//    console.log(cid.toString())

//    for await (const file of ipfs.files.ls('/screenshots')) {
//      console.log(file.name)
//    }
    
//    let dir = await ipfs.files.mkdir('/draw-bridge-requests-0101011')
//    console.log(dir)
    t()
  }))

  // IPFS ]
  // DWEET [

  function dweetPost() {
    fetch('https://dweet.io/dweet/for/my-thing-name455544?hello=world2', 
    {
      method: "post",
  //    headers: { "Content-Type": "application/json" },
  //    body: ,
    }).then(response => {
      console.log(response)
    })
  }

//  dweetPost()

  // DWEET ]

  
//  new Promise((async (t, e) => {
//  }))

  useEffect(async () => {
    try {
      casper.connected = await window.casperlabsHelper.isConnected()
      if (casper.connected) {
        casper.publicKey = await window.casperlabsHelper.getActivePublicKey();
      }
      }
      catch (e) {
        casper.connected = false
        console.log('Error ', e)
      }
    })

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
  ]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  function Image1() {
    return (
      <Image
        width={200}
        preview={false}
        src="https://raw.githubusercontent.com/RoleFarming/project11/main/assets/path32.png"
      />
    );
  }

  // INPUT VALUE [

  const onChangeTransferValue = function onChangeTransferValue(e) {
    let amount0 = 0
    let price0 = 1
    let amount1 = 0
    let price1 = 1
  }
  
  // INPUT VALUE ]
  // DROPDOWN MENU [
  
  const handleMenuClick = function handleMenuClick(e) {
    message.info('Change currency');

    let selected = 'ETH'
    let iFrom = 0
    let iTo = 1
    if (coinsExchange[iFrom].symbol == selected) {
      return
    }
    if (coinsExchange[iTo].symbol == selected) {
      let hydra = coinsExchange[iFrom]
      coinsExchange[iFrom] = coinsExchange[iTo]
      // swap 
      coinsExchange[iTo] = hydra
    }
    coinsExchange[iFrom] = coinsDef.find(i => i.symbol == selected)
  }
  
  //icon={<EthIcon />} 
  //icon={<RfBtcIcon />}

  const menuCrypto = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" >
        {coinsDef[0].symbol}
      </Menu.Item>
      <Menu.Item key="2">
        {coinsDef[1].symbol}
      </Menu.Item>
    </Menu>
  );

  // DROPDOWN MENU ]

  let coinLeft = coinsExchange[0].torn()
  let coinRight = coinsExchange[0].torn()

  ethers.utils.formatEther(yourLocalBalance)
  
  address

  //     <Input prefix="￥" suffix="RMB" />

  let amount = 9.99
/*
  const makeInvoice = function makeInvoice() {
    let invoice = {
      coinLeft,
      coinRight
    }
    const json = JSON.stringify(invoice, null, 2)
    config.log('Invoice', json)
  }

  const sendInvoice = function sendInvoice(invoice) {
    let network = 'dweet.pub'
    console.log('send invoice to ', network)
  }
*/
  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      <NetworkDisplay
        NETWORKCHECK={NETWORKCHECK}
        localChainId={localChainId}
        selectedChainId={selectedChainId}
        targetNetwork={targetNetwork}
      /> 
{/*
      <Menu style={{ textAlign: "center" }} selectedKeys={[location.pathname]} mode="horizontal">
        <Menu.Item key="/">
          <Link to="/">App Home</Link>
        </Menu.Item>
        <Menu.Item key="/debug">
          <Link to="/debug">Debug Contracts</Link>
        </Menu.Item>
        <Menu.Item key="/hints">
          <Link to="/hints">Hints</Link>
        </Menu.Item>
        <Menu.Item key="/exampleui">
          <Link to="/exampleui">ExampleUI</Link>
        </Menu.Item>
        <Menu.Item key="/mainnetdai">
          <Link to="/mainnetdai">Mainnet DAI</Link>
        </Menu.Item>
        <Menu.Item key="/subgraph">
          <Link to="/subgraph">Subgraph</Link>
        </Menu.Item>
      </Menu>
 */}

      <Divider orientation="left">Wallets Connection</Divider>

      <Row justify="center">
        <Col span={10} >
          <Button
            onClick={loadWeb3Modal}
            size="large"
            shape="round"
          >
            Connect Ethereum
          </Button>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={10} >
          <Button
            onClick={async () => { 
              console.log('Casper connect')

              try {
                await window.casperlabsHelper.requestConnection();

                casper.connected = await window.casperlabsHelper.isConnected()
                if (casper.connected) {
                  casper.publicKey = await window.casperlabsHelper.getActivePublicKey();
                }

                const isConnected = await window.casperlabsHelper.isConnected()
                if (isConnected) {
                  const publicKey = await window.casperlabsHelper.getActivePublicKey();
                  //textAddress.textContent += publicKey;
      
                  const latestBlock = await casperService.getLatestBlockInfo();
                  const root = await casperService.getStateRootHash(latestBlock.block.hash);
      
                  const balanceUref = await casperService.getAccountBalanceUrefByPublicKey(
                          root,
                          CLPublicKey.fromHex(publicKey)
                          )
      
                  //account balance from the last block
                  const balance = await casperService.getAccountBalance(
                          latestBlock.block.header.state_root_hash,
                          balanceUref
                  );
                // textBalance.textContent = `PublicKeyHex ${balance.toString()}`;
      
                }
      
              }
              catch (e) {
                casper.connected = false
                console.log('Error ', e)
              }
            }}
            size="large"
            shape="round"
          >
            Connect Casper Signer
          </Button>
        </Col>
      </Row>

      <Button
        onClick={async () => { 
          console.log('Casper disconnect')
          window.casperlabsHelper.disconnectFromSite();
        }}
        size="large"
        shape="round"
      >
        Disconnect Casper
      </Button>
{/*
      <div>
        - client or admin user - isAdmin()
        - client send(address_admin, eth_amount) -> txid, casper_address
        - admin timer check if txid approved 1 times then
        - admin send(casper_addres, casper_amount)
      </div>
*/}
{/*
      <Dropdown.Button overlay={menuCrypto} placement="bottomRight" trigger={["click"]}>
        <span style={{ textTransform: "capitalize" }}>{selectedCoinLeft}</span>
      </Dropdown.Button>
      
      <InputNumber
        style={{
          width: 200,
        }}
        defaultValue="1"
        min="0"
        max="1000000000"
        step="0.01"
        onChange={onChangeTransferValue}
        stringMode
      />

      <Dropdown.Button overlay={menuCrypto} placement="bottomRight" trigger={["click"]}>
        <span style={{ textTransform: "capitalize" }}>{selectedCoinRight}</span>
      </Dropdown.Button>
*/}

      

      <Divider orientation="left">Order Details</Divider>
      <Row justify="center">
        <Col span={4}>
          Sender
        </Col>
        <Col span={8}>
          Amount
        </Col>
        <Col span={4}>
          Receiver
        </Col>
        <Col span={4}>
          Note
        </Col>
      </Row>
      <Row justify="center">
        <Col span={4}>
          <Dropdown.Button overlay={menuCrypto} placement="bottomRight" trigger={["click"]}>
            <span style={{ textTransform: "capitalize" }}>{selectedCoinLeft}</span>
          </Dropdown.Button>
        </Col>
        <Col span={8}>
          <InputNumber
            style={{
              width: 200,
            }}
            defaultValue="1"
            min="0"
            max="1000000000"
            step="0.01"
            onChange={onChangeTransferValue}
            stringMode
          />
        </Col>
        <Col span={5}>
          <Dropdown.Button overlay={menuCrypto} placement="bottomRight" trigger={["click"]}>
            <span style={{ textTransform: "capitalize" }}>{selectedCoinRight}</span>
          </Dropdown.Button>
        </Col>
        <Col span={3}>
          <Input placeholder=""/>
        </Col>
      </Row>

      <Divider orientation="left"></Divider>

      <Row justify="center">
        <Col span={8}>
          {coinLeft.address}
        </Col>
        <Col span={2}>
          1 ETH / 1 RFBTC / $3813.36 USD
        </Col>
        <Col span={8}>
          {casper.publicKey} 
        </Col>
        <Col span={2}>
        </Col>
      </Row>

      <Divider orientation="left"></Divider>

      <Row justify="center">
        <Col span={5}>
          Supervisor 
        </Col>
        <Col span={8}>
          {Supervisor}
        </Col>
        <Col span={4}>
        </Col>
        <Col span={4}>
        </Col>
      </Row>
      
      <Divider orientation="left"></Divider>

      <Row justify="center">
        <Col span={5}>
          Casper Validator Address
        </Col>
        <Col span={10}>
          <Input placeholder="address"/>
        </Col>
        <Col span={2}>
        </Col>
        <Col span={4}>
        Casper network validator address if you knows
        </Col>
      </Row>

      <Divider orientation="left"></Divider>

      <Row justify="center">
        <Col span={10}>
          <Button style={{height:70,border:0,backgroundColor:'#ffd'}}
                  shape="round"
                  >
            <Image1></Image1>
          </Button>
        </Col>
      </Row>
      
      <Divider orientation="left">Orders</Divider>

      <Row justify="center">
        <Col span={6}>
          Sender
        </Col>
        <Col span={2}>
          Amount
        </Col>
        <Col span={6}>
          Receiver
        </Col>
        <Col span={4}>
          Note
        </Col>
      </Row>

      <Row justify="center">
        <Col span={6}>
          {address}
        </Col>
        <Col span={2}>
          {amount}
        </Col>
        <Col span={6}>
          {address}
        </Col>
        <Col span={4}>
          APPLY?
        </Col>
      </Row>

      <Divider orientation="left">Orders History</Divider>
      <Row justify="center">
        <Col span={4}>
          Date
        </Col>
        <Col span={4}>
          Sender
        </Col>
        <Col span={8}>
          Amount
        </Col>
        <Col span={4}>
          Receiver
        </Col>
        <Col span={4}>
          Note
        </Col>
      </Row>

      <Switch>
        <Route exact path="/">
          {/* pass in any web3 props to this Home component. For example, yourLocalBalance */}
          {/*<Home yourLocalBalance={yourLocalBalance} readContracts={readContracts} />*/} 
        </Route>
        <Route exact path="/debug">
          {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}

          <Contract
            name="YourContract"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
        </Route>
        <Route path="/hints">
          <Hints
            address={address}
            yourLocalBalance={yourLocalBalance}
            mainnetProvider={mainnetProvider}
            price={price}
          />
        </Route>
        <Route path="/exampleui">
          <ExampleUI
            address={address}
            userSigner={userSigner}
            mainnetProvider={mainnetProvider}
            localProvider={localProvider}
            yourLocalBalance={yourLocalBalance}
            price={price}
            tx={tx}
            writeContracts={writeContracts}
            readContracts={readContracts}
            purpose={purpose}
          />
        </Route>
        <Route path="/mainnetdai">
          <Contract
            name="DAI"
            customContract={mainnetContracts && mainnetContracts.contracts && mainnetContracts.contracts.DAI}
            signer={userSigner}
            provider={mainnetProvider}
            address={address}
            blockExplorer="https://etherscan.io/"
            contractConfig={contractConfig}
            chainId={1}
          />
          {/*
            <Contract
              name="UNI"
              customContract={mainnetContracts && mainnetContracts.contracts && mainnetContracts.contracts.UNI}
              signer={userSigner}
              provider={mainnetProvider}
              address={address}
              blockExplorer="https://etherscan.io/"
            />
            */}
        </Route>
        <Route path="/subgraph">
          <Subgraph
            subgraphUri={props.subgraphUri}
            tx={tx}
            writeContracts={writeContracts}
            mainnetProvider={mainnetProvider}
          />
        </Route>
      </Switch>

      <ThemeSwitch />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <div style={{ marginRight: 20 }}>
            <NetworkSwitch
              networkOptions={networkOptions}
              selectedNetwork={selectedNetwork}
              setSelectedNetwork={setSelectedNetwork}
            />
          </div>
          <Account
            address={address}
            localProvider={localProvider}
            userSigner={userSigner}
            mainnetProvider={mainnetProvider}
            price={price}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            blockExplorer={blockExplorer}
          />
        </div>
        <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
      </div>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: 
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={price} address={address} networks={NETWORKS} />
          </Col>

          <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
            <GasGauge gasPrice={gasPrice} />
          </Col>
          <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
            <Button
              onClick={() => {
                window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
              }}
              size="large"
              shape="round"
            >
              <span style={{ marginRight: 8 }} role="img" aria-label="support">
                💬
              </span>
              Support
            </Button>
          </Col>
        </Row>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              //  if the local provider has a signer, let's show the faucet:  
              faucetAvailable ? (
                <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
              ) : (
                ""
              )
            }
          </Col>
        </Row>
      </div>*/}
    </div>
  );
}

export default App;
