import { ethers, network } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";
import { Contract } from "ethers";

  const basicPawn = async (accounts) => {
    const owner = await accounts[0].getAddress();
    const NFTPawnShop = await ethers.getContractFactory("NFTPawnShop");
    const PawnNFT = await ethers.getContractFactory("PawnNFT");

    var pawnShop = await NFTPawnShop.deploy();
    var pawnNFT = await PawnNFT.deploy("PawnNFT", "PWN");

    await pawnNFT.deployed();
    expect(await pawnNFT.name()).to.equal("PawnNFT");
    expect(await pawnNFT.symbol()).to.equal("PWN");

    // NFT mint to owner
    const pawnNFTxn = await pawnNFT.mint(owner, 1, { from: owner     });
    await pawnNFTxn.wait();

    expect(await pawnNFT.ownerOf(1)).to.equal(owner);

    // Approve pawnShop address from owner
    const pawnNFTApprove = await pawnNFT.approve(pawnShop.address, 1, {
      from: owner,
    });
    await pawnNFTApprove.wait();

    const nftAddress = pawnNFT.address;
    const nftTokenID = 1;
    const amountInWei = 100000000;
    const duration = 3600;
    const interestRate = 10;

    const pawnTX = await pawnShop.pawn(
      nftAddress,
      nftTokenID,
      amountInWei,
      duration,
      interestRate,
      { from: owner }
    );

    // wait for transaction to be mined
    await pawnTX.wait();

    expect(await pawnNFT.ownerOf(1)).to.equal(pawnShop.address);

    const [terms, count] = await pawnShop.getWaitingTerms();
    expect(count).to.equal(1);
    return pawnShop;
  };

const doBasicPawn = async() => {
      accounts = await ethers.getSigners();
    let pawnShop = await basicPawn(accounts);
    const borrower = await accounts[0].getAddress();
    const prevBalance = await accounts[0].getBalance();
    const acceptTermsTx = await pawnShop
      .connect(accounts[1]) // loaner
      .acceptTerms(borrower, 0, { value: 100000000 });
    await acceptTermsTx.wait();
    const newBalance = await accounts[0].getBalance();
}