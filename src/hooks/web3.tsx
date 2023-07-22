import { ethers } from 'ethers';
import { useToast } from '@chakra-ui/react';

interface Props {
  title: string;
  description: string;
}

export const useWeb3 = () => {
  // @ts-expect-error
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  return { provider, signer };
};

export const useToastMessages = () => {
  const toast = useToast();

  const showErrorToast = ({ title, description }: Props) => {
    toast({
      title,
      description,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  const showSuccessToast = ({ title, description }: Props) => {
    toast({
      title,
      description,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return { showErrorToast, showSuccessToast };
};
