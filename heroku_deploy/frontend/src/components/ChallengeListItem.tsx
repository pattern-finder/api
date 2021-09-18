import React, { useEffect, useState } from 'react';
import picspyLogo from '../assets/PicSpyLogo.png';
import noProfilePic from '../assets/profile-icon.png';
import { Link } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface ChallengeAttributes {
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
}: {
  challenge: ChallengeAttributes;
}) => {
  const getUserSession = useAuthUser();
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
    <div className="w-full bg-gray-600 rounded shadow-lg">
      <div className="grid grid-cols-2 gap-4 rounded h-full">
        <div className="rounded m-15 px-4 py-2 col-span-2 flex flex-col">
          <h2 className="font-bold"> {name} </h2>
          <div className="overflow-hidden h-auto">
            {`${instructions.substring(0, 64)}...`}
          </div>
          <div className="flex flex-row mt-4 text-sm mt-auto pt-4">
            <div className="flex flex-row grid-cols-8 gap-2 w-full">
              {(execBootstraps || []).map((bs) => (
                <Link to={`/challenges/${_id}/${bs.language}`}>
                  <div className="grid grid-rows-1 grid-cols-1 gap-4 rounded-full px-2 py-1 bg-blue-500 hover:bg-blue-700">
                    <span className="text-center">{bs.language}</span>
                    {/* {false ? (
                        <i className="fas fa-check pl-2" />
                      ) : (
                        <i className="fas fa-times pl-2" />
                      )} */}
                  </div>
                </Link>
              ))}
            </div>

            <div className="ml-auto flex flex-row text-sm">
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

              {user._id === getUserSession()?.sub && (
                <Link to={`/edit/challenge/${_id}`}>
                  <div className="rounded-lg px-2 py-1 ml-2 bg-blue-500 hover:bg-blue-700">
                    <i className="fas fa-edit"></i>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
