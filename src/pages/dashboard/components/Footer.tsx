import { useEffect, useState } from "react";
import { readContract, writeContract, waitForTransaction } from '@wagmi/core'
import { useAccount } from "wagmi";
import { useStore } from "@/hooks/state";
import { HStack, VStack, Text, Button, Spinner } from "@chakra-ui/react";
import { CONTRACTS } from '@/config/company';
import { ethers } from "ethers";
import { getBalance } from "@/hooks/functions";

interface FooterProps {
    isMobile: boolean | undefined
}

export default function Footer({
    isMobile
}: FooterProps) {
    const { address } = useAccount();
    const [balance, veAmount, period, amount, setBalance] = useStore((state) => [state.balance, state.veAmount, state.period, state.amount, state.updateBalance])
    const [isApprove, setApprove] = useState(true);
    const [isInsufficient, setInsufficient] = useState(true);
    const [incorrectDate, setIncorrectDate] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const getAllowence = async () => {
        try {
            const allowanceAmount = await readContract({
                address: CONTRACTS.GOV_TOKEN_ADDRESS,
                abi: CONTRACTS.GOV_TOKEN_ABI,
                functionName: 'allowance',
                args: [
                    address,
                    CONTRACTS.VE_TOKEN_ADDRESS,
                ],
            }) as bigint
            setApprove(Number(allowanceAmount) < Number(amount) || Number(amount) === 0)
        } catch (err) {
            console.log(err)
        }
    }

    const handleProcess = async () => {
        try {
            if (!isInsufficient) {
                setIsLoading(true)
                if (isApprove) {
                    await writeContract({
                        address: CONTRACTS.GOV_TOKEN_ADDRESS,
                        abi: CONTRACTS.GOV_TOKEN_ABI,
                        functionName: 'approve',
                        args: [
                            CONTRACTS.VE_TOKEN_ADDRESS,
                            ethers.utils.parseEther(amount)
                        ]
                    }).then((res) => {
                        const handleNextAction = async () => {
                            const data = await waitForTransaction({
                                hash: res.hash
                            })
                            if (data.status === 'success') {
                                await getAllowence()
                            }
                        }
                        handleNextAction()
                    })
                } else {
                    await writeContract({
                        address: CONTRACTS.VE_TOKEN_ADDRESS,
                        abi: CONTRACTS.VE_TOKEN_ABI,
                        functionName: 'create_lock',
                        args: [
                            BigInt(Number(amount) * 1e18),
                            BigInt(period * 24 * 3600)
                        ]
                    }).then(res => {
                        const handleNextAction = async () => {
                            const data = await waitForTransaction({
                                hash: res.hash
                            })
                            if (data.status === 'success') {
                                const balance = await getBalance(address);
                                setBalance(balance)
                            }
                        }
                        handleNextAction()
                    })
                }
                setIsLoading(false)
            }
        } catch (err) {
            setIsLoading(false)
            console.log(err)
        }
    }

    const getBtnStatus = () => {
        setInsufficient(Number(amount) > Number(balance) || Number(amount) === 0)
        setIncorrectDate(period === 0)
    }

    useEffect(() => {
        getAllowence()
        getBtnStatus()
    }, [amount, period])

    return (
        <VStack width={'full'}>
            <HStack width={'full'} justifyContent={'space-between'}>
                <Text fontSize={isMobile ? 14 : 15} fontWeight={'thin'} letterSpacing={2} color={'gray.500'}>Your voting power will be</Text>
                <Text color={'green.500'} letterSpacing={2} fontSize={isMobile ? 14 : 15}>{veAmount} veVARA</Text>
            </HStack>
            <HStack width={'full'} justifyContent={'space-between'}>
                <Text fontSize={isMobile ? 14 : 15} fontWeight={'thin'} letterSpacing={2} color={'gray.500'}>Amount of days locked</Text>
                <Text color={'green.500'} letterSpacing={2} fontSize={isMobile ? 14 : 15}>{period}</Text>
            </HStack>
            <Button
                height={isMobile ? '50px' : '58px'}
                width={'full'}
                borderRadius={11}
                fontSize={isMobile ? 20 : 24}
                mt={6}
                onClick={() => handleProcess()}
                isDisabled={isInsufficient || incorrectDate || isLoading}
                _disabled={{
                    opacity: '0.5',
                    color: 'gray.500',
                    bg: 'transparent',
                    border: '1px solid',
                    borderColor: 'gray.500'
                }}
                _hover={{
                    transform: (isInsufficient || incorrectDate || isLoading) ? 'scale(1)' : 'scale(1.02, 1.02)',
                    bg: !(isInsufficient || incorrectDate || isLoading) && 'linear-gradient(to right, #CD74CC, #FFBD59 , #70DD88)',
                    color: !(isInsufficient || incorrectDate || isLoading) && 'gray.800'
                }}
            >
                {isLoading && <Spinner mr={3} />}
                {isInsufficient ? 'Insufficient Balance' : incorrectDate ? 'Incorrect Lock Date' : isLoading ? 'Loading...' : isApprove ? 'Approve' : 'Create New veNFT'}
            </Button>
        </VStack >
    )
}
