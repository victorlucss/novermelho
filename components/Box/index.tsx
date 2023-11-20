import { Box as ChakraBox, BoxProps as ChakraBoxProps, Text, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

type BoxProps = {
  title?: string;
  description?: string;
  children: ReactNode;
} & ChakraBoxProps;

export const Box = ({ title, description, children, ...rest }: BoxProps) => {
  return (
    <ChakraBox m={3} p={3} borderWidth="1px" borderRadius="lg" {...rest}>
      {(title || description) && (
        <Flex direction="column" mb={5}>
          {title && (
            <Text fontSize="lg" fontWeight="bold" color="white">
              {title}
            </Text>
          )}
          {description && (
            <Text fontSize="sm" color="gray.500">
              {description}
            </Text>
          )}
        </Flex>
      )}

      {children}
    </ChakraBox>
  );
};
