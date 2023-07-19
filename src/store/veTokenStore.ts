import { CONTRACTS } from '@/config/company';
import { Token, VeNFT } from '@/interfaces';
import callContractWait from '@/lib/callContractWait';
import { readErc20, useVeTokenCreateLock, veTokenABI, veTokenAddress, writeErc20 } from '@/lib/equilibre';
import { ethers } from 'ethers';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

interface VeTokenState {
  veToken: Token;
  veNFTs: Array<VeNFT>;
  isLoading: boolean;
  balance: number;
  lockAmount: number;
  lockPeriod: number;
  veVaraAmount: number;
  actions: {
    setVeNFTs: (x: Array<VeNFT>) => void;
    getGovTokenBalance: (address: `0x${string}`) => void;
    calculateVeVARA: () => void;
    setLockAmount: (lockAmount: number) => void;
    setLockPeriod: (lockPeriod: number) => void;
    createLock: (lockAmount: number, lockPeriod: number) => Promise<void>
  };
}

export const useVeTokenStore = create<VeTokenState>(set => ({
  veToken: <Token> {
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
  balance: 0,
  isLoading: false,
  lockAmount: 0,
  lockPeriod: 0,
  veVaraAmount: 0,
  actions: {
    setVeNFTs: (x: Array<VeNFT>) => set({ veNFTs: x }),
    getGovTokenBalance: async (address: `0x${string}`) => {
      set({ isLoading: true });
      try {
        const balance = await readErc20({
          address: CONTRACTS.GOV_TOKEN_ADDRESS,
          functionName: "balanceOf",
          args: [address]
        })
        set({ balance: Number(balance) / 10 ** 18 })
        set({ isLoading: false });
      } catch (error) {
        console.log(error);
        set({ isLoading: false });
      }
    },
    setLockAmount: (lockAmount: number) => {
      set({ lockAmount })
    },
    setLockPeriod: (lockPeriod: number) => {
      set({ lockPeriod })
    },
    calculateVeVARA: () => set((state) => ({ veVaraAmount: (state.lockAmount * state.lockPeriod) / 1460 }))
    ,
    createLock: async (lockAmount: number, lockPeriod: number) => {
      const value = ethers.utils.parseUnits(lockAmount.toString(), "ether")
      const duration = lockPeriod * 24 * 60 * 60
      try {
        await writeErc20({
          address: CONTRACTS.GOV_TOKEN_ADDRESS,
          functionName: "approve",
          args: [CONTRACTS.VE_TOKEN_ADDRESS, (value as unknown as bigint)]
        })

        await callContractWait({
          address: CONTRACTS.VE_TOKEN_ADDRESS,
          abi: veTokenABI,
          functionName: "create_lock",
          args: [value, duration]
        }, {
          title: "Create Lock",
          description: "Create Lock successfully"
        })

      } catch (error) {
        console.log(error);

      }
    }
  },
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('veToken', useVeTokenStore);
}
