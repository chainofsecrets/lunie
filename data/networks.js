module.exports = [
  {
    id: 'cosmos-hub-testnet',
    title: 'Gaia Testnet',
    chain_id: 'gaia-13007',
    rpc_url: 'wss://gaia-13007.lunie.io:26657/websocket',
    api_url:
      'http://gaia-13007--lcd--archive.datahub.figment.network/apikey/124a234fb3c6bccf430bfd298bd160ae',
    bech32_prefix: 'cosmos',
    address_prefix: 'cosmos',
    address_creator: 'cosmos',
    ledger_app: 'cosmos',
    network_type: 'cosmos',
    source_class_name: 'source/cosmosV2-source',
    block_listener_class_name: 'block-listeners/cosmos-node-subscription',
    testnet: true,
    feature_session: true,
    feature_explore: true,
    feature_portfolio: true,
    feature_validators: true,
    feature_proposals: true,
    feature_activity: true,
    feature_explorer: true,
    action_send: true,
    action_claim_rewards: true,
    action_delegate: true,
    action_redelegate: true,
    action_undelegate: true,
    action_deposit: true,
    action_vote: true,
    action_proposal: true,
    default: false,
    stakingDenom: 'MUON',
    enabled: true,
    icon: 'https://app.lunie.io/img/networks/cosmos-hub-mainnet.png',
    slug: 'cosmos-hub-testnet',
    powered: {
      name: 'Figment',
      picture:
        'https://s3.amazonaws.com/keybase_processed_uploads/bd5fb87f241bd78a9c4bceaaa849ca05_360_360.jpg'
    }
  },
  {
    id: 'cosmos-hub-mainnet',
    title: 'Cosmos Hub',
    chain_id: 'cosmoshub-3',
    rpc_url: 'wss://cosmos-hub-3.lunie.io/websocket',
    api_url:
      'https://cosmoshub-3--lcd--archive.datahub.figment.network/apikey/7996efcecdc5ef91da3715eb60cd2201',
    bech32_prefix: 'cosmos',
    address_prefix: 'cosmos',
    address_creator: 'cosmos',
    network_type: 'cosmos',
    ledger_app: 'cosmos',
    source_class_name: 'source/cosmosV2-source',
    block_listener_class_name: 'block-listeners/cosmos-node-subscription',
    testnet: false,
    feature_session: true,
    feature_explore: true,
    feature_portfolio: true,
    feature_validators: true,
    feature_proposals: true,
    feature_activity: true,
    feature_explorer: true,
    action_send: true,
    action_claim_rewards: true,
    action_delegate: true,
    action_redelegate: true,
    action_undelegate: true,
    action_deposit: true,
    action_vote: true,
    action_proposal: true,
    default: true,
    stakingDenom: 'ATOM',
    enabled: true,
    icon: 'https://app.lunie.io/img/networks/cosmos-hub-mainnet.png',
    slug: 'cosmos-hub',
    powered: {
      name: 'Figment',
      providerAddress: 'cosmosvaloper1hjct6q7npsspsg3dgvzk3sdf89spmlpfdn6m9d',
      picture:
        'https://s3.amazonaws.com/keybase_processed_uploads/bd5fb87f241bd78a9c4bceaaa849ca05_360_360.jpg'
    }
  },
  {
    id: 'terra-mainnet',
    title: 'Terra',
    chain_id: 'columbus-3',
    api_url: 'https://fcd.terra.dev/',
    rpc_url: 'ws://52.78.43.42:26657/websocket',
    bech32_prefix: 'terra',
    address_prefix: 'terra',
    address_creator: 'cosmos',
    ledger_app: 'cosmos',
    network_type: 'cosmos',
    source_class_name: 'source/terraV3-source',
    block_listener_class_name: 'block-listeners/cosmos-node-subscription',
    testnet: false,
    feature_session: true,
    feature_explore: true,
    feature_portfolio: true,
    feature_validators: true,
    feature_proposals: true,
    feature_activity: true,
    feature_explorer: true,
    action_send: true,
    action_claim_rewards: true,
    action_delegate: true,
    action_redelegate: true,
    action_undelegate: true,
    action_deposit: false,
    action_vote: false,
    action_proposal: false,
    default: false,
    stakingDenom: 'LUNA',
    enabled: true,
    icon: 'https://app.lunie.io/img/networks/terra-mainnet.png',
    slug: 'terra'
  },
  {
    id: 'terra-testnet',
    title: 'Terra Testnet',
    chain_id: 'soju-0013',
    api_url: 'https://soju-fcd.terra.dev',
    rpc_url: 'wss://terra-testnet.lunie.io/websocket',
    bech32_prefix: 'terra',
    address_prefix: 'terra',
    address_creator: 'cosmos',
    ledger_app: 'cosmos',
    network_type: 'cosmos',
    source_class_name: 'source/terraV3-source',
    block_listener_class_name: 'block-listeners/cosmos-node-subscription',
    testnet: true,
    feature_session: true,
    feature_explore: true,
    feature_portfolio: true,
    feature_validators: true,
    feature_proposals: false,
    feature_activity: true,
    feature_explorer: true,
    action_send: true,
    action_claim_rewards: true,
    action_delegate: true,
    action_redelegate: true,
    action_undelegate: true,
    action_deposit: false,
    action_vote: false,
    action_proposal: false,
    default: false,
    stakingDenom: 'LUNA',
    enabled: true,
    icon: 'https://app.lunie.io/img/networks/terra-testnet.png',
    slug: 'terra-testnet'
  },
  {
    id: 'emoney-testnet',
    title: 'e-Money Testnet',
    chain_id: 'lilmermaid-5',
    api_url: 'http://lilmermaid.validator.network/light',
    rpc_url: 'wss://lilmermaid.validator.network/websocket',
    bech32_prefix: 'emoney',
    address_prefix: 'emoney',
    address_creator: 'cosmos',
    ledger_app: 'cosmos',
    network_type: 'cosmos',
    source_class_name: 'source/emoneyV0-source',
    block_listener_class_name: 'block-listeners/cosmos-node-subscription',
    testnet: true,
    feature_session: true,
    feature_explore: true,
    feature_portfolio: true,
    feature_validators: true,
    feature_proposals: false,
    feature_activity: true,
    feature_explorer: true,
    action_send: true,
    action_claim_rewards: true,
    action_delegate: true,
    action_redelegate: true,
    action_undelegate: true,
    action_deposit: false,
    action_vote: false,
    action_proposal: false,
    default: false,
    stakingDenom: 'NGM',
    enabled: false,
    icon: 'https://app.lunie.io/img/networks/emoney-testnet.png',
    slug: 'emoney-testnet'
  }
  // {
  //   id: 'polkadot-testnet',
  //   title: 'Kusama',
  //   chain_id: 'kusama-cc3',
  //   api_url: 'https://host-01.polkascan.io/kusama/api/v1/',
  //   rpc_url: 'wss://kusama-rpc.polkadot.io/',
  //   bech32_prefix: ' ',
  //   address_prefix: ' ',
  //   ledger_app: 'polkadot',
  //   address_creator: 'polkadot',
  //   network_type: 'polkadot',
  //   source_class_name: 'source/polkadotV0-source',
  //   block_listener_class_name: 'block-listeners/polkadot-node-subscription',
  //   testnet: true,
  //   feature_session: true,
  //   feature_explore: true,
  //   feature_portfolio: true,
  //   feature_validators: true,
  //   feature_proposals: false,
  //   feature_activity: false,
  //   feature_explorer: false,
  //   action_send: true,
  //   action_claim_rewards: false,
  //   action_delegate: true,
  //   action_redelegate: true,
  //   action_undelegate: true,
  //   action_deposit: false,
  //   action_vote: false,
  //   action_proposal: false,
  //   default: false,
  //   stakingDenom: 'KSM',
  //   enabled: true,
  //   icon: 'https://app.lunie.io/img/networks/polkadot-testnet.png',
  //   slug: 'kusama'
  // }
  // {
  //   id: 'livepeer-mainnet',
  //   title: 'Livepeer',
  //   chain_id: 'ethereum-1',
  //   api_url: 'https://livepeer-mainnet.lunie.io/',
  //   rpc_url: 'wss://livepeer-mainnet.lunie.io/websocket',
  //   bech32_prefix: '0x',
  //   address_prefix: '0x',
  //   address_creator: 'ethereum',
  //   ledger_app: 'ethereum',
  //   network_type: 'ethereum',
  //   source_class_name: 'source/livepeerV0-source',
  //   block_listener_class_name: 'block-listeners/livepeer-node-polling',
  //   testnet: false,
  //   feature_session: false,
  //   feature_explore: true,
  //   feature_portfolio: false,
  //   feature_validators: true,
  //   feature_proposals: false,
  //   feature_activity: false,
  //   feature_explorer: false,
  //   action_send: false,
  //   action_claim_rewards: false,
  //   action_delegate: false,
  //   action_redelegate: false,
  //   action_undelegate: false,
  //   action_deposit: false,
  //   action_vote: false,
  //   action_proposal: false,
  //   default: false,
  //   stakingDenom: 'LPT',
  //   enabled: false,
  //   icon: 'https://app.lunie.io/img/networks/livepeer-mainnet.png',
  //   slug: 'livepeer'
  // }
]
