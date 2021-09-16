import React from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Axios from '../axios-config';
import icone from '../assets/profile-icon.png';
import { ChallengeListitem } from '../components/ChallengeListItem';

type ProfileAttributes = {
  _id: string;
  username: string;
  email: string;
  avatarUrl: string;
};

type ListChallengeEntity = {
  _id: string;
  name: string;
  instructions: string;
  execBootstraps: { language: string }[];
  imageUrl: string;
  done: boolean;
  owner: string;
};

export const Profile = (props: { match: { params: { id: string } } }) => {
  const [user, setUser] = useState({} as ProfileAttributes);
  const [challenges, setChallenges] = useState([] as ListChallengeEntity[]);

  useEffect(() => {
    const fetchUser = async () => {
      Axios.get(`/users/${props.match.params.id}`)
        .then(({ data }) => {
          setUser(data.content);
        })
        .catch((err) => {
          if (err.isAxiosError) {
            toast.error(`Could not load profile: ${err.response.data.message}`);
          } else {
            toast.error(`Could not load profile: ${err}`);
          }
        });
    };

    fetchUser();
  }, [props.match.params.id]);

  useEffect(() => {
    const fetchChallenges = async () => {
      Axios.get('/challenges')
        .then(({ data }) => {
          data.content.forEach((c: ListChallengeEntity[]) => {
            const chList = data.content.filter(
              (ch: ListChallengeEntity) =>
                ch.owner === `users/${props.match.params.id}`,
            );
            setChallenges(chList);
          });
        })
        .catch((err) => {
          if (err.isAxiosError) {
            toast.error(
              `Could not load challenges: ${err.response?.data.message}`,
            );
          } else {
            toast.error(`Could not load challenges: ${err}`);
          }
        });
    };

    fetchChallenges();
  }, [props.match.params.id]);

  return (
    <div className="h-auto w-full grid grid-flow-col grid-cols-12 gap-4 mb-4">
      <div className="grid grid-flow-row grid-rows-5 gap-4 bg-gray-600 col-span-2 rounded m-4">
        <div className=" rounded h-min px-16 py-6">
          <img
            alt="profile"
            className="max-h-full h-20 object-contain bg-cover bg-center mx-auto"
            src={user.avatarUrl || icone}
          />
        </div>
        <div className="">
          <div className="m-4">
            <div className="font-bold">Username :</div>
            <div className="">{user?.username}</div>
          </div>
          <div className="m-4">
            <div className="font-bold">Email :</div>
            <div className="">{user?.email}</div>
          </div>
        </div>
      </div>
      <div className="grid col-span-7 rounded m-4">
        <div className="grid row-span-3 bg-gray-600 col-span-7 rounded m-4">
          Progression
        </div>
        <div className="grid row-span-2 bg-gray-600 col-span-7 rounded m-4">
          Statistiques
        </div>
      </div>
      <div className="grid grid-flow-row grid-rows-5 gap-4 bg-gray-600 col-span-3 rounded m-4">
        {challenges.map((challenge, index) => (
          <ChallengeListitem challenge={challenge} key={`challenge-${index}`} />
        ))}
      </div>
    </div>
  );
};
