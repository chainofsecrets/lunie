const { UserInputError } = require('apollo-server')
const fetch = require('node-fetch')
const Sentry = require('@sentry/node')
const BigNumber = require('bignumber.js')

const transactionTypesSet = new Set([
  'SendTx',
  'StakeTx',
  'UnstakeTx',
  'RestakeTx',
  'ClaimRewardsTx',
  'SubmitProposalTx',
  'VoteTx',
  'DepositTx',
  'UnknownTx'
])

const FEES_POLLING_INTERVAL = 3600000 // 1h
const TERRA_TAX_CAP = 1000000
const TERRA_TAX_RATE_ENDPOINT = `https://lcd.terra.dev/treasury/tax_rate`
// TODO: add also endpoint for new testnet when it is released
const EMONEY_GAS_PRICES_ENDPOINT = `http://emoney.validator.network/light/authority/gasprices`

let terraTaxRate
let emoneyGasPrices

const pollForNewFees = async () => {
  const terraTaxRateResponse = await fetch(TERRA_TAX_RATE_ENDPOINT)
  .then((r) => r.json())
  .catch((err) => {
    Sentry.withScope(function (scope) {
      scope.setExtra('terra tax rate endpoint', TERRA_TAX_RATE_ENDPOINT)
      Sentry.captureException(err)
    })
  })
  const emoneyGasPricesResponse = await fetch(EMONEY_GAS_PRICES_ENDPOINT)
  .then((r) => r.json())
  .catch((err) => {
    Sentry.withScope(function (scope) {
      scope.setExtra('emoney gas prices endpoint', EMONEY_GAS_PRICES_ENDPOINT)
      Sentry.captureException(err)
    })
  })
  terraTaxRate = Number(Number(terraTaxRateResponse.result).toFixed(6))
  emoneyGasPrices = emoneyGasPricesResponse.result.min_gas_prices.map(gasPrice => gasPrice = {
    denom: gasPrice.denom, 
    price: gasPrice.amount
  })
  setTimeout(async () => {
    pollForNewFees()
  }, FEES_POLLING_INTERVAL)
}

// run on API launch
pollForNewFees()

const getNetworkTransactionGasEstimates = (networkId, transactionType) => {
  if (transactionType && !transactionTypesSet.has(transactionType)) {
    throw new UserInputError(
      `Unrecognized transaction type. Valid transaction types are ${Array.from(
        transactionTypesSet.keys()
      ).join(', ')}.`
    )
  }
  const networkGasEstimates = networkGasEstimatesDictionary[networkId]
  if (!networkGasEstimates) {
    throw new UserInputError(
      `Unrecognized network. Currently only ${Object.keys(
        networkGasEstimatesDictionary
      ).join(', ')} are supported`
    )
  }
  return transactionType && networkGasEstimates[`${transactionType}`]
    ? networkGasEstimates[`${transactionType}`]
    : networkGasEstimates.default
}

const getNetworkGasPrices = (networkId) => {
  // update emoneyGasPrices
  networkGasPricesDictionary['emoney-mainnet'] = emoneyGasPrices
  return networkGasPricesDictionary[networkId]
}

const getNetworkTransactionChainAppliedFees = (networkId, transactionType) => {
  if (networkId.startsWith('terra') && transactionType === 'SendTx') {
    return {
      rate: terraTaxRate,
      cap: TERRA_TAX_CAP
    }
  } else {
    return null
  }
}

const terraGasEstimates = {
    default: 300000,
    ClaimRewardsTx: 550000
}

const cosmosGasEstimates = {
  default: 550000
}

const emoneyGasEstimates = {
  default: 300000,
  SendTx: 75000,
  StakeTx: 550000,
  UnstakeTx: 550000,
  ClaimRewardsTx: 550000,
  RestakeTx: 550000
}

const akashGasEstimates = {
  default: 200000
}

const polkadotGasEstimates = {
  default: 0
}

const kavaGasEstimates = {
  default: 550000
}

const networkGasEstimatesDictionary = {
  'cosmos-hub-mainnet': cosmosGasEstimates,
  'cosmos-hub-testnet': cosmosGasEstimates,
  'terra-mainnet': terraGasEstimates,
  'terra-testnet': terraGasEstimates,
  'emoney-mainnet': emoneyGasEstimates,
  'emoney-testnet': emoneyGasEstimates,
  'akash-testnet': akashGasEstimates,
  'kusama': polkadotGasEstimates,
  'kava-mainnet': kavaGasEstimates,
  'kava-testnet': kavaGasEstimates
}

const cosmosGasPrices = [
  {
    denom: 'uatom',
    price: '0.65e-2'
  },
  {
    denom: 'umuon',
    price: '0.65e-2'
  }
]

const terraGasPrices = [
  {
    denom: 'ukrw',
    price: '0.01'
  },
  {
    denom: 'uluna',
    price: '0.015'
  },
  {
    denom: 'umnt',
    price: '0.01'
  },
  {
    denom: 'usdr',
    price: '0.01'
  },
  {
    denom: 'uusd',
    price: '0.01'
  }
]

const kavaGasPrices = [
  {
    denom: 'ukava',
    price: '0.1'
  }
]

const akashGasPrices = [
  {
    denom: 'uakt',
    price: '0.01'
  }
]

const polkadotGasPrices = []

let networkGasPricesDictionary = {
  'cosmos-hub-mainnet': cosmosGasPrices,
  'cosmos-hub-testnet': cosmosGasPrices,
  'terra-mainnet': terraGasPrices,
  'terra-testnet': terraGasPrices,
  'emoney-mainnet': emoneyGasPrices,
  'emoney-testnet': emoneyGasPrices,
  'kava-mainnet': kavaGasPrices,
  'kava-testnet': kavaGasPrices,
  'akash-testnet': akashGasPrices,
  'kusama': polkadotGasPrices,
}

