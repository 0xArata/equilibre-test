import { FC } from 'react';
import { PercentageData } from '@/utils/data';
import { PercentageBtns } from './percentage';
import { Flex } from '@chakra-ui/react';

const percent = Object.values(PercentageData);

interface PercentageSelectorProps {
  selectedPercentage: number | null;
  handleLockAmountPercentage: (percentage: number) => void;
}

export const PercentageSelector: FC<PercentageSelectorProps> = ({
  selectedPercentage,
  handleLockAmountPercentage,
}) => {
  return (
    <Flex justifyContent="space-between" w="15rem">
      {percent.map((item, i) => {
        return (
          <PercentageBtns
            data={item}
            key={i}
            isSelected={item._value === selectedPercentage}
            onClick={() => handleLockAmountPercentage(item._value)}
          />
        );
      })}
    </Flex>
  );
};
