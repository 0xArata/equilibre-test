import { useEffect, useState } from 'react'
import { useStore } from "@/hooks/state";
import { HStack, Text, Input, VStack, Button } from "@chakra-ui/react";

const lockDates = [
    {
        label: '1 week',
        period: 7,
    },
    {
        label: '1 month',
        period: 30
    },
    {
        label: '1 year',
        period: 365
    },
    {
        label: '4 years',
        period: 1460
    }
]

interface DatePickerProps {
    isMobile: boolean | undefined
}

const aDayMs = 1000 * 60 * 60 * 24
const today = new Date();

export default function DatePicker({
    isMobile
}: DatePickerProps) {
    const [amount, period, setPeriod, setVEAmount] = useStore((state) => [state.amount, state.period, state.updatePeriod, state.updateVEAmount])
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [endDate, setEndDate] = useState<string>('');

    const handleUpdateDatePeriod = (currentDate: string) => {
        setEndDate(currentDate)
        const endTime = new Date(currentDate);
        const durationMs: number = endTime.getTime() - today.getTime();
        const durationDays: number = durationMs / aDayMs;
        const roundedDuration: number = Math.round(durationDays)

        if (roundedDuration > 0) {
            setPeriod(roundedDuration)
        } else {
            setPeriod(0)
        }
    }

    const handleUpdatePeriod = (period: number) => {
        setPeriod(period)

        const endTimeMs: number = today.getTime() + period * aDayMs;
        const date = new Date(endTimeMs);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        setEndDate(formattedDate)
    }

    useEffect(() => {
        const veAmount = Number(amount) * period / 1460
        setVEAmount(veAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 5 }));
        if (lockDates.map(item => item.period).includes(period)) {
            lockDates.map((item, index) => {
                if (item.period === period) {
                    setActiveIndex(index)
                }
            })
        } else {
            setActiveIndex(-1)
        }
    }, [period])

    return (
        <VStack width={'full'} mt={3}>
            <HStack width='full' justifyContent={'space-between'}>
                <Text letterSpacing={isMobile ? 0 : 2} fontSize={isMobile ? 13 : 15} fontWeight={'normal'}>Select Expiry Date:</Text>
                <Input
                    placeholder="DD/MM/YYYY"
                    size="md"
                    type="date"
                    width={isMobile ? '200px' : '270px'}
                    height={isMobile ? '50px' : '58px'}
                    borderRadius={12}
                    fontSize={isMobile ? 22 : 30}
                    letterSpacing={3}
                    p={1}
                    onChange={(e) => handleUpdateDatePeriod(e.currentTarget.value)}
                    value={endDate}
                />
            </HStack>
            <HStack justifyContent={'space-between'} width={'full'} mt={7}>
                {lockDates.map((item, index) => (
                    <Button
                        key={item.label}
                        border={'1px solid'}
                        borderColor={activeIndex === index ? 'orange.300' : 'gray.500'}
                        size={'sm'}
                        color={activeIndex === index ? 'orange.300' : 'gray.500'}
                        _hover={{
                            transform: 'scale(1.05)',
                            color: 'orange.300',
                            borderColor: 'orange.300'
                        }}
                        _active={{
                            bg: 'blue.500',
                        }}
                        height={'44px'}
                        borderRadius={11}
                        px={isMobile ? 2 : 4}
                        fontSize={isMobile ? 14 : 15}
                        onClick={() => handleUpdatePeriod(item.period)}
                    >
                        {item.label}
                    </Button>
                ))}
            </HStack>
        </VStack>
    )
}
