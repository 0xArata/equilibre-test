import {
  Card,
  CardHeader,
  CardBody,
  Text,
  Button,
  Image,
  HStack,
  IconButton,
  CardFooter,
  Divider,
  VStack,
  Input,
} from '@chakra-ui/react';

import { FiChevronLeft } from 'react-icons/fi';
import { ChangeEventHandler, useEffect, useState, useMemo } from 'react';
import { addDate, formatDate, getDaysDiff } from '@/utils/date';
import { lockDays, percents, votingPower } from '@/config/lock';
import { Duration } from 'date-fns';
import { useErc20BalanceOf, writeErc20 } from '@/lib/equilibre';
import callContractWait from '@/lib/callContractWait';
import { useAccount } from 'wagmi';
import { useLockStore } from '@/store/lockStore';
import {
  GOV_TOKEN_ADDRESS,
  VE_TOKEN_ABI,
  VE_TOKEN_ADDRESS,
} from '@/config/company/contracts';
import { ethers } from 'ethers';

const Lock = () => {
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const {
    price,
    amount,
    expiryDate,
    actions: { initLock, setAmount, setExpiryDate },
  } = useLockStore();

  const { address } = useAccount();
  const { data: balanceData } = useErc20BalanceOf({
    address: GOV_TOKEN_ADDRESS,
    args: [address!],
  });
  const balance = useMemo(() => {
    return Number(ethers.utils.formatUnits(balanceData || 0, 'ether'));
  }, [balanceData]);

  const days = useMemo(() => {
    return getDaysDiff(new Date(expiryDate), new Date()) + 1;
  }, [expiryDate]);

  useEffect(() => {
    initLock();
  }, []);

  const setPercentAmount = (percentage: number) => {
    setPercent(percentage);
    const updatedAmount = (balance * percentage) / 100;
    setAmount(updatedAmount);
  };

  const onChangeExpiryDate: ChangeEventHandler<HTMLInputElement> = e => {
    setExpiryDate(e.target.value);
  };

  const onSelectExpiryDate = (duration: Duration) => {
    const date = addDate(new Date(), duration);
    setExpiryDate(formatDate(date));
  };

  const onSubmit = async () => {
    const parsedAmount = ethers.utils.parseUnits(balance.toString(), 'ether');
    const seconds = BigInt(days * 86400);
    try {
      setLoading(true);
      await writeErc20({
        address: GOV_TOKEN_ADDRESS,
        functionName: 'approve',
        args: [VE_TOKEN_ADDRESS, BigInt(Number(parsedAmount))],
      });

      await callContractWait(
        {
          address: VE_TOKEN_ADDRESS,
          abi: VE_TOKEN_ABI,
          functionName: 'create_lock',
          args: [BigInt(Number(parsedAmount)), seconds],
        },
        {
          title: 'Create Lock',
          description: 'Create Lock successfully',
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <HStack justifyContent={'space-between'} width={'full'}>
          <IconButton
            size={'sm'}
            icon={<FiChevronLeft fontSize="1.25rem" />}
            aria-label="back"
          />
          <HStack spacing={2}>
            {percents.map(data => (
              <Button
                key={data}
                variant={'outline'}
                size={'sm'}
                isActive={percent === data}
                onClick={() => setPercentAmount(data)}>
                {data}%
              </Button>
            ))}
          </HStack>
        </HStack>
      </CardHeader>

      <CardBody>
        <VStack spacing="4">
          <HStack
            justifyContent={'space-between'}
            alignItems={'flex-end'}
            bg={'blue.500'}
            borderWidth={1}
            borderStyle={'solid'}
            borderColor={'blue.400'}
            borderRadius={'lg'}
            p={4}>
            <VStack alignItems={'flex-start'}>
              <Input
                size="xl"
                type="number"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                pl={0}
                variant="transparent"
                placeholder="0.00"
              />
              <Text color={'gray.500'}>${(price * amount).toFixed(2)}</Text>
            </VStack>
            <VStack alignItems={'flex-end'}>
              <Text fontSize={'xs'} mb={4}>
                Balance: {balance.toFixed(2)}
              </Text>
              <HStack
                borderRadius={30}
                borderWidth={1}
                borderStyle={'solid'}
                borderColor={'yellow.400'}
                px={4}
                py={1}>
                <Image w={8} objectFit="contain" src="/images/VARA.svg"></Image>
                <Text color={'yellow.500'}>VARA</Text>
              </HStack>
            </VStack>
          </HStack>
          <HStack width={'full'} justifyContent={'space-between'}>
            <Text flexWrap={'nowrap'}>Select Expiry Date:</Text>
            <Input
              value={expiryDate}
              type={'date'}
              width={'50%'}
              onChange={onChangeExpiryDate}
            />
          </HStack>
          <HStack width={'full'} justifyContent={'space-between'}>
            {lockDays.map(data => (
              <Button
                key={data.name}
                variant={'outline'}
                size={'sm'}
                onClick={() => onSelectExpiryDate(data.duration)}
                isActive={
                  expiryDate === formatDate(addDate(new Date(), data.duration))
                }>
                {data.name}
              </Button>
            ))}
          </HStack>
        </VStack>
      </CardBody>
      <CardFooter>
        <VStack width={'full'} spacing={4}>
          <Divider />
          <HStack width={'full'} justifyContent={'space-between'}>
            <Text color={'gray.500'}>Your votingpower will be</Text>
            <Text color={'green.500'}>
              {((amount * days) / votingPower).toFixed(2)} veVARA
            </Text>
          </HStack>
          <HStack width={'full'} justifyContent={'space-between'}>
            <Text color={'gray.500'}>Amount of days locked</Text>
            <Text color={'green.500'}>{days}</Text>
          </HStack>
          <Button
            width={'full'}
            variant={'primary'}
            onClick={onSubmit}
            isLoading={loading}>
            Create New veNFT
          </Button>
        </VStack>
      </CardFooter>
    </Card>
  );
};

export default Lock;
