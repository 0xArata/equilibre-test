import { CONTRACTS } from '@/config/company';
import { Token, VeNFT } from '@/interfaces';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

interface VeTokenState {
  veToken: Token;
  veNFTs: Array<VeNFT>;
  actions: {
    setVeNFTs: (x: Array<VeNFT>) => void;
  };
}

export const useVeTokenStore = create<VeTokenState>(set => ({
  veToken: <Token>{
    address: CONTRACTS.VE_TOKEN_ADDRESS,
    name: CONTRACTS.VE_TOKEN_NAME,
    symbol: CONTRACTS.VE_TOKEN_SYMBOL,
    decimals: CONTRACTS.VE_TOKEN_DECIMALS,
    logoURI: CONTRACTS.VE_TOKEN_LOGO,
    stable: false,
    price: 0,
    liquidStakedAddress: '',
    balance: 0,
  },
  veNFTs: [],
  actions: {
    setVeNFTs: (x: Array<VeNFT>) => set({ veNFTs: x }),
  },
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('veToken', useVeTokenStore);
}
