import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Axios from '../axios-config';
import { ChallengeListitem } from '../components/ChallengeListItem';

export const ChallengeListPage = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      Axios.get('/challenges')
        .then(({ data }) => {
          setChallenges(data.content);
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
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 m-5">
        {challenges.length === 0 && <span>Nothing to show here.</span>}
        {challenges.map((challenge, index) => (
          <ChallengeListitem challenge={challenge} key={`challenge-${index}`} />
        ))}
      </div>
    </>
  );
};
