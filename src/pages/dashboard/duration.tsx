import { DurationT } from '@/utils/data';
import { Button, ButtonProps, Text } from '@chakra-ui/react';
import { FC } from 'react';

interface Props extends ButtonProps {
  data: DurationT;
  isSelected: boolean;
  onClick: () => void;
}

export const DurationBtn: FC<Props> = ({
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
      w="7rem"
      value={_value}
      style={buttonStyle}
      onClick={onClick}
      {...rest}>
      <Text fontSize={{ base: '0.9rem', lg: '1rem' }}>{_text}</Text>
    </Button>
  );
};
