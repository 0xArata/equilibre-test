import { CONTRACTS } from '@/config/company';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { useVeTokenStore } from '@/store/veTokenStore';
import {
  Box,
  Flex,
  Text,
  Image,
  Spinner,
  Input,
  useMediaQuery,
} from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';

const DashboardOverview = () => {
  const [isMobile] = useMediaQuery('(max-width: 600px)');

  const { balance, isLoading, lockAmount, setLockAmount } = useVeTokenStore(
    state => ({
      balance: state.balance,
      isLoading: state.isLoading,
      lockAmount: state.lockAmount,
      getGovTokenBalance: state.actions.getGovTokenBalance,
      setLockAmount: state.actions.setLockAmount,
    })
  );
  const { getBaseAsset } = useBaseAssetStore(state => ({
    getBaseAsset: state.actions.getBaseAsset,
  }));

  const GOV_TOKEN = getBaseAsset(CONTRACTS.GOV_TOKEN_ADDRESS);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (+event.target.value > balance) {
      return;
    }
    setLockAmount(+event.target.value);
  }

  return (
    <Box
      w={isMobile ? 'full' : 475}
      h={140}
      border={'1px solid #273977'}
      background={'rgba(31, 46, 100, 0.50);'}
      borderRadius={'10px'}
      marginTop={'19px'}
      pt={'22px'}
      pr={'19px'}
      pb={'20px'}
      pl={'21px'}>
      <Text fontSize={10} textAlign={'right'}>
        {isLoading ? <Spinner /> : `Balance : ${balance}`}
      </Text>

      <Flex mt={15} justifyContent={'space-between'} alignItems={'flex-end'}>
        <Box display={'flex'} flexDir={'column'}>
          <Input
            variant={'unstyled'}
            outline={'none'}
            placeholder={'0.00'}
            textAlign={'left'}
            fontSize={25}
            color={'#fff'}
            value={lockAmount.toString()}
            type="number"
            onChange={event => handleChange(event)}
          />
          <Text color={'#ffffff80'} lineHeight={'16px'} letterSpacing={1.95}>
            $
            {GOV_TOKEN && lockAmount
              ? (lockAmount * +GOV_TOKEN.price).toFixed(4)
              : 0}
          </Text>
        </Box>

        <Box color={'FFBD59'} borderRadius={20}>
          <Flex
            width={'max-content'}
            alignItems={'center'}
            borderRadius={20}
            border={'1px solid #FFBD59;'}
            py={'6px'}
            pl={'8px'}
            pr={'19px'}>
            <Image src={GOV_TOKEN?.logoURI} alt="vara logo" mr={11} h={29} />
            <Text color={'#FFBD59'} fontSize={15}>
              VARA
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default DashboardOverview;
