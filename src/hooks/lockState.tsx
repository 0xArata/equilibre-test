import { useState } from 'react';

export const useLockState = () => {
  const [lockAmount, setLockAmount] = useState<number | undefined>();
  const [lockDuration, setLockDuration] = useState<number | undefined>();
  const [expectedVeVara, setExpectedVeVara] = useState(0);

  const [lockAmountError, setLockAmountError] = useState('');
  const [lockDurationError, setLockDurationError] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null
  );

  const calculateNewExpectedVeVara = (
    lockAmount: number,
    lockDuration: number
  ) => {
    const lockDurationInYears = lockDuration / 365;
    return lockAmount * (lockDurationInYears / 4);
  };

  return {
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
  };
};
