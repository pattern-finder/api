import React from 'react';
import picspyLogo from '../assets/PicSpyLogo.png';
import { useSignIn } from 'react-auth-kit';
import { useState } from 'react';
import Axios from '../axios-config';
import toast from 'react-hot-toast';
import { Redirect } from 'react-router-dom';

export const LoginForm = () => {
  const signIn = useSignIn();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function login() {
    const toastId = toast.loading('Logging in...');
    Axios.post('/auth/login', { username, password })
      .then(
        ({
          data: {
            content: { access_token },
          },
        }) => {
          // const header: { alg: string, typ: string } = JSON.parse(atob(access_token.split('.')[0]))
          const userInfo: { username: string; sub: string; iat: number } =
            JSON.parse(atob(access_token.split('.')[1]));
          if (
            signIn({
              token: access_token,
              expiresIn: userInfo.iat,
              tokenType: 'Bearer',
              authState: userInfo,
            })
          ) {
            setRedirect(true);
            toast.success(`Logged in successfuly as ${username} !`, {
              id: toastId,
            });
          } else {
            throw new Error('Could not login.');
          }
        },
      )
      .catch((err) => {
        if (err.isAxiosError) {
          toast.error(`Could not login: ${err.response?.data.message}`, {
            id: toastId,
          });
        } else {
          toast.error(`Could not login: ${err}`, { id: toastId });
        }
      });
  }

  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <div className="base-container">
      <div className="content">
        <div className="image h-32">
          <img className="object-contain" alt="Login" src={picspyLogo} />
        </div>
        <div className="header text-center">Login</div>
        <div className="form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              className="text-black"
              type="text"
              name="username"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  login();
                }
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              className="text-black"
              type="password"
              name="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  login();
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="footer">
        {/* <Link to="/" className="nav-links"> */}
        <button
          onClick={(e) => login()}
          type="button"
          className="bg-blue-500 rounded-lg px-6 py-2"
        >
          Login
        </button>
        {/* </Link> */}
      </div>
    </div>
  );
};
