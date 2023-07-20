import { useEffect } from "react";
import { Image, Input, HStack, Text, VStack, Button } from "@chakra-ui/react";
import { CONTRACTS } from "@/config/company";
import { useStore } from "@/hooks/state";
import { useAccount } from "wagmi";
import { getBalance } from "@/hooks/functions";

interface MainInputValueProps {
    isMobile: boolean | undefined;
}

export default function MainInputValue({
    isMobile,
}: MainInputValueProps) {
    const { address, isConnected } = useAccount();
    const [balance, setBalance] = useStore((state) => [state.balance, state.updateBalance])
    const [amount, setAmount] = useStore((state) => [state.amount, state.updateAmount])
    const [period, setVEAmount] = useStore((state) => [state.period, state.updateVEAmount])

    const handleUpdateBalance = (amount: string) => {
        const regex = /\d+[.]?(\.\d+)?$/;
        if (amount === '' || regex.test(amount)) {
            setAmount(amount)
            const veAmount = Number(amount) * period / 1460
            setVEAmount(veAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 5 }));
        }
    }

    const updateBalance = async () => {
        const balance = await getBalance(address);
        setBalance(balance)
    }

    useEffect(() => {
        updateBalance();
    }, [isConnected, address])

    return (
        <VStack border={'1px solid'} borderColor={'blue.400'} borderRadius={10} width={isMobile ? 'full' : 475} alignItems={'flex-end'} p={isMobile ? 3 : 4} background={'rgba(31, 46, 100, 0.50)'}>
            <Text fontSize={10} fontWeight={'normal'}>Balance: {balance}</Text>
            <HStack width={'full'} alignItems={'center'} justifyContent={'space-between'}>
                <VStack alignItems={'flex-start'} width={'calc(100% - 100px)'}>
                    <Input
                        variant='unstyled'
                        fontSize={25}
                        fontWeight={'normal'}
                        placeholder="0.00"
                        borderRadius={'none'}
                        textAlign={'left'}
                        color={'White'}
                        letterSpacing={3}
                        value={amount}
                        onChange={(e) => handleUpdateBalance(e.currentTarget.value)}
                    />
                    <Text fontSize={15} fontWeight={'normal'} color={'gray.500'}>$0.00</Text>
                </VStack>
                <Button
                    borderRadius={30}
                    border={'1px solid'}
                    borderColor={'orange.300'}
                    px={isMobile ? '4px' : '7px'}
                    py={'7px'}
                    height={'max-content'}
                    gap={isMobile ? 1 : 3}
                    width={isMobile ? '100px' : 'max-content'}
                    _hover={{
                        transform: 'scale(1.05)',
                    }}
                    _active={{
                        bg: 'blue.500',
                    }}
                >
                    <Image
                        src={CONTRACTS.GOV_TOKEN_LOGO}
                        width={isMobile ? 25 : 30}
                        height={isMobile ? 25 : 30}
                        style={{
                            borderRadius: 999,
                        }}
                        alt="main token logo"
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = ''
                        }}
                    />
                    <Text color='orange.300' fontSize={isMobile ? 14 : 15}>VARA</Text>
                </Button>
            </HStack>
        </VStack>
    )
}
