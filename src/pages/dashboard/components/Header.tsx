import { useEffect, useState } from 'react'
import { Button, ButtonGroup, HStack } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useStore } from "@/hooks/state";
import BigNumber from 'bignumber.js';

const AmountSelectBtns = [
    {
        label: '25%',
        multiple: 0.25
    },
    {
        label: '50%',
        multiple: 0.5
    },
    {
        label: '75%',
        multiple: 0.75
    },
    {
        label: '100%',
        multiple: 1
    }
]

interface HeaderProps {
    isMobile: boolean | undefined
}

export default function Header({
    isMobile
}: HeaderProps) {
    const [amount, balance, setAmount] = useStore((state) => [state.amount, state.balance, state.updateAmount])
    const [activeIndex, setActiveIndex] = useState<number>(-1)

    const handleUpdateAmount = (multiple: number) => {
        setAmount(BigNumber(balance).multipliedBy(BigNumber(multiple)).toString())
    }

    useEffect(() => {
        if (AmountSelectBtns.map(item => item.multiple).includes((BigNumber(amount).dividedBy(BigNumber(balance))).toNumber())) {
            AmountSelectBtns.map((item, index) => {
                if (item.multiple === ((BigNumber(amount).dividedBy(BigNumber(balance))).toNumber())) {
                    setActiveIndex(index)
                }
            })
        } else {
            setActiveIndex(-1)
        }
    }, [amount])


    return (
        <HStack justifyContent={'space-between'} width={'full'}>
            <Button
                border={'1px solid'}
                borderColor={'pink.500'}
                size={'sm'}
                color={'pink.500'}
                _hover={{
                    transform: 'scale(1.05)',
                }}
                _active={{
                    bg: 'blue.500',
                }}
            >
                <ChevronLeftIcon />
            </Button>
            <ButtonGroup>
                {AmountSelectBtns.map((item, index) => (
                    <Button
                        border={'1px solid'}
                        borderColor={activeIndex === index ? 'orange.300' : 'gray.500'}
                        size={'sm'}
                        color={activeIndex === index ? 'orange.300' : 'gray.500'}
                        maxW={'50'}
                        _hover={{
                            transform: 'scale(1.05)',
                            color: 'orange.300',
                            borderColor: 'orange.300'
                        }}
                        _active={{
                            bg: 'blue.500',
                        }}
                        fontSize={isMobile ? 14 : 15}
                        key={item.label}
                        onClick={() => handleUpdateAmount(item.multiple)}
                    >
                        {item.label}
                    </Button>
                ))}
            </ButtonGroup>
        </HStack >
    )
}
