import useIsMounted from '@/hooks/useIsMounted';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { usePairStore } from '@/store/pairsStore';
import {
  Box,
  Button,
  Container,
  HStack,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import { IoAnalyticsOutline, IoStorefrontOutline } from 'react-icons/io5';
import { SiLinktree } from 'react-icons/si';
import { EquilibreConnect } from '../core/ConnectButton';
import MobileNavigation from './MobileNavigation';
import Navigation from './Navigation';
import { useGlobalStateStore } from '@/store/globalStore';

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const mounted = useIsMounted();
  const { initBaseAssets, isLoading } = useBaseAssetStore(state => ({
    initBaseAssets: state.actions.initBaseAssets,
    isLoading: state.isLoading,
  }));
  const { initPairs } = usePairStore(state => ({
    initPairs: state.actions.initPairs,
  }));
  const { initGlobalData } = useGlobalStateStore(state => ({
    initGlobalData: state.actions.initGlobalData,
  }));

  useEffect(() => {
    initBaseAssets();
    initPairs();
    initGlobalData();
  }, []);
  return mounted ? (
    <>
      <Box as="section" pb={{ base: '2', md: '4' }} textColor={'white'}>
        <Box as="nav" pt={6}>
          <HStack mx={['0', '0', '12']} justify="space-around">
            <Image
              w="3xs"
              py={'6'}
              objectFit="contain"
              src="/images/equilibre-logo.png"
            />

            <Navigation />
            {isDesktop && <EquilibreConnect mobile={false} />}
            <Menu>
              <MenuButton as={Button} py={1} px={2} borderRadius={'2xl'}>
                {/* <EllipsisIcon color={'white'} boxSize={'8'}/> */}
                <Icon as={FaEllipsisH} color={'white'} mt={2} boxSize={6} />
              </MenuButton>
              <MenuList bg={'blue.500'} borderRadius={'xl'}>
                <MenuItem
                  bg={'blue.500'}
                  _hover={{ color: 'yellow.500', textDecoration: 'none' }}
                  icon={<SiLinktree />}
                  as={Link}
                  isExternal
                  href="https://linktr.ee/equilibrefinance">
                  Linktree
                </MenuItem>
                <MenuItem
                  bg={'blue.500'}
                  _hover={{ color: 'yellow.500', textDecoration: 'none' }}
                  icon={<IoAnalyticsOutline />}
                  as={Link}
                  isExternal
                  href="https://analytics.equilibrefinance.com/home">
                  Analytics
                </MenuItem>
                <MenuItem
                  bg={'blue.500'}
                  _hover={{ color: 'yellow.500', textDecoration: 'none' }}
                  icon={<IoStorefrontOutline />}
                  as={Link}
                  isExternal
                  href="https://paintswap.finance/marketplace/kava/financial/collections/equilibre">
                  Paintswap
                </MenuItem>
              </MenuList>
            </Menu>
            <MobileNavigation />
          </HStack>
        </Box>
      </Box>
      <Container
        maxW={'container.xl'}
        h={'75vh'}
        py={'20'}
        justifyContent={'center'}
        alignItems={'center'}
        display={'flex'}
        textColor={'white'}>
        {isLoading ? <Spinner /> : children}
      </Container>
    </>
  ) : (
    <></>
  );
};

export default Layout;
