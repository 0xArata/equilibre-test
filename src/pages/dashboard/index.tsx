import { DurationData } from '@/utils/data';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Input,
  Text,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { DurationBtn } from './duration';
import {
  useAccount,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { TypeWallet } from './type';
import {
  GOV_TOKEN_LOGO,
  GOV_TOKEN_SYMBOL,
  VE_TOKEN_ABI,
  VE_TOKEN_ADDRESS,
} from '@/config/company/contracts';
import { StackItemContainer, StackTexts } from './StackLayout';
import Link from 'next/link';

const Dashboard: FC = () => {
  // State for user's input
  const [lockAmount, setLockAmount] = useState<bigint | undefined>();
  const [lockDuration, setLockDuration] = useState<number | undefined>();

  // state for balance and locking
  const [balance, setBalance] = useState(0);
  const [lockAmountError, setLockAmountError] = useState('');
  const [lockDurationError, setLockDurationError] = useState('');

  // State for expected veVARA
  const [expectedVeVara, setExpectedVeVara] = useState(0);

  // State to track error
  const [error, setError] = useState<string | null>(null);

  // State to track the currently selected duration
  const [selectedDuration, setSelectedDuration] = useState<
    number | undefined
  >();

  const { address } = useAccount();

  const {
    data: balanceData,
    isIdle,
    isLoading: isBalanceLoading,
  }: TypeWallet = useBalance({
    address,
  });

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: VE_TOKEN_ADDRESS,
    abi: VE_TOKEN_ABI,
    functionName: 'create_lock',
    args: [lockAmount, lockDuration],
    enabled: Boolean(lockAmount) && Boolean(lockDuration),
  });

  const {
    data,
    error: writeError,
    isError: isWriteError,
    write,
  } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (balanceData) {
      setBalance(Number(balanceData.value));
    }
  }, [balanceData]);

  useEffect(() => {
    if (lockAmount && lockDuration) {
      const lockDurationInYears = lockDuration / 365;
      const newExpectedVeVara = Number(lockAmount) * (lockDurationInYears / 4);
      setExpectedVeVara(newExpectedVeVara);
    }
  }, [lockAmount, lockDuration]);

  const items = Object.values(DurationData);

  const handleLockAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = BigInt(event.target.value);
    if (val >= BigInt(0)) {
      setLockAmountError('');
      setLockAmount(val);
    } else {
      setLockAmountError('Invalid lock amount');
    }
  };

  const handleLockDurationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();
    const diffInMilliseconds = Math.abs(
      selectedDate.getTime() - currentDate.getTime()
    );
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
    if (diffInDays >= 0) {
      setLockDurationError('');
      setLockDuration(diffInDays);
      if (lockAmount) {
        const lockDurationInYears = diffInDays / 365;
        const newExpectedVeVara =
          Number(lockAmount) * (lockDurationInYears / 4);
        setExpectedVeVara(newExpectedVeVara);
      }
    } else {
      setLockDurationError('Invalid lock duration');
    }
  };

  const handleLockAmountPercentage = (percentage: number) => {
    const amount = balance * (percentage / 100);
    setLockAmount(BigInt(Math.floor(amount)));
    if (lockDuration) {
      const lockDurationInYears = lockDuration / 365;
      const newExpectedVeVara = amount * (lockDurationInYears / 4);
      setExpectedVeVara(newExpectedVeVara);
    }
  };

  // Function to handle duration button click
  const handleDurationBtnClick = (duration: number) => {
    setLockDuration(duration);
    setSelectedDuration(duration);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (lockAmountError || lockDurationError) {
      return;
    }
    if (!lockAmount || lockAmount < BigInt(0)) {
      setError('Invalid lock amount');
      return;
    }

    if (write) {
      try {
        // Calling the contract write function to create a new lock and trigger the newNFT
        await write();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDir="column"
      padding={6}
      w={{ base: '24rem', md: '', lg: '30rem' }}
      border="1px solid"
      borderRadius="15px">
      <form onSubmit={handleSubmit}>
        <FormControl>
          <StackItemContainer>
            <Flex justifyContent="space-between">
              <Button as={Link} href="/">
                {'<'}
              </Button>
              <Flex justifyContent="space-between" w="13rem">
                {[25, 50, 75, 100].map((percentage, i) => (
                  <Button
                    key={i}
                    w="2rem"
                    h="2rem"
                    fontSize="0.7rem"
                    onClick={() => handleLockAmountPercentage(percentage)}>
                    {percentage}%
                  </Button>
                ))}
              </Flex>
            </Flex>
            <Box
              display="flex"
              flexDir="column"
              border="0.5px"
              borderRadius="15px"
              borderColor="blue.200"
              backgroundColor="blue.500"
              fontSize="1rem"
              padding={4}>
              <Text textAlign="end">Balance: {balanceData?.formatted}</Text>
              <Flex justifyContent="space-between" alignItems="center">
                <Flex flexDir="column">
                  <Input
                    border="none"
                    appearance="none"
                    boxShadow="none"
                    bg="transparent"
                    outline="none"
                    type="number"
                    textAlign="left"
                    placeholder="0.0"
                    fontSize={{ base: '1.7rem', md: '', lg: '1.5rem' }}
                    padding="0"
                    sx={{
                      '::placeholder': {
                        color: 'white',
                        fontWeight: 'bold',
                      },
                    }}
                    value={lockAmount ? lockAmount.toString() : ''}
                    onChange={e => handleLockAmountChange(e)}
                    disabled={isLoading || isIdle || Boolean(lockAmountError)}
                  />
                  {lockAmountError && (
                    <Text color="red">{lockAmountError}</Text>
                  )}
                  <Text color="grey" fontSize="1rem">
                    ${0.0}
                  </Text>
                </Flex>
                <Box
                  display="flex"
                  justifySelf="flex-end"
                  border="1px solid orange"
                  borderRadius="20px"
                  h={{ base: '2.5rem', md: '2.7rem', lg: '3rem' }}
                  w="7rem"
                  justifyContent="space-evenly"
                  alignItems="center">
                  <Avatar
                    border="1px solid orange"
                    size="sm"
                    src={GOV_TOKEN_LOGO}
                  />
                  {GOV_TOKEN_SYMBOL}
                </Box>
              </Flex>
            </Box>
            <Flex justifyContent="space-between" alignItems="center">
              <Text>Select Expiry Date: </Text>
              <Input
                type="date"
                w={{ lg: '12rem' }}
                onChange={handleLockDurationChange}
              />
              {lockDurationError && (
                <Text color="red">{lockDurationError}</Text>
              )}
            </Flex>
            <Flex justifyContent="space-between" gap={4}>
              {items.map((item, i) => {
                return (
                  <DurationBtn
                    data={item}
                    isSelected={item._value === selectedDuration}
                    key={i}
                    onClick={() => handleDurationBtnClick(item._value)}
                  />
                );
              })}
            </Flex>
            <Divider />
            <StackTexts>
              <Flex justifyContent="space-between" alignItems="center">
                <Text>Your voting power will be</Text>
                <Text>{expectedVeVara} veVARA</Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Text>Amount of days locked</Text>
                <Text>{lockDuration ? lockDuration.toString() : '0'} days</Text>
              </Flex>
            </StackTexts>
            <Button
              type="submit"
              w={{ base: '20rem', lg: '27rem' }}
              m="auto"
              mt={4}>
              Create New veNFT
            </Button>
          </StackItemContainer>
        </FormControl>
        {error && <Text>{error}</Text>}
      </form>
    </Box>
  );
};

export default Dashboard;
