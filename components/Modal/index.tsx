import {
  Modal as ModalChakra,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
} from '@chakra-ui/react';

interface ModalInterface {
  onClose: () => void;
  isOpen: boolean;
  title?: string;
  footer?: React.ReactElement;
  children: React.ReactElement;
}

export const Modal = ({ title, footer, onClose, isOpen, children }: ModalInterface) => {
  return (
    <ModalChakra motionPreset="slideInBottom" onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent maxW="95vw" margin="auto">
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </ModalChakra>
  );
};
