import {ethers} from "hardhat";
import Web3 from "web3";
import chai from "chai";
import {solidity} from "ethereum-waffle";
chai.use(solidity);
const {expect} = chai;
const web3 = new Web3();
import {Mercato__factory} from "../typechain";
import exp from "constants";

describe("Mercato", function () {
  let owner: any;
  let ownerAddress: string;
  let taxRecepient: any;
  let taxAddress: string;
  let marketing: any;
  let marketingAddress: string;
  let cex: any;
  let cexAddress: string;
  let team: any;
  let teamAddress: string;
  let Mercato: any;
  let MercatoFactory: any;
  let MercatoAddress: string;
  let uniswapV2Pair: any;
  let uniswapV2PairAddress: string;
  let public1: any;
  let public2: any;
  let publicAddress1: string;
  let publicAddress2: string;
  let ownerInstance: any;
  let teamInstance: any;
  let publicInstance1: any;
  let publicInstance2: any;
  let uniswapV2PairInstance: any;

  const taxAddressProd = "0xdaa9F7Ae5A1cD7f421643123A9f3D12518d7344E";
  const marketingAddressProd = "0x0b37e1781b62d54c1e86786a48e0595abf0c9d87";
  const cexAddressProd = "0x32e4ef91b367543148b79b62f882dddd262059ab";
  const teamAddressProd = "0xacc9840964f2092e61edaa87c82257d22410a34d";

  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const mercatoTotalSupply = "910910910910000000000000000000";
  const taxRateInBips = 500;
  const newTaxRateInBips = 375;

  beforeEach(async function () {
    [owner, public1, public2, uniswapV2Pair] = await ethers.getSigners();

    taxRecepient = await ethers.getImpersonatedSigner(taxAddressProd);
    await owner.sendTransaction({
      to: taxRecepient.address,
      value: ethers.utils.parseEther("100"),
    });

    marketing = await ethers.getImpersonatedSigner(marketingAddressProd);
    await owner.sendTransaction({
      to: marketing.address,
      value: ethers.utils.parseEther("100"),
    });

    cex = await ethers.getImpersonatedSigner(cexAddressProd);
    await owner.sendTransaction({
      to: cex.address,
      value: ethers.utils.parseEther("100"),
    });

    team = await ethers.getImpersonatedSigner(teamAddressProd);
    await owner.sendTransaction({
      to: team.address,
      value: ethers.utils.parseEther("100"),
    });

    ownerAddress = owner.address;
    marketingAddress = marketing.address;
    cexAddress = cex.address;
    teamAddress = team.address;
    taxAddress = taxRecepient.address;
    publicAddress1 = public1.address;
    publicAddress2 = public2.address;
    uniswapV2PairAddress = uniswapV2Pair.address;

    MercatoFactory = new Mercato__factory(owner);
    Mercato = await MercatoFactory.deploy();
    MercatoAddress = Mercato.address;

    ownerInstance = new Mercato__factory(owner).attach(MercatoAddress);
    taxRecepient = new Mercato__factory(taxRecepient).attach(MercatoAddress);
    teamInstance = new Mercato__factory(team).attach(MercatoAddress);
    publicInstance1 = new Mercato__factory(public1).attach(MercatoAddress);
    publicInstance2 = new Mercato__factory(public2).attach(MercatoAddress);
    uniswapV2PairInstance = new Mercato__factory(uniswapV2Pair).attach(
      MercatoAddress
    );
  });

  it("Should have correct name, symbol, and decimals", async function () {
    expect(await Mercato.name()).to.equal("Mercato");
    expect(await publicInstance1.name()).to.equal("Mercato");
    expect(await Mercato.symbol()).to.equal("MERCATO");
    expect(await publicInstance1.symbol()).to.equal("MERCATO");
    expect(await Mercato.decimals()).to.equal(18);
    expect(await publicInstance1.decimals()).to.equal(18);
  });

  it("Should have correct marketing, cex, team, and taxRecepient addresses", async function () {
    expect(await Mercato.marketingAddress()).to.equal(marketingAddress);
    expect(await publicInstance1.marketingAddress()).to.equal(marketingAddress);
    expect(await Mercato.cexAddress()).to.equal(cexAddress);
    expect(await publicInstance1.cexAddress()).to.equal(cexAddress);
    expect(await Mercato.teamAddress()).to.equal(teamAddress);
    expect(await publicInstance1.teamAddress()).to.equal(teamAddress);
    expect(await Mercato.getTaxAddress()).to.equal(taxAddress);
    expect(await publicInstance1.getTaxAddress()).to.equal(taxAddress);
  });

  it("Should have correct initial supply", async function () {
    expect(await Mercato.totalSupply()).to.equal(mercatoTotalSupply);
    expect(await publicInstance1.totalSupply()).to.equal(mercatoTotalSupply);
  });

  it("Should have correct initial owner balance", async function () {
    const _totalSupply = await Mercato.totalSupply();
    const _ownerAmount = _totalSupply.mul(6570).div(10000);
    const _marketingAmount = _totalSupply.mul(1620).div(10000);
    const _cexAmount = _totalSupply.mul(1200).div(10000);
    const _teamAmount = _totalSupply.mul(610).div(10000);
    expect(await Mercato.balanceOf(owner.address)).to.equal(_ownerAmount);
    expect(await Mercato.balanceOf(marketing.address)).to.equal(
      _marketingAmount
    );
    expect(await Mercato.balanceOf(cex.address)).to.equal(_cexAmount);
    expect(await Mercato.balanceOf(team.address)).to.equal(_teamAmount);
    expect(_totalSupply).to.equal(
      _ownerAmount.add(_marketingAmount).add(_cexAmount).add(_teamAmount)
    );
  });

  it("Should have the correct owner", async function () {
    expect(await Mercato.owner()).to.equal(owner.address);
  });

  it("Should not allow renouncing ownership", async function () {
    await expect(ownerInstance.renounceOwnership()).to.be.revertedWith(
      "Mercato: uniswapV2Pair is not set"
    );
  });

  it("Should allow renouncing ownership after uniswapV2Pair is set", async function () {
    await expect(ownerInstance.setPair(uniswapV2PairAddress))
      .to.emit(Mercato, "SetPair(address)")
      .withArgs(uniswapV2PairAddress);
    await expect(ownerInstance.renounceOwnership()).to.emit(
      Mercato,
      "OwnershipTransferred"
    );
    expect(await Mercato.owner()).to.equal(zeroAddress);
  });

  it("Should not allow setting uniswapV2Pair after renouncing ownership", async function () {
    await expect(ownerInstance.setPair(uniswapV2PairAddress))
      .to.emit(Mercato, "SetPair(address)")
      .withArgs(uniswapV2PairAddress);
    await expect(ownerInstance.renounceOwnership()).to.emit(
      Mercato,
      "OwnershipTransferred"
    );
    expect(await Mercato.owner()).to.equal(zeroAddress);

    await expect(
      ownerInstance.setPair(uniswapV2PairAddress)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should not allow setting Tax Rate higher than 5%", async function () {
    await expect(ownerInstance.setTaxRate("501")).to.be.revertedWith(
      "Mercato: tax rate cannot be more than 5%"
    );
  });

  it("Should allow setting Tax Rate less than 5% by owner", async function () {
    expect(await ownerInstance.setTaxRate("499"))
      .to.emit(Mercato, "SetTaxRate(uint256,uint256)")
      .withArgs("500", "499");
  });

  it("Should not allow setting Tax Rate by other than owner", async function () {
    await expect(publicInstance1.setTaxRate("300")).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("Should not allow setting uniswapV2Pair by other than owner", async function () {
    await expect(
      publicInstance1.setPair(uniswapV2PairAddress)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should not allow setting Tax Rate after renouncing ownership", async function () {
    await expect(ownerInstance.setPair(uniswapV2PairAddress))
      .to.emit(Mercato, "SetPair(address)")
      .withArgs(uniswapV2PairAddress);
    await expect(ownerInstance.renounceOwnership()).to.emit(
      Mercato,
      "OwnershipTransferred"
    );
    expect(await Mercato.owner()).to.equal(zeroAddress);

    await expect(ownerInstance.setTaxRate("300")).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("Should allow transfers from/to owner", async function () {
    const ownerBalance = await Mercato.balanceOf(ownerAddress);
    const _spendingAmount = ownerBalance.div(3);
    expect(await Mercato.balanceOf(publicAddress1)).to.equal("0");
    await expect(ownerInstance.transfer(publicAddress1, _spendingAmount))
      .to.emit(Mercato, "Transfer")
      .withArgs(ownerAddress, publicAddress1, _spendingAmount);
    expect(await Mercato.balanceOf(publicAddress1)).to.equal(_spendingAmount);
    expect(await Mercato.balanceOf(ownerAddress)).to.equal(
      ownerBalance.sub(_spendingAmount)
    );
    await expect(publicInstance1.transfer(ownerAddress, _spendingAmount))
      .to.emit(Mercato, "Transfer")
      .withArgs(publicAddress1, ownerAddress, _spendingAmount);
    expect(await Mercato.balanceOf(ownerAddress)).to.equal(ownerBalance);
    expect(await Mercato.balanceOf(publicAddress1)).to.equal("0");
  });

  it("Should allow transfer by owner's spender", async function () {
    const ownerBalance = await Mercato.balanceOf(ownerAddress);
    const _spendingAmount = ownerBalance.div(3);
    expect(await Mercato.balanceOf(publicAddress2)).to.equal("0");
    await expect(ownerInstance.approve(publicAddress1, _spendingAmount))
      .to.emit(Mercato, "Approval")
      .withArgs(ownerAddress, publicAddress1, _spendingAmount);
    await expect(
      publicInstance1.transferFrom(
        ownerAddress,
        publicAddress2,
        _spendingAmount
      )
    )
      .to.emit(Mercato, "Transfer")
      .withArgs(ownerAddress, publicAddress2, _spendingAmount);
    expect(await Mercato.balanceOf(publicAddress2)).to.equal(_spendingAmount);
    expect(await Mercato.balanceOf(ownerAddress)).to.equal(
      ownerBalance.sub(_spendingAmount)
    );
    expect(await Mercato.balanceOf(publicAddress1)).to.equal("0");
  });

  it("Should not allow setting uniswapV2Pair after renouncing ownership", async function () {
    await expect(ownerInstance.setPair(uniswapV2PairAddress))
      .to.emit(Mercato, "SetPair(address)")
      .withArgs(uniswapV2PairAddress);
    await expect(ownerInstance.renounceOwnership()).to.emit(
      Mercato,
      "OwnershipTransferred"
    );
    expect(await Mercato.owner()).to.equal(zeroAddress);

    await expect(ownerInstance.setPair(zeroAddress)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("Should set uniswapv2 pair and transfer/burn", async function () {
    const ownerBalance = await Mercato.balanceOf(ownerAddress);
    const _spendingAmount = ownerBalance.div(3);
    expect(await Mercato.uniswapV2Pair()).to.equal(zeroAddress);
    await expect(ownerInstance.setPair(uniswapV2PairAddress))
      .to.emit(Mercato, "SetPair(address)")
      .withArgs(uniswapV2PairAddress);
    expect(await Mercato.uniswapV2Pair()).to.equal(uniswapV2PairAddress);

    await expect(ownerInstance.transfer(publicAddress1, _spendingAmount))
      .to.emit(Mercato, "Transfer")
      .withArgs(ownerAddress, publicAddress1, _spendingAmount);
    await expect(publicInstance1.transfer(publicAddress2, _spendingAmount))
      .to.emit(Mercato, "Transfer")
      .withArgs(publicAddress1, publicAddress2, _spendingAmount);
    expect(await Mercato.balanceOf(publicAddress2)).to.equal(_spendingAmount);
    expect(await Mercato.balanceOf(publicAddress1)).to.equal("0");

    expect(await Mercato.balanceOf(ownerAddress)).to.equal(
      ownerBalance.sub(_spendingAmount)
    );
    await expect(ownerInstance.burn(_spendingAmount))
      .to.emit(Mercato, "Transfer")
      .withArgs(ownerAddress, zeroAddress, _spendingAmount);
    expect(await Mercato.balanceOf(ownerAddress)).to.equal(
      ownerBalance.sub(_spendingAmount).sub(_spendingAmount)
    );
  });

  it("Should allow swap and taxes", async function () {
    const totalSupply = await Mercato.totalSupply();
    const ownerBalance = await Mercato.balanceOf(ownerAddress);
    const _spendingAmount1 = ownerBalance.mul(3300).div(10000); // 33%
    const _spendingAmount2 = totalSupply.mul(400).div(10000); // 4%
    const _spendingAmount3 = totalSupply.mul(30).div(10000); // 0.3%

    // Check that uniswapV2Pair is not set
    expect(await Mercato.uniswapV2Pair()).to.equal(zeroAddress);

    // Set uniswapV2Pair
    await expect(ownerInstance.setPair(uniswapV2PairAddress))
      .to.emit(Mercato, "SetPair(address)")
      .withArgs(uniswapV2PairAddress);

    // Check that uniswapV2Pair is set
    expect(await Mercato.uniswapV2Pair()).to.equal(uniswapV2PairAddress);

    // Transfer tokens from owner to uniswapV2PairAddress
    await ownerInstance.transfer(uniswapV2PairAddress, ownerBalance);

    // Check that uniswapV2Pair has tokens
    const uniswapV2PairBalanceBefore =
      await Mercato.balanceOf(uniswapV2PairAddress);
    expect(uniswapV2PairBalanceBefore).to.equal(ownerBalance);

    // Check fee Recepient Balance Before
    const taxRecepientBalance = await Mercato.balanceOf(taxAddress);
    // Transfer tokens from UniswapV2Pair to publicAddress1
    await uniswapV2PairInstance.transfer(publicAddress1, _spendingAmount1);

    // Calculate fees
    const _taxFee1 = _spendingAmount1.mul(taxRateInBips).div(10000);

    // Check that publicAddress1 has tokens
    const publicAddress1Balance = await Mercato.balanceOf(publicAddress1);
    expect(publicAddress1Balance).to.equal(_spendingAmount1.sub(_taxFee1));

    // Check that uniswapV2Pair has tokens
    const uniswapV2PairBalanceAfter1 =
      await Mercato.balanceOf(uniswapV2PairAddress);
    expect(uniswapV2PairBalanceAfter1).to.equal(
      uniswapV2PairBalanceBefore.sub(_spendingAmount1)
    );

    // Check that taxRecepient has tokens
    const taxRecepientBalanceAfter1 = await Mercato.balanceOf(taxAddress);
    expect(taxRecepientBalanceAfter1).to.equal(
      taxRecepientBalance.add(_taxFee1)
    );

    // Transfer tokens from Team to UniSwapV2Pair
    const teamBalanceBefore = await Mercato.balanceOf(team.address);
    await teamInstance.transfer(uniswapV2PairAddress, _spendingAmount2);

    // Calculate fees
    const _taxFee2 = _spendingAmount2.mul(taxRateInBips).div(10000);

    // Check Team Balance After
    const teamBalanceAfter2 = await Mercato.balanceOf(teamAddress);
    expect(teamBalanceAfter2).to.equal(teamBalanceBefore.sub(_spendingAmount2));

    // Check that uniswapV2Pair has tokens
    const uniswapV2PairBalanceAfter2 =
      await Mercato.balanceOf(uniswapV2PairAddress);
    expect(uniswapV2PairBalanceAfter2).to.equal(
      uniswapV2PairBalanceAfter1.add(_spendingAmount2).sub(_taxFee2)
    );

    // Check that taxRecepient has tokens
    const taxRecepientBalanceAfter2 = await Mercato.balanceOf(taxAddress);
    expect(taxRecepientBalanceAfter2).to.equal(
      taxRecepientBalanceAfter1.add(_taxFee2)
    );

    // Transfer tokens from taxRecepient to publicAddress2
    await taxRecepient.transfer(publicAddress2, _spendingAmount3);

    // Check that publicAddress2 has tokens
    const publicAddress2Balance = await Mercato.balanceOf(publicAddress2);
    expect(publicAddress2Balance).to.equal(_spendingAmount3);

    // Check that taxRecepient has tokens
    const taxRecepientBalanceAfter3 = await Mercato.balanceOf(taxAddress);
    expect(taxRecepientBalanceAfter3).to.equal(
      taxRecepientBalanceAfter2.sub(_spendingAmount3)
    );
  });

  it("Should allow swap and taxes after renouncing ownership", async function () {
    const totalSupply = await Mercato.totalSupply();
    const ownerBalance = await Mercato.balanceOf(ownerAddress);
    const _spendingAmount1 = ownerBalance.mul(3300).div(10000); // 33%
    const _spendingAmount2 = totalSupply.mul(400).div(10000); // 4%
    const _spendingAmount3 = totalSupply.mul(30).div(10000); // 0.3%

    // Check that uniswapV2Pair is not set
    expect(await Mercato.uniswapV2Pair()).to.equal(zeroAddress);

    // Set uniswapV2Pair
    await expect(ownerInstance.setPair(uniswapV2PairAddress))
      .to.emit(Mercato, "SetPair(address)")
      .withArgs(uniswapV2PairAddress);

    // Check that uniswapV2Pair is set
    expect(await Mercato.uniswapV2Pair()).to.equal(uniswapV2PairAddress);

    // Transfer tokens from owner to uniswapV2PairAddress
    await ownerInstance.transfer(uniswapV2PairAddress, ownerBalance);

    // Check that uniswapV2Pair has tokens
    const uniswapV2PairBalanceBefore =
      await Mercato.balanceOf(uniswapV2PairAddress);
    expect(uniswapV2PairBalanceBefore).to.equal(ownerBalance);

    // Check fee Recepient Balance Before
    const taxRecepientBalance = await Mercato.balanceOf(taxAddress);
    // Transfer tokens from UniswapV2Pair to publicAddress1
    await uniswapV2PairInstance.transfer(publicAddress1, _spendingAmount1);

    // Calculate fees
    const _taxFee1 = _spendingAmount1.mul(taxRateInBips).div(10000);

    // Check that publicAddress1 has tokens
    const publicAddress1Balance = await Mercato.balanceOf(publicAddress1);
    expect(publicAddress1Balance).to.equal(_spendingAmount1.sub(_taxFee1));

    // Check that uniswapV2Pair has tokens
    const uniswapV2PairBalanceAfter1 =
      await Mercato.balanceOf(uniswapV2PairAddress);
    expect(uniswapV2PairBalanceAfter1).to.equal(
      uniswapV2PairBalanceBefore.sub(_spendingAmount1)
    );

    // Check that taxRecepient has tokens
    const taxRecepientBalanceAfter1 = await Mercato.balanceOf(taxAddress);
    expect(taxRecepientBalanceAfter1).to.equal(
      taxRecepientBalance.add(_taxFee1)
    );

    // Renounce Ownership
    await expect(ownerInstance.renounceOwnership()).to.emit(
      Mercato,
      "OwnershipTransferred"
    );

    // Check that ownership is renounced
    expect(await Mercato.owner()).to.equal(zeroAddress);

    // Transfer tokens from Team to UniSwapV2Pair
    const teamBalanceBefore = await Mercato.balanceOf(teamAddress);
    await teamInstance.transfer(uniswapV2PairAddress, _spendingAmount2);

    // Calculate fees
    const _taxFee2 = _spendingAmount2.mul(taxRateInBips).div(10000);

    // Check Team Balance After
    const teamBalanceAfter2 = await Mercato.balanceOf(teamAddress);
    expect(teamBalanceAfter2).to.equal(teamBalanceBefore.sub(_spendingAmount2));

    // Check that uniswapV2Pair has tokens
    const uniswapV2PairBalanceAfter2 =
      await Mercato.balanceOf(uniswapV2PairAddress);
    expect(uniswapV2PairBalanceAfter2).to.equal(
      uniswapV2PairBalanceAfter1.add(_spendingAmount2).sub(_taxFee2)
    );

    // Check that taxRecepient has tokens
    const taxRecepientBalanceAfter2 = await Mercato.balanceOf(taxAddress);
    expect(taxRecepientBalanceAfter2).to.equal(
      taxRecepientBalanceAfter1.add(_taxFee2)
    );

    // Transfer tokens from taxRecepient to publicAddress2
    await taxRecepient.transfer(publicAddress2, _spendingAmount3);

    // Check that publicAddress2 has tokens
    const publicAddress2Balance = await Mercato.balanceOf(publicAddress2);
    expect(publicAddress2Balance).to.equal(_spendingAmount3);

    // Check that taxRecepient has tokens
    const taxRecepientBalanceAfter3 = await Mercato.balanceOf(taxAddress);
    expect(taxRecepientBalanceAfter3).to.equal(
      taxRecepientBalanceAfter2.sub(_spendingAmount3)
    );
  });

  it("Should allow swap and taxes after changing tax rate", async function () {
    const totalSupply = await Mercato.totalSupply();
    const ownerBalance = await Mercato.balanceOf(ownerAddress);
    const _spendingAmount1 = ownerBalance.mul(3300).div(10000); // 33%
    const _spendingAmount2 = totalSupply.mul(400).div(10000); // 4%
    const _spendingAmount3 = totalSupply.mul(30).div(10000); // 0.3%

    // Check that uniswapV2Pair is not set
    expect(await Mercato.uniswapV2Pair()).to.equal(zeroAddress);

    // Set uniswapV2Pair
    await expect(ownerInstance.setPair(uniswapV2PairAddress))
      .to.emit(Mercato, "SetPair(address)")
      .withArgs(uniswapV2PairAddress);

    // Check that uniswapV2Pair is set
    expect(await Mercato.uniswapV2Pair()).to.equal(uniswapV2PairAddress);

    // Transfer tokens from owner to uniswapV2PairAddress
    await ownerInstance.transfer(uniswapV2PairAddress, ownerBalance);

    // Check that uniswapV2Pair has tokens
    const uniswapV2PairBalanceBefore =
      await Mercato.balanceOf(uniswapV2PairAddress);
    expect(uniswapV2PairBalanceBefore).to.equal(ownerBalance);

    // Check fee Recepient Balance Before
    const taxRecepientBalance = await Mercato.balanceOf(taxAddress);

    // Transfer tokens from UniswapV2Pair to publicAddress1
    await uniswapV2PairInstance.transfer(publicAddress1, _spendingAmount1);

    // Calculate fees
    const _taxFee1 = _spendingAmount1.mul(taxRateInBips).div(10000);

    // Check that publicAddress1 has tokens
    const publicAddress1Balance = await Mercato.balanceOf(publicAddress1);
    expect(publicAddress1Balance).to.equal(_spendingAmount1.sub(_taxFee1));

    // Check that uniswapV2Pair has tokens
    const uniswapV2PairBalanceAfter1 =
      await Mercato.balanceOf(uniswapV2PairAddress);
    expect(uniswapV2PairBalanceAfter1).to.equal(
      uniswapV2PairBalanceBefore.sub(_spendingAmount1)
    );

    // Check that taxRecepient has tokens
    const taxRecepientBalanceAfter1 = await Mercato.balanceOf(taxAddress);
    expect(taxRecepientBalanceAfter1).to.equal(
      taxRecepientBalance.add(_taxFee1)
    );

    // Change taxRateInBips to newTaxRateInBips
    expect(await ownerInstance.setTaxRate(newTaxRateInBips))
      .to.emit(Mercato, "SetTaxRate(uint256,uint256)")
      .withArgs(taxRateInBips, newTaxRateInBips);

    // Transfer tokens from Team to UniSwapV2Pair
    const teamBalanceBefore = await Mercato.balanceOf(teamAddress);
    await teamInstance.transfer(uniswapV2PairAddress, _spendingAmount2);

    // Calculate fees
    const _taxFee2 = _spendingAmount2.mul(newTaxRateInBips).div(10000);

    // Check Team Balance After
    const teamBalanceAfter2 = await Mercato.balanceOf(teamAddress);
    expect(teamBalanceAfter2).to.equal(teamBalanceBefore.sub(_spendingAmount2));

    // Check that uniswapV2Pair has tokens
    const uniswapV2PairBalanceAfter2 =
      await Mercato.balanceOf(uniswapV2PairAddress);
    expect(uniswapV2PairBalanceAfter2).to.equal(
      uniswapV2PairBalanceAfter1.add(_spendingAmount2).sub(_taxFee2)
    );

    // Check that taxRecepient has tokens
    const taxRecepientBalanceAfter2 = await Mercato.balanceOf(taxAddress);
    expect(taxRecepientBalanceAfter2).to.equal(
      taxRecepientBalanceAfter1.add(_taxFee2)
    );

    // Transfer tokens from taxRecepient to publicAddress2
    await taxRecepient.transfer(publicAddress2, _spendingAmount3);

    // Check that publicAddress2 has tokens
    const publicAddress2Balance = await Mercato.balanceOf(publicAddress2);
    expect(publicAddress2Balance).to.equal(_spendingAmount3);

    // Check that taxRecepient has tokens
    const taxRecepientBalanceAfter3 = await Mercato.balanceOf(taxAddress);
    expect(taxRecepientBalanceAfter3).to.equal(
      taxRecepientBalanceAfter2.sub(_spendingAmount3)
    );
  });

  it("Should allow swap and taxes after renouncing ownership and changing tax rate", async function () {
    const totalSupply = await Mercato.totalSupply();
    const ownerBalance = await Mercato.balanceOf(ownerAddress);
    const _spendingAmount1 = ownerBalance.mul(3300).div(10000); // 33%
    const _spendingAmount2 = totalSupply.mul(400).div(10000); // 4%
    const _spendingAmount3 = totalSupply.mul(30).div(10000); // 0.3%

    // Check that uniswapV2Pair is not set
    expect(await Mercato.uniswapV2Pair()).to.equal(zeroAddress);

    // Set uniswapV2Pair
    await expect(ownerInstance.setPair(uniswapV2PairAddress))
      .to.emit(Mercato, "SetPair(address)")
      .withArgs(uniswapV2PairAddress);

    // Check that uniswapV2Pair is set
    expect(await Mercato.uniswapV2Pair()).to.equal(uniswapV2PairAddress);

    // Transfer tokens from owner to uniswapV2PairAddress
    await ownerInstance.transfer(uniswapV2PairAddress, ownerBalance);

    // Check that uniswapV2Pair has tokens
    const uniswapV2PairBalanceBefore =
      await Mercato.balanceOf(uniswapV2PairAddress);
    expect(uniswapV2PairBalanceBefore).to.equal(ownerBalance);

    // Check fee Recepient Balance Before
    const taxRecepientBalance = await Mercato.balanceOf(taxAddress);

    // Transfer tokens from UniswapV2Pair to publicAddress1
    await uniswapV2PairInstance.transfer(publicAddress1, _spendingAmount1);

    // Calculate fees
    const _taxFee1 = _spendingAmount1.mul(taxRateInBips).div(10000);

    // Check that publicAddress1 has tokens
    const publicAddress1Balance = await Mercato.balanceOf(publicAddress1);
    expect(publicAddress1Balance).to.equal(_spendingAmount1.sub(_taxFee1));

    // Check that uniswapV2Pair has tokens
    const uniswapV2PairBalanceAfter1 =
      await Mercato.balanceOf(uniswapV2PairAddress);
    expect(uniswapV2PairBalanceAfter1).to.equal(
      uniswapV2PairBalanceBefore.sub(_spendingAmount1)
    );

    // Check that taxRecepient has tokens
    const taxRecepientBalanceAfter1 = await Mercato.balanceOf(taxAddress);
    expect(taxRecepientBalanceAfter1).to.equal(
      taxRecepientBalance.add(_taxFee1)
    );

    // Change taxRateInBips to newTaxRateInBips
    expect(await ownerInstance.setTaxRate(newTaxRateInBips))
      .to.emit(Mercato, "SetTaxRate(uint256,uint256)")
      .withArgs(taxRateInBips, newTaxRateInBips);

    // Transfer tokens from Team to UniSwapV2Pair
    const teamBalanceBefore = await Mercato.balanceOf(teamAddress);
    await teamInstance.transfer(uniswapV2PairAddress, _spendingAmount2);

    // Calculate fees
    const _taxFee2 = _spendingAmount2.mul(newTaxRateInBips).div(10000);

    // Check Team Balance After
    const teamBalanceAfter2 = await Mercato.balanceOf(teamAddress);
    expect(teamBalanceAfter2).to.equal(teamBalanceBefore.sub(_spendingAmount2));

    // Check that uniswapV2Pair has tokens
    const uniswapV2PairBalanceAfter2 =
      await Mercato.balanceOf(uniswapV2PairAddress);
    expect(uniswapV2PairBalanceAfter2).to.equal(
      uniswapV2PairBalanceAfter1.add(_spendingAmount2).sub(_taxFee2)
    );

    // Check that taxRecepient has tokens
    const taxRecepientBalanceAfter2 = await Mercato.balanceOf(taxAddress);
    expect(taxRecepientBalanceAfter2).to.equal(
      taxRecepientBalanceAfter1.add(_taxFee2)
    );

    // Renounce Ownership
    await expect(ownerInstance.renounceOwnership()).to.emit(
      Mercato,
      "OwnershipTransferred"
    );

    // Check that ownership is renounced
    expect(await Mercato.owner()).to.equal(zeroAddress);

    // Transfer tokens from taxRecepient to publicAddress2
    await taxRecepient.transfer(publicAddress2, _spendingAmount3);

    // Check that publicAddress2 has tokens
    const publicAddress2Balance = await Mercato.balanceOf(publicAddress2);
    expect(publicAddress2Balance).to.equal(_spendingAmount3);

    // Check that taxRecepient has tokens
    const taxRecepientBalanceAfter3 = await Mercato.balanceOf(taxAddress);
    expect(taxRecepientBalanceAfter3).to.equal(
      taxRecepientBalanceAfter2.sub(_spendingAmount3)
    );
  });
});
