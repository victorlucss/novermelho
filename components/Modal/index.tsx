import { Modal as ModalChakra, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react';

interface ModalInterface {
  onClose: () => void;
  isOpen: boolean;
  children: React.ReactElement;
}

export const Modal = ({ onClose, isOpen, children }: ModalInterface) => {
  return (
    <ModalChakra motionPreset="slideInBottom" onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ModalChakra>
  );
};
