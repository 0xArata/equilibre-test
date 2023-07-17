import {
  bribeABI,
  erc20ABI,
  factoryABI,
  gaugeABI,
  pairABI,
  routerABI,
  solidlyLibraryABI,
  splitterABI,
  tokenABI,
  veDistABI,
  veTokenABI,
  voterABI,
  wftmABI,
  wrappedBribeFactoryABI,
} from './abis';

export const GOV_TOKEN_ADDRESS = '0xE1da44C0dA55B075aE8E2e4b6986AdC76Ac77d73';
export const GOV_TOKEN_NAME = 'Vara';
export const GOV_TOKEN_SYMBOL = 'VARA';
export const GOV_TOKEN_DECIMALS = 18;
export const GOV_TOKEN_LOGO = 'https://github.com/equilibre-finance.png';
export const GOV_TOKEN_ABI = tokenABI;

//VotingEscrow
export const VE_TOKEN_ADDRESS = '0x35361C9c2a324F5FB8f3aed2d7bA91CE1410893A';
export const VE_TOKEN_NAME = 'veVARA';
export const VE_TOKEN_SYMBOL = 'veVARA';
export const VE_TOKEN_DECIMALS = 18;
export const VE_TOKEN_LOGO = 'https://github.com/equilibre-finance.png';
export const VE_TOKEN_ABI = veTokenABI;

export const WKAVA_ADDRESS = '0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b';
export const WKAVA_NAME = 'Wrapped Kava';
export const WKAVA_SYMBOL = 'wKAVA';
export const WKAVA_DECIMALS = 18;
export const KAVA_LOGO =
  'https://assets.coingecko.com/coins/images/9761/large/kava.png';
export const WKAVA_ABI = wftmABI;

export const KAVA_ADDRESS = 'KAVA';
export const KAVA_NAME = 'Kava';
export const KAVA_SYMBOL = 'KAVA';
export const KAVA_DECIMALS = 18;
export const WKAVA_LOGO =
  'https://assets.coingecko.com/coins/images/9761/large/kava.png';

// PairFactory
export const FACTORY_ADDRESS = '0xA138FAFc30f6Ec6980aAd22656F2F11C38B56a95';
export const FACTORY_ABI = factoryABI;
// Classic Router
export const ROUTER_ADDRESS = '0xA7544C409d772944017BB95B99484B6E0d7B6388';
export const ROUTER_ABI = routerABI;
//RewardsDistributor
export const VE_DIST_ADDRESS = '0x8825be873e6578F1703628281600d5887C41C55A';
export const VE_DIST_ABI = veDistABI;

export const VOTER_ADDRESS = '0x4eB2B9768da9Ea26E3aBe605c9040bC12F236a59';
export const VOTER_ABI = voterABI;

export const LIBRARY_ADDRESS = '0xFDEd8097db44B6cE7d5a2c9228f2A9f46ad66fb8';
export const LIBRARY_ABI = solidlyLibraryABI;

export const WRAPPED_EXTERNAL_BRIBE_FACTORY_ADDRESS =
  '0x8af2f4Ae1DA95556fC1DaC3A74Cbf2E05e7006ab';
export const VE_SPLITTER_ADDRESS = '0xe0c0183cFc43deF9dC302E1662964c06e8023Bde';

export const ERC20_ABI = erc20ABI;
export const PAIR_ABI = pairABI;
export const GAUGE_ABI = gaugeABI;
export const BRIBE_ABI = bribeABI;
export const TOKEN_ABI = tokenABI;
export const WRAPPED_EXTERNAL_BRIBE_FACTORY_ABI = wrappedBribeFactoryABI;
export const VE_SPLITTER_ABI = splitterABI;

export const MULTICALL_ADDRESS = '0x7ED7bBd8C454a1B0D9EdD939c45a81A03c20131C';
export const OPENOCEAN_ADDRESS = '0x6352a56caadC4F1E25CD6c75970Fa768A3304e64';
