import React, { useState } from 'react';

import { FileList } from '../../components';
import styles from './FileUpload.module.css';
import { BASE_URL } from '../../constants/data';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    event.target.value = null;
  };

  const handleUpload = async () => {
    setIsUploading(true);
    // Get current user
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const { userId } = user;

    // Construct form data
    const formData = new FormData();
    formData.append('file', file);

    // Send request to backend
    const response = await fetch(`${BASE_URL}/files/user/${userId}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      setFile(null);
    }

    setIsUploading(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles['file-input']}>
          <label htmlFor="file-upload" className={styles['input-label']}>
            Select a file
          </label>
          <span className={styles['file-name']}>{file ? file.name : ''}</span>
          <input
            id="file-upload"
            type="file"
            name="file"
            onChange={handleFileChange}
            className={styles['file-input']}
          />
        </div>

        <button
          onClick={handleUpload}
          className={styles['file-button']}
          disabled={!file}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <FileList filesChanged={file} />
    </>
  );
}

export default FileUpload;
