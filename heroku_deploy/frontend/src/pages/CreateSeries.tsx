import React, { useEffect, useState } from 'react';
import { useAuthHeader } from 'react-auth-kit';
import '../components/style.scss';
import { useHistory } from 'react-router-dom';
import Axios from '../axios-config';
import toast from 'react-hot-toast';
import { ExecBootstrap } from '../components/challenges/CreateExecBootstrapListElement';
import { ChallengeListitem } from '../components/ChallengeListItemToAddToList';

export const CreateSeries = (props: {
  match?: { params?: { id?: string } };
}) => {
  const [name, setName] = useState('');
  const [challenges, setChallenges] = useState([]);
  // eslint-disable-next-line
  const [instructions, setInstructions] = useState('');
  // eslint-disable-next-line
  const [bootstraps, setBootstraps] = useState(
    {} as Record<string, ExecBootstrap>,
  );
  const history = useHistory();

  const getAuthToken = useAuthHeader();

  //load existing challenge if exists
  useEffect(() => {
    if (!props.match?.params?.id) {
      return;
    }
    const id = props.match?.params?.id;

    Axios.get(`/challenges/${id}`)
      .then(({ data }) => {
        setName(data.content.name);
        setInstructions(data.content.instructions);

        const bootstrapsObject = {} as Record<string, ExecBootstrap>;
        data.content.execBootstraps.forEach((bs: ExecBootstrap) => {
          bootstrapsObject[bs.language] = bs;
        });
        setBootstraps(bootstrapsObject);
      })
      .catch((err) => {
        toast.error(`Failed to load challenge with id: ${id} \n ${err}`);
      });
  }, [props.match?.params?.id]);

  useEffect(() => {
    const fetchChallenges = async () => {
      Axios.get('/challenges')
        .then(({ data }) => {
          setChallenges(data.content);
        })
        .catch((err) => {
          toast.error(`Could not load challegnes: ${err}`);
        });
    };

    fetchChallenges();
  }, []);

  async function updateSeries(json: Object) {
    Axios.put(`/series`, json, {
      headers: {
        Authorization: getAuthToken(),
        'content-type': 'application/json',
      },
    })
      .then((_) => {
        let url = '/series';
        history.push(url);
      })
      .catch((err) => {});
  }

  async function postSerie() {
    const params = new FormData();
    params.append('name', name);

    var json = {
      name: name,
    };

    const toastId = toast.loading('Sending Series...');
    Axios.post(`/series`, json, {
      headers: {
        Authorization: getAuthToken(),
        'content-type': 'application/json',
      },
    })
      .then(({ data: { content } }) => {
        toast.success(`Successfully add series!`, {
          id: toastId,
        });
        var list = document.getElementsByClassName('itemAdd');
        const elements = Array.from(list);

        var idSerie = content._id;

        var tabChalenge = '[';

        var first = true;
        for (let i = 0; i < elements.length; i++) {
          var virgule = ',';

          if (first) {
            first = false;
            virgule = '';
          }

          tabChalenge =
            tabChalenge + virgule + '{"_id":"' + elements[i].id + '"}';
        }
        tabChalenge = tabChalenge + ']';
        var jsonSaveChallenge =
          '{"_id":"' + idSerie + '", "challenges":' + tabChalenge + '}';
        var jsonObject = JSON.parse(jsonSaveChallenge);

        updateSeries(jsonObject);
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
            onClick={() => postSerie()}
          >
            Save
          </button>
          <h1 className="text-3xl">Create your own serie</h1>
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
          <h2 className="text-lg mb-5">Add a challenge</h2>
          <div className="grid grid-cols-3 gap-4 m-5" id="listChallenge">
            {challenges.length === 0 && <span>Nothing to show here.</span>}
            {challenges.map((challenge, index) => (
              <ChallengeListitem
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
