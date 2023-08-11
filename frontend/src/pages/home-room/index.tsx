import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    setRoomId(newValue);
  };

  const joinRoomHandler = () => {
    navigate(`/rooms/${roomId}`);
  };

  return (
    <main>
      <div className={styles['card']}>
        <h1>Lets join a room!</h1>
        <input
          type='text'
          placeholder='Enter room id'
          value={roomId}
          onChange={inputChangeHandler}
        />
        <button onClick={joinRoomHandler}>Create New Room</button>
      </div>
    </main>
  );
};

export default Home;
