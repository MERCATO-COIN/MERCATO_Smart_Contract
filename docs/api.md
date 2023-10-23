# Solidity API

## Mercato

### taxRateInBips

```solidity
uint256 taxRateInBips
```

### taxAddress

```solidity
address taxAddress
```

### marketingAddress

```solidity
address marketingAddress
```

### cexAddress

```solidity
address cexAddress
```

### teamAddress

```solidity
address teamAddress
```

### uniswapV2Pair

```solidity
address uniswapV2Pair
```

### SetPair

```solidity
event SetPair(address _address)
```

### SetTaxRate

```solidity
event SetTaxRate(uint256 _oldTaxRateInBips, uint256 _newTaxRateInBips)
```

### constructor

```solidity
constructor() public
```

### getTaxAddress

```solidity
function getTaxAddress() external pure returns (address _taxAddress)
```

Get the tax address

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| _taxAddress | address | Tax address |

### setPair

```solidity
function setPair(address _uniswapV2Pair) external
```

Set UniswapV2Pair address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _uniswapV2Pair | address | UniswapV2Pair address |

### setTaxRate

```solidity
function setTaxRate(uint256 _newTaxRateInBips) external
```

Set the tax rate

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newTaxRateInBips | uint256 | New tax rate in bips |

### renounceOwnership

```solidity
function renounceOwnership() public virtual
```

Leaves the contract without owner

### _transfer

```solidity
function _transfer(address _from, address _to, uint256 _amount) internal
```

Transfer `amount` of tokens from `from` to `to`..

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _from | address | Sender address |
| _to | address | Recipient address |
| _amount | uint256 | Amount of tokens to transfer |

