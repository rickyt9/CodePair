import { useState } from 'react';
import { PiPencilSimpleLineThin } from 'react-icons/pi';
import { BsCameraVideo, BsChatLeft } from 'react-icons/bs';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { FaCode } from 'react-icons/fa6';
import Tab from './Tab';

type HeaderProps = {};

const tabs = [
  {
    label: 'Code',
    icon: <FaCode />,
  },
  {
    label: 'Whiteboard',
    icon: <PiPencilSimpleLineThin />,
  },
];

const ChatBox = () => {
  return (
    <div className='bg-white absolute w-fit h-40 z-100 top-full right-0 rounded-sm p-4 flex flex-col text-left'>
      <div className='border-2 border-black'>
        <p>Messages</p>
      </div>
      <div className='flex-1'></div>
      <form>
        <input
          className='border-2 border-rose-500'
          type='text'
          placeholder='Type Something'
        />
      </form>
    </div>
  );
};

const Header = ({}: HeaderProps) => {
  const [isChatDisplayed, setIsChatDisplayed] = useState<boolean>(false);

  const handleDisplayChat = () => {
    setIsChatDisplayed((prevIsChatDisplayed) => !prevIsChatDisplayed);
  };

  return (
    <header className='bg-darkblue-800 px-8 text-beige text-sm'>
      <nav className='flex'>
        {tabs.map((tab, index) => (
          <Tab key={`tab-${index}`} {...tab} tabIndex={index} />
        ))}

        <div className='ml-auto flex items-center'>
          <div className='flex items-center mr-8 gap-3.5'>
            <button>
              <BsCameraVideo className='text-base' />
            </button>
            <button className='relative' onClick={handleDisplayChat}>
              <BsChatLeft className='text-xs' />
              {isChatDisplayed && <ChatBox />}
            </button>
          </div>
          <div className='flex items-center'>
            <span className='mr-1'>
              <AiOutlineUserAdd className='text-lg' />
            </span>
            Invite
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
