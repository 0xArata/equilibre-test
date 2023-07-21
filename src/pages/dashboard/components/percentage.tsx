import { DurationT } from '@/utils/data';
import { Button, ButtonProps } from '@chakra-ui/react';
import { FC } from 'react';

interface Props extends ButtonProps {
  data: DurationT;
  isSelected: boolean;
  onClick: () => void;
}

export const PercentageBtns: FC<Props> = ({
  data,
  isSelected,
  onClick,
  ...rest
}) => {
  const { _text, _value } = data;

  // Apply a border color if the button is selected
  const buttonStyle = isSelected
    ? { borderColor: 'orange', borderWidth: '2px' }
    : {};

  return (
    <Button
      colorScheme="yellow"
      fontSize="0.9rem"
      w="2rem"
      h="2rem"
      px={6}
      value={_value}
      style={buttonStyle}
      variant={'outline'}
      onClick={onClick}>
      {_text}%
    </Button>
  );
};
