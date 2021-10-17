import React, { useEffect, useMemo, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Spinner, Button } from '@chakra-ui/react';

import { Modal } from '@Components';

const MODAL_TYPES = {
  EDIT_MODAL: 'EDIT_MODAL',
  DELETE_MODAL: 'DELETE_MODAL',
};

interface BaseHeader {
  label: string;
  field: string;
}

interface BaseListInterface<T> {
  headers: BaseHeader[];
  items: T[];
  isLoading: boolean;
  optionsEnabled?: boolean;
  onDeleteItem?: (id: string | number) => void;
  onCloseOption?: () => void;
  editComponent?: (id: string | number) => React.ReactElement;
}

const BaseList = <T extends { id?: string | number }>({
  headers,
  items,
  isLoading,
  optionsEnabled = false,
  editComponent,
  onCloseOption,
  onDeleteItem,
}: BaseListInterface<T>) => {
  const [modalType, setModalType] = useState(null);
  const [id, setId] = useState<number>();

  useEffect(() => {
    if (!modalType) {
      onCloseOption();
    }
  }, [modalType]);

  const handleOpenModalWithId = (id, type) => {
    setId(id);
    setModalType(type);
  };

  const tableItems = useMemo(() => {
    const fields = headers.map(({ field }) => field);

    return items.map((item: T, index) => (
      <Tr key={index}>
        {fields.map(field => {
          if (!item[field]) return;
          return <Td>{item[field]}</Td>;
        })}
        {optionsEnabled && (
          <Td>
            <Button onClick={() => handleOpenModalWithId(item.id, MODAL_TYPES.EDIT_MODAL)}>Edit</Button>
            <Button onClick={() => handleOpenModalWithId(item.id, MODAL_TYPES.DELETE_MODAL)}>Delete</Button>
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
            <h1>Are you sure about this action?</h1>
            <Button onClick={() => onDeleteItem(id)}>Yes, I'm</Button>
            <Button onClick={() => setModalType(null)}>Cancel</Button>
          </>
        );

      case MODAL_TYPES.EDIT_MODAL:
        return <>{editComponent(id)}</>;

      default:
        return <></>;
    }
  }, [editComponent, id, modalType]);

  return (
    <>
      <Modal isOpen={Object.keys(MODAL_TYPES).includes(modalType)} onClose={() => setModalType(null)}>
        {modalContent}
      </Modal>
      <Box margin="10px" padding="10px" borderWidth="1px" borderRadius="lg">
        <Table variant="simple">
          <Thead>
            <Tr>
              {headers.map(({ label }) => (
                <Th key={label}>{label}</Th>
              ))}
              {optionsEnabled && <Th>Options</Th>}
            </Tr>
          </Thead>
          <Tbody>
            <>
              {isLoading && <Spinner />}
              {!isLoading && tableItems}
            </>
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export { BaseList };
export default BaseList;
