import { Box as ChakraBox, BoxProps as ChakraBoxProps, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

type BoxProps = {
  title?: string;
  children: ReactNode;
} & ChakraBoxProps;

export const Box = ({ title, children, ...rest }: BoxProps) => {
  return (
    <ChakraBox {...rest}>
      {title && (
        <Text fontSize="lg" fontWeight="bold" color="white" mb={5}>
          {title}
        </Text>
      )}

      {children}
    </ChakraBox>
  );
};
