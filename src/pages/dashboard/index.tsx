import DashboardOverview from '@/components/dashboard/DashboardOverview';
import LockPeriod from '@/components/dashboard/LockPeriod';
import { useVeTokenStore } from '@/store/veTokenStore';
import BackButton from '@/styles/BackButton';
import {
  Container,
  Flex,
  ButtonGroup,
  Stack,
  Button,
  Box,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

const buttons = [25, 50, 75, 100];

const Dashboard = () => {
  const [isMobile] = useMediaQuery('(max-width: 600px)');
  const { address } = useAccount();
  const {
    balance,
    lockAmount,
    lockPeriod,
    veVaraAmount,
    getGovTokenBalance,
    setLockAmount,
    calculateVeVARA,
    createLock,
  } = useVeTokenStore(state => ({
    balance: state.balance,
    isLoading: state.isLoading,
    lockAmount: state.lockAmount,
    lockPeriod: state.lockPeriod,
    veVaraAmount: state.veVaraAmount,
    setLockAmount: state.actions.setLockAmount,
    calculateVeVARA: state.actions.calculateVeVARA,
    getGovTokenBalance: state.actions.getGovTokenBalance,
    createLock: state.actions.createLock,
  }));

  useEffect(() => {
    if (address) {
      getGovTokenBalance(address);
    }
  }, [address]);

  useEffect(() => {
    if (lockAmount && lockPeriod) {
      calculateVeVARA();
    }
  }, [lockAmount, lockPeriod]);

  return (
    <Container
      w={isMobile ? 360 : 528}
      borderRadius={'30px'}
      p={isMobile ? '16px' : '25px'}
      background={
        'linear-gradient(#0D142E 0 0) padding-box, linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box;'
      }
      border={'1px solid transparent'}>
      <Flex
        justifyContent={'space-between'}
        flexDirection={isMobile ? 'column' : 'row'}>
        <BackButton />
        <ButtonGroup mt={isMobile ? '32px' : 0}>
          <Stack direction={'row'} align="center">
            {buttons.map((value, index) => (
              <Button
                key={index}
                colorScheme="purple"
                variant="outline"
                p={'8px'}
                lineHeight={'normal'}
                letterSpacing={1.95}
                onClick={() => {
                  setLockAmount((value * balance) / 100);
                }}
                border={
                  value === (lockAmount / balance) * 100
                    ? '1px solid #FFBD59;'
                    : '1px solid rgba(255, 255, 255, 0.50);'
                }>
                {value} %
              </Button>
            ))}
          </Stack>
        </ButtonGroup>
      </Flex>

      <DashboardOverview />
      <LockPeriod />

      <Box mt={33}>
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          fontSize={15}
          letterSpacing={1.95}>
          <Text fontFamily={'Arista'} color={'#F5F5F5'} fontWeight={300}>
            Your voting power will be
          </Text>
          <Text color={'#70DD88'} fontWeight={400}>
            {veVaraAmount.toFixed(2)} veVARA
          </Text>
        </Flex>

        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          fontSize={15}
          letterSpacing={1.95}
          marginTop={13}>
          <Text fontFamily={'Arista'} color={'#F5F5F5'} fontWeight={300}>
            Amount of days locked
          </Text>
          <Text color={'#70DD88'} fontWeight={400}>
            {lockPeriod}
          </Text>
        </Flex>

        <Button
          mt={'32px'}
          py={'12px'}
          w={'full'}
          h={58}
          fontSize={'25px'}
          borderRadius={'11px'}
          letterSpacing={3.25}
          disabled={lockAmount === 0 || lockPeriod === 0}
          onClick={async () => {
            await createLock(lockAmount, lockPeriod);
          }}>
          Create New veNFT
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
