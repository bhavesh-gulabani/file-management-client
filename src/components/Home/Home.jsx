import React from 'react';
import { FileUpload, Logo } from '../../components';

import styles from './Home.module.css';

const Home = ({ onLogout: logoutHandler }) => {
  return (
    <>
      <header className={styles.header}>
        <Logo className={styles['header-logo']} />
        <button onClick={logoutHandler}>Logout</button>
      </header>
      <main className={styles.content}>
        <FileUpload />
      </main>
      <footer></footer>
    </>
  );
};

export default Home;
