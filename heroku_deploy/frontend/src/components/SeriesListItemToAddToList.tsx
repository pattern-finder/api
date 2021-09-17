import React, { useState } from 'react';
import picspyLogo from '../assets/PicSpyLogo.png';
import { Link } from 'react-router-dom';

interface SeriesAttributes {
  _id: string;
  name: string;
  done: boolean;
  owner: string;
}

export const SeriesListitem = ({
  serie: { _id, name },
}: {
  serie: SeriesAttributes;
}) => {
  // eslint-disable-next-line
  const [user, setUser] = useState(
    {} as { username: string; avatarUrl?: string; _id: string },
  );

  return (
    <div className="w-full bg-gray-600 rounded" id={`${_id}`}>
      <div className="grid grid-cols-2 gap-4 rounded  ">
        <div className="rounded m-15 px-4 py-2 col-span-2">
          <div className="image">
            <div className="Name">
              <h2> {name} </h2>
            </div>
          </div>
          <div className="flex flex-row mt-4 text-sm">
            <div>
              <div className="flex flex-row grid-cols-8 gap-2 w-full">
                <Link
                  to={{
                    pathname: `/view/challengesSeries/idseries=${_id}`,
                  }}
                >
                  <button
                    id={`bpAdd${name}`}
                    className=" top-0 right-0 bg-blue-500 px-2 rounded-bl-lg h-10 w-20 hover:bg-blue-700 "
                  >
                    View challenge
                  </button>
                </Link>
              </div>
            </div>

            <div className="ml-auto flex flex-row text-sm ">
              <div className="my-auto">Created by {user.username}</div>
              <img
                className=" max-h-full h-8 object-contain"
                src={user.avatarUrl || picspyLogo}
                alt="profile pic"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
