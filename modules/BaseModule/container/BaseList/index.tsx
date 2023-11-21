import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Button,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  IconButton,
  Stack,
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

import { Modal } from '@Components';

const MODAL_TYPES = {
  EDIT_MODAL: 'EDIT_MODAL',
  DELETE_MODAL: 'DELETE_MODAL',
};

interface BaseHeader {
  label: string;
  field: string;
  render?: (item) => React.ReactElement;
}

interface BaseListInterface<T> {
  headers: BaseHeader[];
  items: T[];
  isLoading: boolean;
  optionsEnabled?: boolean;
  onDeleteItem?: (id: string) => void;
  onCloseOption?: () => void;
  editComponent?: (id: string) => React.ReactElement;
}

const BaseList = <T extends { id?: string }>({
  headers,
  items,
  isLoading,
  optionsEnabled = false,
  editComponent,
  onCloseOption,
  onDeleteItem,
}: BaseListInterface<T>) => {
  const [modalType, setModalType] = useState(null);
  const [id, setId] = useState<string>();

  useEffect(() => {
    if (!modalType && !!onCloseOption) {
      onCloseOption();
    }
  }, [modalType]);

  const handleOpenModalWithId = (id, type) => {
    setId(id);
    setModalType(type);
  };

  const wrapperOnDelete = cb => {
    setModalType(null);
  };

  const tableItems = useMemo(() => {
    const fields = headers.map(({ field }) => field);

    return items.map((item: T, index) => (
      <Tr key={index}>
        {headers.map(({ field, render }) => {
          if (!item[field]) return;
          if (!!render) return <Td>{render(item)}</Td>;
          return <Td>{item[field]}</Td>;
        })}
        {optionsEnabled && (
          <Td>
            <Popover placement="bottom-end" isLazy>
              <PopoverTrigger>
                <IconButton
                  aria-label="More server options"
                  icon={<BsThreeDotsVertical />}
                  variant="outline"
                  size="sm"
                  w="fit-content"
                />
              </PopoverTrigger>
              <PopoverContent w="fit-content" _focus={{ boxShadow: 'none' }}>
                <PopoverArrow />
                <PopoverBody>
                  <Stack>
                    <Button
                      w="210px"
                      variant="ghost"
                      leftIcon={<EditIcon />}
                      justifyContent="flex-start"
                      fontWeight="normal"
                      fontSize="sm"
                      onClick={() => handleOpenModalWithId(item.id, MODAL_TYPES.EDIT_MODAL)}
                    >
                      Editar item
                    </Button>

                    <Button
                      w="210px"
                      variant="ghost"
                      leftIcon={<DeleteIcon />}
                      justifyContent="flex-start"
                      fontWeight="normal"
                      colorScheme="red"
                      fontSize="sm"
                      onClick={() => handleOpenModalWithId(item.id, MODAL_TYPES.DELETE_MODAL)}
                    >
                      Deletar item
                    </Button>
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Td>
        )}
      </Tr>
    ));
  }, [headers, items, optionsEnabled]);

  const modalContent = useMemo(() => {
    switch (modalType) {
      case MODAL_TYPES.DELETE_MODAL:
        return (
          <>
            <Text fontSize="lg" fontWeight="bold" color="white" mb={5} mt={3}>
              Deletar item
            </Text>
            Você tem certeza que deseja apagar este item?
          </>
        );

      case MODAL_TYPES.EDIT_MODAL:
        return <>{editComponent(id)}</>;

      default:
        return <></>;
    }
  }, [editComponent, id, modalType]);

  const modalFooter = useMemo(() => {
    switch (modalType) {
      case MODAL_TYPES.DELETE_MODAL:
        return (
          <>
            <Button onClick={() => setModalType(null)}>Cancelar</Button>
            <Button colorScheme="red" ml={3} onClick={() => wrapperOnDelete(onDeleteItem(id))}>
              Deletar
            </Button>
          </>
        );
    }
  }, [editComponent, id, modalType]);

  return (
    <>
      <Modal
        isOpen={Object.keys(MODAL_TYPES).includes(modalType)}
        onClose={() => setModalType(null)}
        footer={modalFooter}
      >
        {modalContent}
      </Modal>
      <Table variant="simple">
        <Thead>
          <Tr>
            {headers.map(({ label }) => (
              <Th key={label}>{label}</Th>
            ))}
            {optionsEnabled && <Th></Th>}
          </Tr>
        </Thead>
        <Tbody>
          <>
            {isLoading && <Spinner />}
            {!isLoading && tableItems}
          </>
        </Tbody>
      </Table>
    </>
  );
};

export { BaseList };
export default BaseList;
