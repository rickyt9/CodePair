import classNames from 'classnames';
import { MdDraw } from 'react-icons/md';
import { FaEraser } from 'react-icons/fa';
import {
  PiTextTFill,
  PiCursorFill,
  PiSquareBold,
  PiLineSegmentFill,
} from 'react-icons/pi';
import { ToolType } from '../../utils/types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setElements, setToolType } from '../Whiteboard/whiteboardSlice';
import { emitClearWhiteboard } from '../../socketConn/socketConn';

type IconButtonProps = {
  icon: JSX.Element;
  type?: ToolType;
  isRubber?: boolean;
};

const IconButton = ({ icon, type, isRubber }: IconButtonProps) => {
  const dispatch = useAppDispatch();
  const selectedToolType = useAppSelector((state) => state.whiteboard.tool);

  const handleToolChange = () => {
    if (type) {
      dispatch(setToolType(type));
    }
  };
  const handleClearCanvas = () => {
    dispatch(setElements([]));
    emitClearWhiteboard();
  };

  const active = selectedToolType === type;
  return (
    <button
      className={classNames('text-white text-lg duration-500', {
        'bg-white/30 p-1 rounded-md': active,
      })}
      onClick={isRubber ? handleClearCanvas : handleToolChange}
    >
      {icon}
    </button>
  );
};

const Menu = () => {
  return (
    <div className='bg-zinc-700 absolute z-10 top-2 left-1/2 -translate-x-1/2 p-2.5 flex items-center gap-4 rounded-lg'>
      <IconButton icon={<PiSquareBold />} type={ToolType.RECTANGLE} />
      <IconButton icon={<PiLineSegmentFill />} type={ToolType.LINE} />
      <IconButton icon={<FaEraser />} isRubber />
      <IconButton icon={<MdDraw />} type={ToolType.PENCIL} />
      <IconButton icon={<PiTextTFill />} type={ToolType.TEXT} />
      <IconButton icon={<PiCursorFill />} type={ToolType.SELECTION} />
    </div>
  );
};

export default Menu;
