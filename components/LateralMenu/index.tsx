import React, { ReactNode, ReactText } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Button,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Badge,
} from '@chakra-ui/react';
import { FiHome, FiPower, FiTrendingUp, FiTrendingDown, FiMenu } from 'react-icons/fi';
import { IconType } from 'react-icons';
import Image from 'next/image';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { TbPigMoney } from 'react-icons/tb';

interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Início', icon: FiHome, link: '/' },
  { name: 'Criar receita', icon: FiTrendingUp, link: '/bill?type=INCOME' },
  { name: 'Criar despesa', icon: FiTrendingDown, link: '/bill?type=EXPENSE' },
  { name: 'Orçamentos', icon: TbPigMoney, link: '/budget' },
  { name: 'Categorias', icon: BiSolidCategoryAlt, link: '/category' },
  {
    name: 'Sair',
    icon: FiPower,
    link: '/logout',
  },
];

export const LateralMenu = ({ children }: { children: ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="center">
        <Image src="/logo.png" width={35} height={35} />
        <Flex height="14px" ml={2}>
          <Badge variant="outline" fontSize="xx-small" colorScheme="green">
            Beta
          </Badge>
        </Flex>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map(({ name, icon, link }) => (
        <NavItem key={name} icon={icon} link={link}>
          {name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  link: string;
}
const NavItem = ({ icon, link, children, ...rest }: NavItemProps) => {
  return (
    <Link href={link} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'red.600',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton variant="outline" onClick={onOpen} aria-label="open menu" icon={<FiMenu />} />

      <Flex ml={5} height="35px" alignItems="center">
        <Image src="/logo.png" width={35} height={35} />
        <Flex height="14px" ml={2}>
          <Badge variant="outline" fontSize="xx-small" colorScheme="green">
            Beta
          </Badge>
        </Flex>
      </Flex>
    </Flex>
  );
};
