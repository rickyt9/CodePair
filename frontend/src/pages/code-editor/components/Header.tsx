import { PiPencilSimpleLineThin } from 'react-icons/pi';
import { BsCameraVideo, BsChatLeft } from 'react-icons/bs';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { FaCode } from 'react-icons/fa6';
import Tab from './Tab';

const Header = () => {
  return (
    <header className='bg-darkblue-800 px-8 text-beige text-sm'>
      <nav className='flex'>
        <Tab label='Code' icon={<FaCode />} active />
        <Tab label='Whiteboard' icon={<PiPencilSimpleLineThin />} />

        <div className='ml-auto flex items-center'>
          <div className='flex items-center mr-8'>
            <span className='mr-3.5'>
              <BsCameraVideo className='text-base' />
            </span>
            <span>
              <BsChatLeft className='text-xs' />
            </span>
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
