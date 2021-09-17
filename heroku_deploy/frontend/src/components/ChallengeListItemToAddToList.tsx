import React, { useState } from 'react';
import picspyLogo from '../assets/PicSpyLogo.png';
import { Link } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';

interface ChallengeAttributes {
  _id: string;
  name: string;
  instructions: string;
  execBootstraps: { language: string }[];
  imageUrl: string;
  done: boolean;
  owner: string;
}
var listChallengeId: string[] = [];

export const ChallengeListitem = ({
  challenge: { _id, name, instructions, execBootstraps, owner },
}: {
  challenge: ChallengeAttributes;
}) => {
  const getUserSession = useAuthUser();
  const [user] = useState(
    {} as { username: string; avatarUrl?: string; _id: string },
  );

  const runOnClickAdd = (bpAddName: string, bpRmName: string, id: string) => {
    listChallengeId.push(id);
    var bpAdd = document.getElementById(bpAddName);
    var bpRm = document.getElementById(bpRmName);
    var challege = document.getElementById(id);

    if (challege != null) {
      challege.classList.add('itemAdd');
    }

    if (bpAdd != null && bpRm != null && challege != null) {
      bpAdd.classList.add('hidden');
      bpAdd.classList.add('hidden');

      bpRm.classList.remove('hidden');

      challege.classList.add('bg-green-600');
      challege.classList.remove('bg-gray-600');
    }
  };

  const runOnClickRemove = (
    bpAddName: string,
    bpRmName: string,
    id: string,
  ) => {
    var pos = listChallengeId.indexOf(id);
    listChallengeId.splice(pos, 1);

    var bpAdd = document.getElementById(bpAddName);
    var bpRm = document.getElementById(bpRmName);
    var challege = document.getElementById(id);

    if (challege != null) {
      challege.classList.remove('itemAdd');
    }

    if (bpAdd != null && bpRm != null && challege != null) {
      bpAdd.classList.remove('hidden');
      bpRm.classList.add('hidden');

      challege.classList.add('bg-gray-600');
      challege.classList.remove('bg-green-600');
    }
  };

  return (
    <div className="w-full bg-gray-600 rounded" id={`${_id}`}>
      <div className="grid grid-cols-2 gap-4 rounded  ">
        <div className="rounded m-15 px-4 py-2 col-span-2">
          <div className="image">
            <div className="Name">
              <h2> {name} </h2>
            </div>

            <div className="overflow-hidden">
              {`${instructions.substring(0, 64)}...`}
            </div>
          </div>
          <div className="flex flex-row mt-4 text-sm">
            <div>
              <div className="flex flex-row grid-cols-8 gap-2 w-full">
                <button
                  id={`bpAdd${name}`}
                  className=" top-0 right-0 bg-blue-500 px-2 rounded-bl-lg h-10 w-20 hover:bg-blue-700 "
                  onClick={() =>
                    runOnClickAdd(`bpAdd${name}`, `bpRm${name}`, `${_id}`)
                  }
                >
                  Add
                </button>

                <button
                  id={`bpRm${name}`}
                  className=" top-0 right-0 bg-blue-500 px-2 rounded-bl-lg h-10 w-20  hover:bg-blue-700 hidden"
                  onClick={() =>
                    runOnClickRemove(`bpAdd${name}`, `bpRm${name}`, `${_id}`)
                  }
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="ml-auto flex flex-row text-sm ">
              <div className="my-auto">Created by {user.username}</div>
              <img
                className=" max-h-full h-8 object-contain"
                src={user.avatarUrl || picspyLogo}
                alt="profile pic"
              />
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
