import { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

import { BASE_URL } from './constants/data';
import { Home, Logo } from './components';
import styles from './App.module.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Update user login status for initial load
  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  const loginHandler = async (googleResponse) => {
    const token = googleResponse.credential;
    const decoded = jwt_decode(token);

    const { name, email, picture } = decoded;

    // Construct object and save in backend
    const profileObj = { name, email, avatar: picture };

    // Save user in backend
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileObj),
    });

    const data = await response.json();

    if (response.status === 200) {
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...profileObj,
          userId: data._id,
        })
      );
      localStorage.setItem('token', `${token}`);
      setIsLoggedIn(true);
    } else {
      return Promise.reject();
    }
  };

  const logoutHandler = () => {
    const token = localStorage.getItem('token');

    if (token && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    googleLogout();
    setIsLoggedIn(false);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
      <div>
        {isLoggedIn ? (
          <Home onLogout={logoutHandler} />
        ) : (
          <main className={styles.container}>
            <Logo />
            <GoogleLogin
              theme="filled_blue"
              size="medium"
              onSuccess={loginHandler}
              onError={(error) => console.log(error)}
            />
          </main>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
