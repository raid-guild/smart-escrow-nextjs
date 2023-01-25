import LexDAOLogo from '../assets/lex-dao.png';

import { INFURA_ID } from '../config';

export const IPFS_ENDPOINT = 'https://ipfs.infura.io';
export const BOX_ENDPOINT = 'https://ipfs.3box.io';

export const NETWORK_CONFIG = {
  RG_XDAI: '0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f'.toLowerCase(),
  RG_MULTISIG: '0x3C3692681cD1c0F42FA68A2521719Cc24CEc3AF3'.toLowerCase(),
  100: {
    SUBGRAPH: 'dan13ram/xdai-smart-invoices',
    INVOICE_FACTORY: '0x6e769470F6F8D99794e53C87Fd8254E5D4FeDb8B'.toLowerCase(),
    WRAPPED_NATIVE_TOKEN:
      '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d'.toLowerCase(),
    TOKENS: {
      WXDAI: {
        decimals: 18,
        address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d'.toLowerCase()
      },
      WETH: {
        decimals: 18,
        address: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1'.toLowerCase()
      }
    },
    RESOLVERS: {
      LexDAO: {
        address: '0x034CfED494EdCff96f0D7160dC2B55Cae5Ee69E1'.toLowerCase(),
        logoUrl: LexDAOLogo,
        termsUrl:
          'https://github.com/lexDAO/Arbitration/blob/master/rules/ToU.md#lexdao-resolver'
      }
    }
  },
  1: {
    SUBGRAPH: 'dan13ram/mainnet-smart-invoices',
    INVOICE_FACTORY: '0xD8D6216354551dC960A6d1aDd1E06581983c6694'.toLowerCase(),
    WRAPPED_NATIVE_TOKEN:
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'.toLowerCase(),
    TOKENS: {
      WETH: {
        decimals: 18,
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'.toLowerCase()
      },
      DAI: {
        decimals: 18,
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F'.toLowerCase()
      }
    },
    RESOLVERS: {
      LexDAO: {
        address: '0x01b92e2c0d06325089c6fd53c98a214f5c75b2ac'.toLowerCase(),
        logoUrl: LexDAOLogo,
        termsUrl:
          'https://github.com/lexDAO/Arbitration/blob/master/rules/ToU.md#lexdao-resolver'
      }
    }
  },
  4: {
    SUBGRAPH: 'dan13ram/rinkeby-smart-invoices',
    INVOICE_FACTORY: '0x003680b3C09699D0B16b01F4c00fBeF6692b1Dce'.toLowerCase(),
    WRAPPED_NATIVE_TOKEN:
      '0xc778417E063141139Fce010982780140Aa0cD5Ab'.toLowerCase(),
    TOKENS: {
      WETH: {
        decimals: 18,
        address: '0xc778417E063141139Fce010982780140Aa0cD5Ab'.toLowerCase()
      },
      DAI: {
        decimals: 18,
        address: '0x3af6b2f907f0c55f279e0ed65751984e6cdc4a42'.toLowerCase()
      },
      TEST: {
        decimals: 18,
        address: '0x982e00B16c313E979C0947b85230907Fce45d50e'.toLowerCase()
      }
    },
    RESOLVERS: {
      LexDAO: {
        address: '0x1206b51217271FC3ffCa57d0678121983ce0390E'.toLowerCase(),
        logoUrl: LexDAOLogo,
        termsUrl:
          'https://github.com/lexDAO/Arbitration/blob/master/rules/ToU.md#lexdao-resolver'
      }
    }
  }
};

export const explorerUrls = {
  1: 'https://etherscan.io',
  4: 'https://rinkeby.etherscan.io',
  42: 'https://kovan.etherscan.io',
  100: 'https://blockscout.com/poa/xdai'
};

export const chainIds = {
  xdai: 100,
  mainnet: 1,
  rinkeby: 4,
  kovan: 42
};

export const hexChainIds = {
  xdai: '0x64',
  mainnet: '0x1',
  rinkeby: '0x4',
  kovan: '0x2a'
};

export const networkLabels = {
  100: 'xDai',
  1: 'Ethereum',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Görli',
  42: 'Kovan',
  56: 'BSC',
  77: 'Sokol',
  137: 'Matic'
};

export const networkNames = {
  1: 'ETH Mainnet',
  4: 'Rinkeby Testnet',
  42: 'Kovan Testnet',
  100: 'xDai Chain'
};

export const rpcUrls = {
  1: `https://mainnet.infura.io/v3/${INFURA_ID}`,
  4: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
  42: `https://kovan.infura.io/v3/${INFURA_ID}`,
  100: 'https://rpc.gnosischain.com'
};

export const nativeSymbols = {
  1: 'ETH',
  4: 'ETH',
  42: 'ETH',
  100: 'XDAI'
};

export const wrappedNativeToken = {
  4: NETWORK_CONFIG[4].WRAPPED_NATIVE_TOKEN,
  100: NETWORK_CONFIG[100].WRAPPED_NATIVE_TOKEN,
  1: NETWORK_CONFIG[1].WRAPPED_NATIVE_TOKEN
};

export const tokenInfo = {
  4: NETWORK_CONFIG[4].TOKENS,
  100: NETWORK_CONFIG[100].TOKENS,
  1: NETWORK_CONFIG[1].TOKENS
};

export const spoilsPercent = 10;

export const INVOICE_VERSION = 'smart-escrow-v1';

export const RAIDGUILD_DAO_MIN_SHARES = 100;
