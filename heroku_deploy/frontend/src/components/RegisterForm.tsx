import React from 'react';
import { useState } from 'react';
import Axios from '../axios-config';
import toast from 'react-hot-toast';
import picspyLogo from '../assets/PicSpyLogo.png';
import icone from '../assets/profile-icon.png';

export const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(undefined as unknown as File);

  function createUser() {
    const toastId = toast.loading('Creating user...');

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.', { id: toastId });
      return;
    }

    const params = new FormData();
    email && params.append('username', username);
    image && params.append('email', email);
    image && params.append('password', password);
    image && params.append('avatar', image);

    Axios.post('/users', params, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
      .then((_) => {
        toast.success('User created !', { id: toastId });
        window.location.reload();
      })
      .catch(
        ({
          response: {
            data: { message },
          },
        }) => {
          toast.error(`Could not register: ${message}`, { id: toastId });
        },
      );
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    let file = image;

    if (e.target.files && e.target.files?.length > 0) {
      file = e.target.files[0];
    }

    setImage(file);
  }

  return (
    <div className="base-container">
      <div className="content">
        <div className="image h-32">
          <img className="object-contain" alt="login" src={picspyLogo} />
        </div>
        <div className="header text-center">Register</div>
        <div className="form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              className="text-black"
              type="text"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <img
            alt="profile"
            className="max-h-full h-20 object-contain bg-cover bg-center mx-auto"
            src={(image && URL.createObjectURL(image)) || icone}
          />
          <div className="text-2xl font-bold text-center mb-8">{username}</div>

          <label className="w-32 flex flex-col items-center p-5 bg-blue-500 hover:bg-blue-700 rounded-md shadow-md tracking-wide cursor-pointer">
            <i className="fas fa-cloud-upload-alt fa-2x"></i>
            <span className="mt-2 text-base ">Browse for an avatar</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onFileChange}
            />
          </label>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              className="text-black"
              type="text"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              className="text-black"
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Confirm password</label>
            <input
              className="text-black"
              type="password"
              placeholder="confirm-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  createUser();
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="footer">
        <button
          type="button"
          className="bg-blue-500 rounded-lg px-6 py-2"
          onClick={(_) => createUser()}
        >
          Register
        </button>
      </div>
    </div>
  );
};