const getPolkadotMessage = async (messageType, senderAddress, message, network, networkSource) => {
  const polkadotMessages = require(`../lib/messageCreators/polkadot-transactions`)
  const messageFormatter = polkadotMessages[messageType]
  const api = networkSource.store.polkadotRPC
  await api.isReady
  return messageFormatter && network ? await messageFormatter(senderAddress, message, network, api) : null
}

const getPolkadotFee = async ({ messageType, message, senderAddress, network, networkSource }) => {
  if (!messageType) return null

  const chainMessage = await getPolkadotMessage(
    messageType,
    senderAddress,
    message,
    network,
    networkSource
  )

  const { partialFee } = await chainMessage.transaction.paymentInfo(
    senderAddress
  )
  const chainFees = partialFee.toJSON()
  const viewFees = BigNumber(chainFees)
    .times(network.coinLookup[0].chainToViewConversionFactor)
    .toNumber()
  let { amount } = message
  if (message.amounts) {
    const { amounts } = message
    amount = amounts[0]
  }  
  return {
    denom: (amount && amount.denom) || network.stakingDenom,
    amount: viewFees
  }
}

const maxDecimals = (value, decimals) => {
  return Number(BigNumber(value).toFixed(decimals))
}

const getFeeDenomFromMessage = (message, network) => {
  // check if there is a fee field (polkadot)
  if (message.fee) {
    return message.fee.denom
  }
  // check if there is an amounts field. Assumption: in this case we pay with the stakingDenom gasPrice
  if (message.amounts) {
    return network.stakingDenom
  }
  // check if there is an amount field
  if (message.amount) {
    return message.amount.denom
  }
  if (message.initialDeposit) {
    return message.initialDeposit.denom
  }
  // this happens for example in Vote transactions
  return network.stakingDenom
}

const getTransactionAmount = (message, feeDenom) => {
  // check if there is an amount field
  if (message.amount) {
    return message.amount.amount
  }
  // check if there is an amounts field
  if (message.amounts) {
    return message.amounts.find(({denom}) => denom === feeDenom).amount
  }
  return 0
}

const adjustFeesToMaxPayable = (selectedBalance, estimatedFee, gasEstimate) => {
  let gasPrice = (Number(selectedBalance.amount) - estimatedFee) / gasEstimate
  // BACKUP HACK, the gasPrice can never be negative, this should not happen :shrug:
  gasPrice = gasPrice >= 0 ? gasPrice : 0
  return {
    amount: maxDecimals(gasPrice * gasEstimate, 6),
    denom: selectedBalance.denom
  }
}

const selectAlternativeFee = (balances, feeDenom, gasEstimate) => {
  let newEstimatedFee
  const alternativeFeeBalance = balances.find((balance) => {
    if (balance.denom !== feeDenom) {
      newEstimatedFee = maxDecimals(
        Number(balance.gasPrice) * Number(gasEstimate),
        6
      )
    }
    return newEstimatedFee && balance.amount >= newEstimatedFee
      ? balance : null
  })
  if (alternativeFeeBalance) {
    return {
      denom: alternativeFeeBalance.denom,
      amount: newEstimatedFee,
    }
  }
  return null
}

const getCosmosFee = async (network, cosmosSource, senderAddress, messageType, message, gasEstimate) => {
  // query for this address balances
  const balances = await cosmosSource.getBalancesFromAddress(senderAddress)
  const feeDenom = getFeeDenomFromMessage(message, network)
  const gasPrice = BigNumber(
    getNetworkGasPrices(network.id).find(({ denom }) => {
      const coinLookup = network.coinLookup.find(
        ({ chainDenom }) => chainDenom === denom
      )
      return coinLookup ? coinLookup.viewDenom === feeDenom : false
    }).price
  )
    .times(
      network.coinLookup.find(({ viewDenom }) => viewDenom === feeDenom)
        .chainToViewConversionFactor
    )
    .toNumber(6)
  const chainAppliedFees = getNetworkTransactionChainAppliedFees(
    network.id,
    messageType
  )
  const transactionAmount = getTransactionAmount(message, feeDenom)
  let estimatedFee = {
    amount: String(
      chainAppliedFees && chainAppliedFees.rate > 0
        ? BigNumber(transactionAmount).times(chainAppliedFees.rate).toNumber()
        : gasEstimate * gasPrice
    ),
    denom: feeDenom
  }
  const selectedBalance = balances.find(({denom}) => denom === feeDenom)
  if (
    Number(transactionAmount) + Number(estimatedFee.amount) >
    Number(selectedBalance.amount) &&
    // emoney-mainnet and kava-mainnet don't allow discounts on fees
    network.id !== "emoney-mainnet" &&
    network.id !== "kava-mainnet"
  ) {
    // this one returns a new gasPrice
    estimatedFee = adjustFeesToMaxPayable(selectedBalance, estimatedFee, gasEstimate)
  }
  if (
    Number(transactionAmount) + Number(estimatedFee.amount) >
    Number(selectedBalance.amount) &&
    network.id === "emoney-mainnet"
  ) {
    // this one returns a completely new transactionFee (selecting it from balances)
    estimatedFee = selectAlternativeFee(balances, feeDenom, gasEstimate) || estimatedFee
  }
  return {
    transactionFee: estimatedFee,
    chainAppliedFees: chainAppliedFees
  }
}

module.exports = { 
  getNetworkTransactionGasEstimates, 
  getNetworkTransactionChainAppliedFees, 
  getNetworkGasPrices, 
  getPolkadotFee, 
  getPolkadotMessage, 
  getFeeDenomFromMessage, 
  getCosmosFee,
}