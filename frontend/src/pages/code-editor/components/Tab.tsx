import classNames from 'classnames';

type TabProps = {
  label: string;
  active?: boolean;
  icon: JSX.Element;
};

const Tab = ({ label, icon, active = false }: TabProps) => {
  return (
    <div
      className={classNames('px-8 py-3 flex items-center', {
        'bg-darkblue-200': active,
        'bg-darkblue-500': !active,
      })}
    >
      <span className='mr-2 text-palecyan'>{icon}</span>
      {label}
    </div>
  );
};

export default Tab;
