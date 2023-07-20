
import { Box, VStack, Divider, useBreakpointValue } from "@chakra-ui/react";
import Header from "./components/Header";
import MainInputValue from "./components/MainInputValue";
import DatePicker from "./components/DatePicker";
import Footer from "./components/Footer";
import { CONTRACTS } from "@/config/company";

const Dashboard = () => {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Box
      as="section"
      bg='transparent'
      background={'linear-gradient(#141f43 0 0) padding-box, linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box;'}
      border={'1px solid transparent'}
      borderRadius={'30px'}
      px={isMobile ? 4 : 7}
      py={7}
    >
      <VStack gap={5}>
        <Header isMobile={isMobile} />
        <MainInputValue isMobile={isMobile} />
        <DatePicker isMobile={isMobile} />
        <Divider my={3} />
        <Footer isMobile={isMobile} />
      </VStack>
    </Box>
  );
};

export default Dashboard;
