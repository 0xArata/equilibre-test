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
import { FC, useState } from 'react';
import { DurationBtn } from './components/duration';
import { StackItemContainer, StackTexts } from './components/stackLayout';
import Link from 'next/link';
import { PercentageSelector } from './components/percentageSelector';
import { VE_TOKEN_ABI, VE_TOKEN_ADDRESS } from '@/config/company/contracts';
import { ethers } from 'ethers';
import { useLockForm } from '@/hooks/lockForm';
import { useToastMessages, useWeb3 } from '@/hooks/web3';
import { CONTRACTS } from '@/config/company';

const Dashboard: FC = () => {
  const items = Object.values(DurationData);
  const [isLoading, setIsLoading] = useState(false);
  const { signer } = useWeb3();
  const { showErrorToast, showSuccessToast } = useToastMessages();

  const {
    lockAmount,
    validateAndSetLockAmount,
    lockDuration,
    expectedVeVara,
    lockAmountError,
    lockDurationError,
    selectedDuration,
    selectedPercentage,
    handleLockAmountPercentage,
    handleDurationBtnClick,
    handleLockDurationChange,
    GOV_TOKEN,
    balance,
  } = useLockForm();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lockAmount || !lockDuration || lockAmount <= 0 || lockDuration <= 0) {
      showErrorToast({
        title: 'Invalid input',
        description: 'Please enter valid lock amount and future date',
      });
      return;
    }

    if (lockDurationError) {
      showErrorToast({
        title: 'Invalid input',
        description: lockDurationError,
      });
      return;
    }

    const decimals = 18; // replace this with the number of decimals in your token
    const amount = ethers.BigNumber.from(
      (lockAmount * Math.pow(10, decimals)).toFixed(0) // convert lockAmount to a whole number
    );
    const lockDurationNumber = Number(lockDuration) * 24 * 60 * 60;
    const balanceInWei = ethers.utils.parseUnits(balance.toString(), 'ether');

    if (amount.gt(balanceInWei) || amount.lte(ethers.constants.Zero)) {
      showErrorToast({
        title: 'Invalid input',
        description:
          'Please enter a value less than or equal to your balance and greater than zero',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create a new contract instance for the ERC20 token
      const tokenContract = new ethers.Contract(
        CONTRACTS.GOV_TOKEN_ADDRESS,
        CONTRACTS.GOV_TOKEN_ABI,
        signer
      );

      // Approve the VE token contract to spend `amount` of your ERC20 tokens
      const approveTx = await tokenContract.approve(VE_TOKEN_ADDRESS, amount);

      // Wait for the approve transaction to be mined
      await approveTx.wait();

      // Create a new contract instance for the VE token
      const veContract = new ethers.Contract(
        VE_TOKEN_ADDRESS,
        VE_TOKEN_ABI,
        signer
      );

      // Call the create_lock function
      const res2 = await veContract.create_lock(amount, lockDurationNumber);

      showSuccessToast({
        title: 'Lock created',
        description: `Lock created with tx hash: ${res2.transactionHash}`,
      });
    } catch (err) {
      showErrorToast({
        title: 'An error occurred',
        description: err.message,
      });
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
      borderColor="rgba(205, 116, 204, 1)
      rgba(255, 189, 89, 1)
      rgba(112, 221, 136, 1)"
      borderRadius="30px"
      background="linear-gradient(155deg, rgba(13, 20, 46, 0.20) 71.88%, rgba(205, 116, 204, 0.10) 100%)">
      <form onSubmit={handleSubmit}>
        <FormControl>
          <StackItemContainer>
            <Flex justifyContent="space-between">
              <Button
                as={Link}
                href="/"
                borderColor="rgba(205, 116, 204, 1)"
                w="2rem"
                h="2rem">
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
              <Text textAlign="end" fontSize="10px">
                Balance: {balance}
              </Text>
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
                    onChange={e =>
                      validateAndSetLockAmount(Number(e.target.value))
                    }
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
              mt={4}
              isLoading={isLoading}>
              <Text>Create New veNFT</Text>
            </Button>
          </StackItemContainer>
        </FormControl>
      </form>
    </Box>
  );
};

export default Dashboard;
