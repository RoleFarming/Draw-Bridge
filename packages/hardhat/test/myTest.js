const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { BigNumber } = require("ethers");

use(solidity);

describe("Draw-Bridge", function () {
  let myContract;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("YourContract", function () {
    it("Should deploy YourContract", async function () {
      const YourContract = await ethers.getContractFactory("YourContract");

      myContract = await YourContract.deploy();
    });

    describe("setPurpose()", function () {
      it("Should be able to set a new purpose", async function () {
        const newPurpose = "Test Purpose";

        await myContract.setPurpose(newPurpose);
        expect(await myContract.purpose()).to.equal(newPurpose);
      });

    });

    describe("addOrder()", function () {
      it("Should be able to add order", async function () {
        let ethAddress = "0x3314b13a30747398d4c62FD1cadF152dB68D9bF4";
        let csprAddress = "01110694962022886611a8e90b1960a71c108cb92b556224d237967cd8393587ef";
        let cspr = {
          a: BigNumber.from(0),
          b: BigNumber.from(0),
          c: "" + csprAddress,
        };

        let amountValue = 1;
        let value = ethers.utils.parseEther("" + amountValue);
        let reverse = false;
        let txId = '0xe5c2edb96b4664540ac93d4ffd48f4e441ffb116c498c91b8f1174b23bebe444';

        await myContract.addOrder(ethAddress, cspr.a,cspr.b,cspr.c, value, reverse, txId);
//          expect(await myContract.purpose()).to.equal(newPurpose);
//          const orders = useContractReader(readContracts, "YourContract", "getOrders");
        let orders = await myContract.getOrders();
        console.log(orders);
        expect(orders.length).to.equal(1);
      });
    });

    describe("updateOrder()", function () {
      it("Should be able to update order", async function () {
        let csprTx = "01b5d00a38e1783345ffe0bfa8423e026b76480683e0b19966ee47c7f68a827c00";
        await myContract.updateOrder(0, 1, csprTx);
      });

      it("Should be fail to update order by out of index panic", async function () {
        let csprTx = "01b5d00a38e1783345ffe0bfa8423e026b76480683e0b19966ee47c7f68a827c00";
        await myContract.updateOrder(1, 1, csprTx);
      });

    });
  });
});
