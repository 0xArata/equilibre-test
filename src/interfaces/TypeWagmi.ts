export interface TypeWallet {
  data?: {
    decimals: number;
    formatted: string;
    symbol: string;
    value: bigint;
  };
  isIdle: boolean
  isLoading: boolean
}
