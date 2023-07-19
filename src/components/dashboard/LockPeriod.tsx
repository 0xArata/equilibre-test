import { Box, Flex, Text, Button, useMediaQuery } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState } from 'react';
import { useVeTokenStore } from '@/store/veTokenStore';

const period = [
  { text: '1 week', value: 7 },
  { text: '1 month', value: 30 },
  { text: '1 year', value: 365 },
  { text: '4 years', value: 4 * 365 },
];

const LockPeriod = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { setLockPeriod, lockPeriod } = useVeTokenStore(state => ({
    setLockPeriod: state.actions.setLockPeriod,
    lockPeriod: state.lockPeriod,
  }));
  const [isMobile] = useMediaQuery('(max-width: 600px)');

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const presentDate = new Date();
    const timeDifference = date.getTime() - presentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    setLockPeriod(daysDifference);
  };
  const handleLockPeriod = (value: number) => {
    setLockPeriod(value);
    const today = new Date();
    const expiringDate = new Date(
      today.getTime() + value * 24 * 60 * 60 * 1000
    );
    setSelectedDate(expiringDate);
  };

  return (
    <Box mt={30}>
      <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
        flexDirection={isMobile ? 'column' : 'row'}>
        <Text
          letterSpacing={1.95}
          fontSize={15}
          ml={2}
          mb={isMobile ? '16px' : 0}>
          Select Expiry Date:
        </Text>
        {/* background: rgba(11, 25, 75, 0.50); */}
        <Box
          // w={267}
          // h={58}
          borderRadius={'11px'}
          background={
            'linear-gradient(#0D142E 0 0) padding-box,linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box'
          }
          px={'18px'}
          py={'12px'}
          border={'1px solid transparent'}>
          <DatePicker
            className="datepicker"
            selected={selectedDate}
            onChange={(date: Date) => handleDateChange(date)}
            placeholderText="DD/MM/YYYY"
          />
        </Box>
      </Flex>
      <Box mt={34} pb={34} borderBottom={'1px solid rgba(255, 255, 255, 0.50)'}>
        <Flex
          gap={isMobile ? '9px' : '18px'}
          flexDir={'row'}
          alignItems={'center'}
          justifyContent={'center'}>
          {period.map(({ value, text }, index) => (
            <Button
              key={index}
              colorScheme="purple"
              variant="outline"
              px={'24px'}
              py={'12px'}
              lineHeight={'normal'}
              fontSize={isMobile ? '12px' : '16px'}
              letterSpacing={1.95}
              onClick={() => handleLockPeriod(value)}
              borderRadius={11}
              border={
                value === lockPeriod
                  ? '1px solid #FFBD59;'
                  : '1px solid rgba(255, 255, 255, 0.50);'
              }>
              {text}
            </Button>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default LockPeriod;
