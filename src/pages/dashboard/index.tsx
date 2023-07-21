import { DurationData, PercentageData } from '@/utils/data';
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
import { FC, useState } from 'react';
import { DurationBtn } from './components/duration';
import { GOV_TOKEN_LOGO, GOV_TOKEN_SYMBOL } from '@/config/company/contracts';
import { StackItemContainer, StackTexts } from './components/stackLayout';
import Link from 'next/link';
import { PercentageBtns } from './components/percentage';
import { useVaraBalance } from '../../hooks/varaBalance';

const Dashboard: FC = () => {
  // State for user's input
  const [lockAmount, setLockAmount] = useState<bigint | undefined>();
  const [lockDuration, setLockDuration] = useState<number | undefined>();

  const [lockAmountError, setLockAmountError] = useState('');
  const [lockDurationError, setLockDurationError] = useState('');

  // State for expected veVARA
  const [expectedVeVara, setExpectedVeVara] = useState(0);

  // State to track error
  const [error, setError] = useState<string | null>(null);

  // State to track the currently selected duration and percentage
  const [selectedDuration, setSelectedDuration] = useState<
    number | undefined
  >();
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null
  );

  const balance = useVaraBalance();
  const items = Object.values(DurationData);
  const percent = Object.values(PercentageData);

  const handleLockAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = BigInt(event.target.value);
    if (val >= BigInt(0)) {
      setLockAmountError('');
      setLockAmount(val);
      if (lockDuration) {
        const lockDurationInYears = lockDuration / 365;
        const newExpectedVeVara = Number(val) * (lockDurationInYears / 4);
        setExpectedVeVara(newExpectedVeVara);
      }
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
    // Store the selected percentage
    setSelectedPercentage(percentage);
    const amount = balance * percentage;
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

    if (lockAmount) {
      const lockDurationInYears = duration / 365;
      const newExpectedVeVara = Number(lockAmount) * (lockDurationInYears / 4);
      setExpectedVeVara(newExpectedVeVara);
    }
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
              <Flex justifyContent="space-between" w="15rem">
                {percent.map((item, i) => {
                  return (
                    <PercentageBtns
                      data={item}
                      key={i}
                      isSelected={item._value === selectedPercentage}
                      onClick={() => handleLockAmountPercentage(item._value)}
                    />
                  );
                })}
              </Flex>
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
                  <Text color="grey" fontSize="0.9rem">
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
                <Text fontSize="15px" color="#70DD88">
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
                <Text fontSize="15px" color="#70DD88">
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
