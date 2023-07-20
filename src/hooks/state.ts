
import { create } from 'zustand'

type State = {
    balance: string;
    amount: string;
    period: number;
    veAmount: string;
}

type Action = {
    updateBalance: (balance: State['balance']) => void;
    updateAmount: (amount: State['amount']) => void;
    updatePeriod: (period: State['period']) => void;
    updateVEAmount: (veAmount: State['veAmount']) => void;
}

export const useStore = create<State & Action>((set) => ({
    balance: '0.00',
    amount: '0.00',
    period: 0,
    veAmount: '0.00',
    updateBalance: (balance) => set(() => ({ balance: balance })),
    updateAmount: (amount) => set(() => ({ amount: amount })),
    updatePeriod: (period) => set(() => ({ period: period })),
    updateVEAmount: (veAmount) => set(() => ({ veAmount: veAmount }))
}))
