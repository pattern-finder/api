import React, { useEffect, useState } from 'react';
import { useAuthHeader } from 'react-auth-kit';
// import '../components/style.scss';
import { useHistory } from 'react-router-dom';
import Axios from '../axios-config';
import toast from 'react-hot-toast';
import { ChallengeListitem } from '../components/SeriesEditChallengeListItem';
import { ChallengeAttributes } from '../components/ChallengeListItem';

export const CreateSeries = (props: {
  match?: { params?: { id?: string } };
}) => {
  const [name, setName] = useState('');
  const [challenges, setChallenges] = useState([] as ChallengeAttributes[]);
  const [selectedChallengesIds, setSelectedChallengesIds] = useState(
    [] as string[],
  );
  const history = useHistory();

  const getAuthToken = useAuthHeader();

  //load existing challenge \if exists
  useEffect(() => {
    if (!props.match?.params?.id) {
      return;
    }
    const id = props.match?.params?.id;

    Axios.get(`/series/${id}`)
      .then(({ data }) => {
        setName(data.content.name);
        setSelectedChallengesIds(
          data.content.challenges.map((c: { _id: string }) => c._id),
        );
      })
      .catch((err) => {
        toast.error(`Failed to load serie with id: ${id} \n ${err}`);
      });
  }, [props.match?.params?.id]);

  useEffect(() => {
    const fetchChallenges = async () => {
      Axios.get('/challenges')
        .then(({ data }) => {
          setChallenges(data.content);
        })
        .catch((err) => {
          toast.error(`Could not load challenges: ${err}`);
        });
    };

    fetchChallenges();
  }, []);

  async function updateSeries(
    challenges: string[],
    id: string = props.match?.params?.id || '',
  ) {
    const toastId = toast.loading('Adding challenges...');
    Axios.put(
      `/series`,
      {
        _id: id,
        challenges: challenges.map((c) => {
          return { _id: c };
        }),
      },
      {
        headers: {
          Authorization: getAuthToken(),
          'content-type': 'application/json',
        },
      },
    )
      .then((_) => {
        toast.success(`Successfully added series ${name}!`, {
          id: toastId,
        });
        let url = '/series';
        history.push(url);
      })
      .catch((err) => {
        toast.error(
          `Could not update series: ${
            err.response.data.message || 'An unknown error occured'
          }`,
          { id: toastId },
        );
      });
  }

  async function postSerie() {
    const toastId = toast.loading('Sending Series...');
    Axios.post(
      `/series`,
      { name },
      {
        headers: {
          Authorization: getAuthToken(),
          'content-type': 'application/json',
        },
      },
    )
      .then(({ data: { content } }) => {
        toast.success(`Successfully added series ${name}!`, {
          id: toastId,
        });
        const series_id = content._id;
        updateSeries(selectedChallengesIds, series_id);
      })
      .catch((err) => {
        toast.error(
          `Could not create series: ${
            err.response.data.message || 'An unknown error occured'
          }`,
          { id: toastId },
        );
      });
  }

  return (
    <>
      <div className="grid grid-cols-5 gap-4 rounded m-5 p-10">
        <div className="col-span-5 bg-gray-600 rounded p-10 pt-8 relative overflow-hidden">
          <button
            className="absolute top-0 right-0 bg-blue-500 hover:bg-blue-700 py-2 px-3 rounded-bl-lg text-lg"
            onClick={() =>
              props.match?.params?.id
                ? updateSeries(selectedChallengesIds, props.match.params.id)
                : postSerie()
            }
          >
            Save
          </button>
          <h1 className="text-3xl">Create your own challenge serie</h1>
          <div className="mt-2 flex flex-col items-start">
            <div className="flex flex-col items-start w-auto p-4">
              <label className="text-lg" htmlFor="username">
                Name
              </label>
              <input
                className="text-black rounded-md py-1 px-2"
                type="text"
                name="name"
                placeholder="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded m-5 p-10">
        <div className="h-auto text-center bg-#f3f3f3-600 rounded p-5 flex flex-col items-center col-span-2">
          <div className="grid grid-cols-3 gap-4 m-5" id="listChallenge">
            {selectedChallengesIds.length === 0 && (
              <span>There is no selected challenge.</span>
            )}
            {challenges
              .filter((c) => selectedChallengesIds.includes(c._id))
              .map((challenge, index) => (
                <ChallengeListitem
                  onClick={(_id) =>
                    setSelectedChallengesIds([
                      ...selectedChallengesIds.filter((id) => id !== _id),
                    ])
                  }
                  challenge={challenge}
                  key={`challenge-${index}`}
                  selected
                />
              ))}
          </div>
          <h2 className="text-lg mb-5">Add a challenge</h2>
          <div className="grid grid-cols-3 gap-4 m-5" id="listChallenge">
            {challenges.length === 0 && (
              <span>All challenges are selected.</span>
            )}
            {challenges
              .filter((c) => !selectedChallengesIds.includes(c._id))
              .map((challenge, index) => (
                <ChallengeListitem
                  onClick={(_id) =>
                    setSelectedChallengesIds([...selectedChallengesIds, _id])
                  }
                  challenge={challenge}
                  key={`challenge-${index}`}
                />
              ))}
          </div>
          <div className="rounded-lg overflow-hidden grid grid-cols-1 gap-1 w-2/6 m-auto"></div>
        </div>
      </div>
    </>
  );
};
