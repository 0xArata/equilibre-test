import { useEffect } from 'react';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { CONTRACTS } from '@/config/company';
import { useVaraBalance } from './varaBalance';
import { useLockState } from './lockState';

export const useLockForm = () => {
  const balance = useVaraBalance();
  const { getBaseAsset } = useBaseAssetStore(state => ({
    getBaseAsset: state.actions.getBaseAsset,
  }));

  const GOV_TOKEN = getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS);

  const {
    lockAmount,
    setLockAmount,
    lockDuration,
    setLockDuration,
    expectedVeVara,
    setExpectedVeVara,
    lockAmountError,
    setLockAmountError,
    lockDurationError,
    setLockDurationError,
    selectedDuration,
    setSelectedDuration,
    selectedPercentage,
    setSelectedPercentage,
    calculateNewExpectedVeVara,
  } = useLockState();

  const validateAndSetLockAmount = (value: bigint) => {
    if (value >= BigInt(0)) {
      setLockAmount(value);
      setLockAmountError('');
    } else {
      setLockAmountError('Lock amount must be a positive value.');
    }
  };

  const handleLockDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    // Calculate the difference in days
    const differenceInDays = Math.ceil(
      (selectedDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Only validate and set the lock duration if the selected date is in the future
    if (differenceInDays >= 0) {
      validateAndSetLockDuration(differenceInDays);
    } else {
      setLockDurationError('Selected date must be in the future');
    }
  };

  const validateAndSetLockDuration = (value: number) => {
    if (value >= 0) {
      setLockDuration(value);
      setLockDurationError('');
    } else {
      setLockDurationError('Invalid lock duration');
    }
  };

  const handleLockAmountPercentage = (percentage: number) => {
    setSelectedPercentage(percentage);
    const amount = balance * percentage;
    validateAndSetLockAmount(BigInt(Math.floor(amount)));
  };

  const handleDurationBtnClick = (duration: number) => {
    setSelectedDuration(duration);
    validateAndSetLockDuration(duration);
  };

  useEffect(() => {
    if (lockAmount && lockDuration) {
      const newExpectedVeVara = calculateNewExpectedVeVara(
        lockAmount,
        lockDuration
      );
      setExpectedVeVara(newExpectedVeVara);
    }
  }, [lockAmount, lockDuration]);

  return {
    lockAmount,
    validateAndSetLockAmount,
    lockDuration,
    validateAndSetLockDuration,
    expectedVeVara,
    lockAmountError,
    lockDurationError,
    selectedDuration,
    setSelectedDuration,
    selectedPercentage,
    handleLockAmountPercentage,
    handleDurationBtnClick,
    handleLockDurationChange,
    GOV_TOKEN,
    balance,
  };
};
