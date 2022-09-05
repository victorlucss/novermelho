import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/button';
import { Flex } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import BaseField from '@Modules/BaseModule/interfaces/BaseField';
import renderFields from '@Modules/BaseModule/shared/renderFields';

const BaseMenu = () => {
  return <div>aqui haverá um menu</div>;
};

export { BaseMenu };
export default BaseMenu;
