import React from 'react';
import { logo } from '../../constants/images';

import styles from './Logo.module.css';

const Logo = ({ className: classes }) => {
  return (
    <div className={`${styles.logo} ${classes}`}>
      <img src={logo} alt="File Management" />
      <span className={styles['logo-text']}>File Management</span>
    </div>
  );
};

export default Logo;
