import classNames from 'classnames';
import { setActivePage } from '../../../store/slices/editorSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks';

type TabProps = {
  label: string;
  icon: JSX.Element;
  tabIndex: number;
};

const Tab = ({ label, icon, tabIndex }: TabProps) => {
  const dispatch = useAppDispatch();
  const activePage = useAppSelector((state) => state.editor.activePage);
  const active = activePage === tabIndex;

  const handleTabSelection = () => {
    dispatch(setActivePage(tabIndex));
  };

  return (
    <div
      className={classNames(
        'px-8 py-3 flex items-center hover:cursor-pointer',
        {
          'bg-darkblue-200': active,
          'bg-darkblue-500': !active,
        }
      )}
      onClick={handleTabSelection}
    >
      <span className='mr-2 text-palecyan'>{icon}</span>
      {label}
    </div>
  );
};

export default Tab;
