import { BubbleEnum } from '@Modules/BaseModule/constants/Bubble';

import SelectOption from './SelectOption';

export default interface BaseField {
  name: string;
  type: BubbleEnum;
  label: string;
  options?: SelectOption[];
  value?: (string | number | readonly string[]) & string;
}
