import { fetchBalance } from '@wagmi/core';
import { CONTRACTS } from "@/config/company";

export const getBalance = async (address: `0x${string}` | undefined) => {
    if (address) {
        try {
            const varaBalance = await fetchBalance({
                address: address,
                chainId: 2222,
                token: CONTRACTS.GOV_TOKEN_ADDRESS,
                formatUnits: 'ether'
            })
            return varaBalance.formatted
        } catch (err) {
            console.log(err)
            return '0.00'
        }
    }
    return '0.00'
}