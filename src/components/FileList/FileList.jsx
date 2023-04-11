import React, { useEffect, useState } from 'react';
import download from 'downloadjs';

import { download as downloadFile } from '../../constants/images';
import styles from './FileList.module.css';

import { BASE_URL } from '../../constants/data';

const FileList = ({ filesChanged }) => {
  const [files, setFiles] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const getFiles = async () => {
      const user = JSON.parse(localStorage.getItem('user'));

      const { userId } = user;

      const response = await fetch(`${BASE_URL}/files/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setFiles(data);
      }
    };

    getFiles();
  }, [filesChanged]);

  const constructFileName = (name) => {
    let tokens = name.split('-');
    tokens.shift();
    return tokens.join('-');
  };

  const downloadHandler = async (id, name) => {
    const response = await fetch(`${BASE_URL}/files/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const blob = await response.blob();
    let fileName = constructFileName(name).slice(1);
    download(blob, fileName);
  };

  return (
    <div className={styles.container}>
      <h2>Hey {user.name.split(' ')[0]}, here are your files : </h2>

      <ul>
        {files.length === 0 ? (
          <p className={styles.empty}>No files found.</p>
        ) : (
          ''
        )}
        {files.map((file) => (
          <li
            key={file._id}
            onClick={downloadHandler.bind(null, file._id, file.name)}
            className={styles['file-link']}
          >
            <img src={downloadFile} alt="file icon" />
            <span>{constructFileName(file.name)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
