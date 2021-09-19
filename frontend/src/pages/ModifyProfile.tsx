/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Axios from '../axios-config';
import icone from '../assets/profile-icon.png';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';

// import { ChallengeListitem } from '../components/ChallengeListItem';

type ProfileAttributes = {
  _id: string;
  username: string;
  email: string;
  avatarUrl: string;
};

export const ModifyProfile = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(undefined as unknown as File);
  const [currentImage, setCurrentImage] = useState('' as string);

  const getUser = useAuthUser();
  const getAuthToken = useAuthHeader();

  async function save() {
    const toastId = toast.loading('Updating user...');

    const params = new FormData();
    email && params.append('email', email);
    image && params.append('avatar', image);

    if (password) {
      if (password !== confirmPassword) {
        toast.error("Passwords don't match.", { id: toastId });
        return;
      } else {
        params.append('password', password);
      }
    }

    Axios.put('/users', params, {
      headers: {
        Authorization: getAuthToken(),
        'content-type': 'multipart/form-data',
      },
    })
      .then((_) => {
        toast.success('Profile modified successfully! :)', { id: toastId });
      })
      .catch((err) => {
        if (err.isAxiosError) {
          toast.error(`Could not update user : ${err.response.data.message}`, {
            id: toastId,
          });
        } else {
          toast.error(`Could not update user : ${err}`, { id: toastId });
        }
      });
  }

  useEffect(() => {
    Axios.get(`/users/${getUser()?.sub}`)
      .then(({ data }) => {
        const user: ProfileAttributes = data.content;
        setUsername(user.username);
        setEmail(user.email);
        setCurrentImage(user.avatarUrl);
      })
      .catch((err) => {
        if (err.isAxiosError) {
          toast.error(`Could not load profile: ${err.response.data.message}`);
        } else {
          toast.error(`Could not load profile: ${err}`);
        }
      });
  }, []);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    let file = image;

    if (e.target.files && e.target.files?.length > 0) {
      file = e.target.files[0];
    }

    setImage(file);
  }

  return (
    <div className="grid justify-items-center bg-gray-800 p-10">
      <div className="bg-gray-600 rounded h-min px-16 py-6 transition-all relative">
        <div className="h-auto text-center bg-gray-600 rounded p-5 flex flex-col items-center">
          {/*<div className="h-auto text-center bg-gray-600 rounded p-5">*/}
          <img
            alt="profile"
            className="max-h-full h-20 object-contain bg-cover bg-center mx-auto"
            src={(image && URL.createObjectURL(image)) || currentImage || icone}
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
        </div>
        <div className="flex flex-col items-start w-auto p-4">
          <label htmlFor="email">Email</label>
          <input
            className="text-black rounded-md py-1 px-2"
            type="text"
            name="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="flex flex-col items-start w-auto p-4">
          <label htmlFor="password">Password</label>
          <input
            className="text-black rounded-md py-1 px-2"
            type="password"
            name="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start w-auto p-4">
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            className="text-black rounded-md py-1 px-2"
            type="password"
            name="confirm-password"
            placeholder="confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                save();
              }
            }}
          />
        </div>

        <div className="w-full flex p-6">
          <button
            onClick={(e) => save()}
            type="button"
            className="bg-blue-500 hover:bg-blue-700 rounded-lg px-6 py-2 m-auto"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
