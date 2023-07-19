import { COINGECKO_URL, defaultExpiryDate } from '@/config/lock';
import axios from 'axios';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

interface LockState {
  amount: number;
  price: number;
  expiryDate: string;
  isLoading: boolean,
  actions: {
    initLock: () => Promise<void>;
    setExpiryDate: (date: string) => void;
    setAmount: (amount: number) => void;
  };
}

export const useLockStore = create<LockState>(set => ({
  amount: 0,
  price: 0,
  expiryDate: defaultExpiryDate,
  isLoading: false,
  actions: {
    initLock: async () => {
      set({ isLoading: true });
      await axios
        .get(COINGECKO_URL.concat('/price?ids=equilibre&vs_currencies=usd'))
        .then(response => {
          let price = response.data;
          set({ price: response?.data?.equilibre?.usd })
        })
        .catch(error => console.log(error));
      set({ isLoading: false });
    },
    setAmount: (amount: number) => set({ amount }),
    setExpiryDate: (date: string) => set({ expiryDate: date })
  },
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('lock', useLockStore);
}
