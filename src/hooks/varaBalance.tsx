import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { fetchBalance } from '@wagmi/core';
import { GOV_TOKEN_ADDRESS } from '@/config/company/contracts';

export const useVaraBalance = () => {
  // state for balance
  const [balance, setBalance] = useState(0);

  const { address, isConnected } = useAccount();

  const fetchBalanceHandler = async () => {
    if (isConnected && address) {
      try {
        const balance = await fetchBalance({
          address,
          token: GOV_TOKEN_ADDRESS,
        });

        setBalance(Number(balance.formatted));
      } catch (error) {
        console.error(error);
      }
    } else {
      setBalance(0); // reset balance to 0 when wallet is disconnected
    }
  };

  // Added "isConnected" and "address" to the dependencies array to fetch balance based on those dependencies
  useEffect(() => {
    fetchBalanceHandler();
  }, [isConnected, address]);

  return balance;
};
