import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  SimpleGrid,
  Text,
  Flex,
  Image,
} from '@chakra-ui/react';
import { getColor } from '@chakra-ui/theme-tools';
import { theme as defaultTheme } from '@chakra-ui/theme';
import moment from 'moment';
import { useAccount } from 'wagmi';

import { CONSTANTS_VEVARA } from '@/config/constants';
import { ILockDuration, IInputPercentage, Token } from '@/interfaces';
import generateToast from '@/components/toast/generateToast';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { GOV_TOKEN_ADDRESS } from '@/config/company/contracts';
import { getBalanceInEther, getBalanceInWei } from '@/utils/formatBalance';
import { useVaraTokenStore } from '@/store/varaTokenStore';
import { CONTRACTS } from '@/config/company';
import callContractWait from '@/lib/callContractWait';

const { VALUE_PRECENTAGES, LOCK_DURATIONS } = CONSTANTS_VEVARA;

const Dashboard = () => {
  const [lockAmount, setLockAmount] = useState<string>('');
  const [unlockDate, setUnlockDate] = useState<string>();
  const [varaPrice, setVaraPrice] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<string>('');

  const { address } = useAccount();
  const { baseAssets, getBaseAsset } = useBaseAssetStore(state => ({
    baseAssets: state.baseAssets,
    getBaseAsset: state.actions.getBaseAsset,
  }));
  const {
    balance: userVaraBalanceInWei,
    allowance,
    fetBalanceAndAllowance,
  } = useVaraTokenStore(state => ({
    balance: state.balance,
    allowance: state.veVaraAllowance,
    fetBalanceAndAllowance: state.actions.fetBalanceAndAllowance,
  }));

  const userVaraBalance = getBalanceInEther(userVaraBalanceInWei);
  const lockDuration = moment.duration(moment(unlockDate).diff(moment()));
  const lockDays = Math.floor(lockDuration.asDays());
  const votingPower = (Number(lockAmount) * (lockDays + 1)) / (4 * 365);
  const lockAmountInWei = getBalanceInWei(lockAmount || '0');

  useEffect(() => {
    onSelectLockDuration(LOCK_DURATIONS[3]);
  }, []);

  useEffect(() => {
    const varaAsset: Token | undefined = getBaseAsset(GOV_TOKEN_ADDRESS);
    if (varaAsset) {
      setVaraPrice(Number(varaAsset?.price) || 0);
    }
  }, [baseAssets.length]);

  useEffect(() => {
    setAmountError(
      lockAmountInWei.gt(userVaraBalanceInWei)
        ? 'Greater than your available balance'
        : ''
    );
  }, [lockAmount]);

  // select vaule percentage
  const onSelectValuePercentage = (newValuePercentage: IInputPercentage) => {
    const newLockAmount = (userVaraBalance * newValuePercentage.value) / 100;
    if (Number(newLockAmount) !== Number(lockAmount)) {
      setLockAmount(String(newLockAmount));
    }
  };

  // select lock duration
  const onSelectLockDuration = (newLockDuration: ILockDuration) => {
    const newUnlockDate = moment()
      .add(newLockDuration.value, 'days')
      .format('YYYY-MM-DD');

    if (newUnlockDate !== unlockDate) {
      setUnlockDate(newUnlockDate);
    }
  };

  // change lock amount
  const onChangeLockAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLockAmount = e.target.value;
    if (Number(newLockAmount) < 0) return;

    setLockAmount(newLockAmount);
  };

  // change unlock date
  const onChangeUnLockDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (new Date(selectedDate).valueOf() < new Date().valueOf()) {
      generateToast(
        'Date Invalid',
        `It's not allowed to select previous date.`,
        'error'
      );
      return;
    }

    setUnlockDate(selectedDate);
  };

  // lock vara to get veVARA
  const onLockVara = async () => {
    if (!!amountError) return;

    if (allowance.lt(lockAmountInWei)) {
      // 1. implement approve logic
      setLoading(true);

      const txObj = {
        address: CONTRACTS.GOV_TOKEN_ADDRESS,
        abi: CONTRACTS.GOV_TOKEN_ABI,
        functionName: 'approve',
        args: [CONTRACTS.VE_TOKEN_ADDRESS, lockAmountInWei],
      };
      const toastObj = {
        title: 'Approve',
        description: 'Vara Token approved',
      };
      const result = await callContractWait(txObj, toastObj);

      if (result) {
        await fetBalanceAndAllowance(address);
      }

      setLoading(false);
    } else {
      // 2. implement 'create_lock' logic
      setLoading(true);

      const txObj = {
        address: CONTRACTS.VE_TOKEN_ADDRESS,
        abi: CONTRACTS.VE_TOKEN_ABI,
        functionName: 'create_lock',
        args: [lockAmountInWei, Math.floor(lockDuration.asSeconds())],
      };
      const toastObj = {
        title: 'Mint VeVara',
        description: 'New VeVara minted',
      };
      const result = await callContractWait(txObj, toastObj);

      if (result) {
        await fetBalanceAndAllowance(address);
      }

      setLoading(false);
    }
    setLockAmount('');
  };

  return (
    <Box
      background={
        'linear-gradient(156.7deg, #0D142E 4.67%, #1F2E64 53.14%, #924C91 126.09%) padding-box, linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box;'
      }
      w={'100%'}
      minW={'350px'}
      maxW={'528px'}
      padding={'25px 26px'}
      borderRadius={'30px'}
      border={'1px solid transparent'}
      letterSpacing={'1.95px'}>
      {/* value input section */}
      <Box>
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          mb={'19px'}>
          <Box>
            <Button colorScheme="pink" variant={'outlineSelected'}>
              {`<`}
            </Button>
          </Box>
          <Flex gap={'7px'}>
            {VALUE_PRECENTAGES.map((row: IInputPercentage) => {
              return (
                <Button
                  key={row.value}
                  isActive={
                    lockAmount === String((userVaraBalance * row.value) / 100)
                  }
                  colorScheme="yellow"
                  variant={'outline'}
                  minW={'50px'}
                  px={'4px'}
                  onClick={() => {
                    onSelectValuePercentage(row);
                  }}>
                  {row.label}
                </Button>
              );
            })}
          </Flex>
        </Flex>
        <Box
          border="1px solid #273977"
          borderRadius="10px"
          background="rgba(31, 46, 100, 0.50)"
          padding="22px 20px">
          <Flex justifyContent="end">
            <Text fontSize="10px" letterSpacing="1.3px">
              {`Balance: ${userVaraBalance.toFixed(2)}`}
            </Text>
          </Flex>
          <Flex justifyContent={'space-between'} alignItems={'center'} mt="8px">
            <Box>
              <Input
                isInvalid={lockAmountInWei.gt(userVaraBalanceInWei)}
                type="number"
                variant={'flushed'}
                placeholder="0.00"
                textAlign="left"
                borderBottomWidth="0px"
                fontSize="25px"
                letterSpacing="3.25px"
                min={0}
                value={lockAmount}
                onChange={onChangeLockAmount}
              />
              <Text
                letterSpacing="1.3px"
                color="purple.300"
                fontWeight="500"
                fontSize="10px"
                mt="4px">
                {amountError}
              </Text>
              <Text
                letterSpacing="1.3px"
                color="rgba(255, 255, 255, 0.50)"
                mt="4px">
                {`$${(Number(lockAmount) * varaPrice).toFixed(2)}`}
              </Text>
            </Box>
            <Flex
              gap="11px"
              border={`1px solid ${getColor(
                defaultTheme,
                'yellow.500',
                'yellow'
              )}`}
              borderRadius="20px"
              padding="6px 19px 6px 8px"
              alignItems="center">
              <Image w="28px" src="/images/VARA.svg" />
              <Text color="yellow.500">VARA</Text>
            </Flex>
          </Flex>
        </Box>
      </Box>

      {/* lock duration input section */}
      <Box mt={30} mb={34}>
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={'10px 30px'}
          flexWrap="wrap">
          <Text
            fontSize={15}
            lineHeight={'normal'}
            fontWeight={300}
            whiteSpace={'nowrap'}>
            Select Expiry Date:
          </Text>
          <Input
            type="date"
            placeholder="DD/MM/YYYY"
            fontSize={'30px'}
            height={'58px'}
            padding={'12px 19px 14px 18px'}
            minWidth={'210px'}
            value={unlockDate}
            onChange={onChangeUnLockDate}
            flex={1}
          />
        </Flex>
        <SimpleGrid columns={[2, 4]} mt={'34px'} spacing={18}>
          {LOCK_DURATIONS.map((row: ILockDuration) => {
            return (
              <Button
                key={row.value}
                isActive={row.value === lockDays + 1}
                colorScheme="yellow"
                variant={'outline'}
                w={'100%'}
                px="4px"
                minWidth={'fit-content'}
                onClick={() => {
                  onSelectLockDuration(row);
                }}>
                {row.label}
              </Button>
            );
          })}
        </SimpleGrid>
      </Box>

      {/* your veVara info */}
      <Flex
        fontSize={15}
        pt={35}
        py={35}
        borderTop={'1px solid rgba(255, 255, 255, 0.50)'}
        flexDirection={'column'}
        gap={'17px'}>
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          flexDirection={['column', 'row']}>
          <Text fontFamily={'Arista'} fontWeight={300}>
            Your voting power will be
          </Text>
          <Text color="green.500" textAlign={'end'}>
            {`${votingPower.toFixed(2)} veVARA`}
          </Text>
        </Flex>
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          flexDirection={['column', 'row']}>
          <Text fontFamily={'Arista'} fontWeight={300}>
            Amount of days locked
          </Text>
          <Text color="green.500" textAlign={'end'}>
            {lockDays}
          </Text>
        </Flex>
      </Flex>
      {/* veVera mint button */}
      <Box>
        <Button
          colorScheme="yellow"
          w={'100%'}
          fontSize={25}
          fontWeight={400}
          py={'12px'}
          h={58}
          onClick={onLockVara}
          isLoading={isLoading}
          loadingText={allowance.lt(lockAmountInWei) ? 'Approve' : 'Mint'}
          isDisabled={!!amountError}>
          Create New veNFT
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
