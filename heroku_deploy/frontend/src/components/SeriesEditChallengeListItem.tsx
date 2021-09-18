import React, { useEffect, useState } from 'react';
import picspyLogo from '../assets/PicSpyLogo.png';
import { Link } from 'react-router-dom';
import noProfilePic from '../assets/profile-icon.png';

import axios from 'axios';
import toast from 'react-hot-toast';

interface ChallengeAttributes {
  _id: string;
  name: string;
  instructions: string;
  execBootstraps: { language: string }[];
  imageUrl: string;
  done: boolean;
  owner: string;
  isCourse: boolean;
}

export const ChallengeListitem = ({
  challenge: { _id, name, instructions, execBootstraps, owner, isCourse },
  selected,
  onClick,
}: {
  challenge: ChallengeAttributes;
  selected?: boolean;
  onClick: (challengeId: string) => void;
}) => {
  const [user, setUser] = useState(
    {} as { username: string; avatarUrl?: string; _id: string },
  );

  useEffect(() => {
    axios
      .get(owner)
      .then(({ data }) => {
        setUser(data.content);
      })
      .catch((err) => {
        toast.error(`Could not load owner: ${err}`);
      });
  }, [owner]);

  return (
    <div className="relative">
      {selected ? (
        <button
          className="bg-blue-500 rounded-tr-lg absolute hover:bg-blue-700 p-2  bottom-0 left-0"
          onClick={() => onClick(_id)}
        >
          <i className="fas fa-minus pr-2"></i>
        </button>
      ) : (
        <button
          className="bg-blue-500 rounded-br-lg absolute hover:bg-blue-700 p-2  top-0 left-0"
          onClick={() => onClick(_id)}
        >
          <i className="fas fa-plus pr-2"></i>
        </button>
      )}

      <div className="w-full h-full bg-gray-600 rounded p-10">
        <h2 className="text-lg font-bold"> {name} </h2>

        <div className="overflow-hidden">
          {`${instructions.substring(0, 64)}...`}
        </div>

        <div className="flex flex-row mt-4 text-sm">
          <div className="ml-auto flex flex-row text-sm ">
            {isCourse ? (
              <>
                <img
                  className=" max-h-full h-8 object-contain"
                  src={picspyLogo}
                  alt="profile pic"
                />
              </>
            ) : (
              <Link
                to={`/profile/${user._id}`}
                className="flex flex-row text-sm"
              >
                <div className="my-auto">Created by {user.username}</div>
                <img
                  className=" max-h-full h-8 object-contain"
                  src={user.avatarUrl || noProfilePic}
                  alt="profile pic"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
