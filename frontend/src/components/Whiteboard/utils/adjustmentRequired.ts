import { ToolType } from '../../../utils/types';

export const adjustmentRequired = (type: ToolType) =>
  [ToolType.RECTANGLE, ToolType.LINE].includes(type);
