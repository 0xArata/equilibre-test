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
import { FC } from 'react';
import { DurationBtn } from './components/duration';
import { StackItemContainer, StackTexts } from './components/stackLayout';
import Link from 'next/link';
import { useVaraBalance } from '../../hooks/varaBalance';
import { useLockState } from '@/hooks/lockState';
import { PercentageSelector } from './components/percentageSelector';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { CONTRACTS } from '@/config/company';

const Dashboard: FC = () => {
  const balance = useVaraBalance();
  const items = Object.values(DurationData);

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

  const handleLockAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = BigInt(event.target.value);
    if (val >= BigInt(0)) {
      setLockAmount(val);
      if (lockDuration) {
        const newExpectedVeVara = calculateNewExpectedVeVara(val, lockDuration);
        setExpectedVeVara(newExpectedVeVara);
      }
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
        const newExpectedVeVara = calculateNewExpectedVeVara(
          lockAmount,
          diffInDays
        );
        setExpectedVeVara(newExpectedVeVara);
      }
    } else {
      setLockDurationError('Invalid lock duration');
    }
  };

  const handleLockAmountPercentage = (percentage: number) => {
    setSelectedPercentage(percentage);
    const amount = balance * percentage;
    setLockAmount(BigInt(Math.floor(amount)));
    if (lockDuration) {
      const newExpectedVeVara = calculateNewExpectedVeVara(
        BigInt(Math.floor(amount)),
        lockDuration
      );
      setExpectedVeVara(newExpectedVeVara);
    }
  };

  // Function to handle duration button click
  const handleDurationBtnClick = (duration: number) => {
    setSelectedDuration(duration);
    setLockDuration(duration);
    if (lockAmount) {
      const newExpectedVeVara = calculateNewExpectedVeVara(
        lockAmount,
        duration
      );
      setExpectedVeVara(newExpectedVeVara);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Box
      display="flex"
      flexDir="column"
      padding={6}
      w={{ base: '24rem', md: '', lg: '33rem' }}
      h={{ lg: '37rem' }}
      border="1px solid"
      borderRadius="30px"
      background="linear-gradient(155deg, rgba(13, 20, 46, 0.20) 71.88%, rgba(205, 116, 204, 0.10) 100%)">
      <form onSubmit={handleSubmit}>
        <FormControl>
          <StackItemContainer>
            <Flex justifyContent="space-between">
              <Button as={Link} href="/">
                {'<'}
              </Button>
              <PercentageSelector
                selectedPercentage={selectedPercentage}
                handleLockAmountPercentage={handleLockAmountPercentage}
              />
            </Flex>
            <Box
              display="flex"
              flexDir="column"
              border="1px solid #273977"
              borderRadius="10px"
              backgroundColor="rgba(31, 46, 100, 0.50)"
              fontSize="1rem"
              padding={4}>
              <Text textAlign="end">Balance: {balance}</Text>
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
                    w={{ base: '11rem', lg: '20rem' }}
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
                  />
                  {lockAmountError && (
                    <Text color="red">{lockAmountError}</Text>
                  )}
                  <Text
                    color="grey"
                    fontSize="0.9rem"
                    w={{ base: '11rem', lg: '20rem' }}>
                    $
                    {GOV_TOKEN && lockAmount
                      ? (Number(lockAmount) * +GOV_TOKEN.price).toFixed(4)
                      : 0}
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
                    src={GOV_TOKEN?.logoURI}
                  />
                  {GOV_TOKEN?.symbol}
                </Box>
              </Flex>
            </Box>
            <Flex justifyContent="space-between" alignItems="center">
              <Text>Select Expiry Date: </Text>
              <Input
                type="date"
                w={{ lg: '17rem' }}
                h={{ lg: '3.6rem' }}
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
                <Text
                  fontFamily="littleText"
                  fontSize="15px"
                  letterSpacing="1.95px">
                  Your voting power will be
                </Text>
                <Text fontSize="15px" color="#70DD88" textAlign="right">
                  {expectedVeVara.toFixed(2)} veVARA
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Text
                  fontFamily="littleText"
                  fontSize="15px"
                  letterSpacing="1.95px">
                  Amount of days locked
                </Text>
                <Text fontSize="15px" color="#70DD88" textAlign="right">
                  {lockDuration ? lockDuration.toString() : '0'} days
                </Text>
              </Flex>
            </StackTexts>
            <Button
              fontSize={{ lg: '1.6rem' }}
              letterSpacing="3.25px"
              type="submit"
              w={{ base: '20rem', lg: '27rem' }}
              m="auto"
              py={6}
              mt={4}>
              <Text>Create New veNFT</Text>
            </Button>
          </StackItemContainer>
        </FormControl>
      </form>
    </Box>
  );
};

export default Dashboard;
