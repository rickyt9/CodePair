import styles from './styles.module.css';
import rectangleIcon from '../../assets/icons/rectangle.svg';
import lineIcon from '../../assets/icons/line.svg';
import rubberIcon from '../../assets/icons/rubber.svg';
import pencilIcon from '../../assets/icons/pencil.svg';
import textIcon from '../../assets/icons/text.svg';
import selectionIcon from '../../assets/icons/selection.svg';
import { ToolType } from '../../utils/types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setElements, setToolType } from '../Whiteboard/whiteboardSlice';
import classNames from 'classnames';
import { emitClearWhiteboard } from '../../socketConn/socketConn';

interface IconButtonProps {
  src: string;
  type?: ToolType;
  isRubber?: boolean;
}

const IconButton = ({ src, type, isRubber }: IconButtonProps) => {
  const dispatch = useAppDispatch();
  const selectedToolType = useAppSelector((state) => state.whiteboard.tool);

  const handleToolChange = () => {
    dispatch(setToolType(type!));
  };
  const handleClearCanvas = () => {
    dispatch(setElements([]));
    emitClearWhiteboard();
  };

  return (
    <button
      className={classNames(styles['menu-button'], {
        [styles['menu-button-active']]: selectedToolType === type,
      })}
      onClick={isRubber ? handleClearCanvas : handleToolChange}
    >
      <img width='80%' height='80%' src={src} />
    </button>
  );
};

const Menu = () => {
  return (
    <div className={`${styles['menu-container']} z-10`}>
      <IconButton src={rectangleIcon} type={ToolType.RECTANGLE} />
      <IconButton src={lineIcon} type={ToolType.LINE} />
      <IconButton src={rubberIcon} isRubber />
      <IconButton src={pencilIcon} type={ToolType.PENCIL} />
      <IconButton src={textIcon} type={ToolType.TEXT} />
      <IconButton src={selectionIcon} type={ToolType.SELECTION} />
    </div>
  );
};

export default Menu;
