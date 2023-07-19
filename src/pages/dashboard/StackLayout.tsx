import { Stack } from '@chakra-ui/react';

interface PropsStack {
  children: React.ReactNode;
}

export const StackItemContainer = ({ children }: PropsStack) => {
  return <Stack spacing={6}>{children}</Stack>;
};

export const StackTexts = ({ children }: PropsStack) => {
  return <Stack spacing={3}>{children}</Stack>;
};
