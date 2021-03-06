const CosmosV2API = require('../../lib/source/cosmosV2-source')
const networks = require('../../data/networks')
const {
  delegatorAddress,
  mockValidatorsDictionary,
  delegatorRewards
} = require('./mock_data/delegators')

jest.useFakeTimers()
let mockDelegatorRewards = { ...delegatorRewards }
jest.mock('apollo-datasource-rest', () => {
  class MockRESTDataSource {
    constructor() {
      this.memoizedResults = {
        clear: jest.fn()
      }
    }

    get() {
      return mockDelegatorRewards
    }
  }

  return {
    RESTDataSource: MockRESTDataSource,
    HTTPCache: class MockHTTPCache {}
  }
})

describe('Cosmos V2 API', function () {
  describe('getRewards()', function () {
    let api, cosmosNetworkConfig, store

    beforeEach(() => {
      cosmosNetworkConfig = networks.find(
        (network) => network.id === 'cosmos-hub-testnet'
      )
      store = {
        validators: mockValidatorsDictionary
      }
      api = new CosmosV2API(cosmosNetworkConfig, store)
      mockDelegatorRewards = JSON.parse(JSON.stringify(delegatorRewards))
    })

    it('When an existing delegator address is passed, it should return the calculated rewards', async () => {
      //Act
      const result = await api.getRewards(delegatorAddress)

      //Assert
      expect(result[0]).toHaveProperty('amount')
      expect(result[0]).toHaveProperty('denom')
      expect(result[0].validator).toEqual(
        mockValidatorsDictionary[delegatorAddress]
      )
    })

    it('When an existing delegator address has no rewards, it should return no rewards', async () => {
      //Arrange
      mockDelegatorRewards.result.rewards = []

      //Act & Assert
      await expect(api.getRewards(delegatorAddress)).resolves.toEqual([])
    })

    it('When an existing delegator address is passed with a reward 49000000 (umuon), it should return amount 49 (muon)', async () => {
      //Arrange
      mockDelegatorRewards.result.rewards[0].reward[0].amount = 49000000

      //Act & Assert
      await expect(api.getRewards(delegatorAddress)).resolves.toEqual([
        {
          amount: '49',
          denom: 'MUON',
          fiatValue: undefined,
          validator: mockValidatorsDictionary[delegatorAddress]
        }
      ])
    })

    it('When an existing delegator address is passed with a reward < 1 (umuon), it should get filtered out', async () => {
      //Arrange
      mockDelegatorRewards.result.rewards[0].reward[0].amount = 0.05

      //Act & Assert
      await expect(api.getRewards(delegatorAddress)).resolves.toEqual([])
    })
  })
})
