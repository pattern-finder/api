/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import Axios from '../axios-config';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';
import { Carousel } from '../components/challenges/Carousel';
import toast from 'react-hot-toast';
import {
  AttemptProps,
  AttemptsCarousel,
} from '../components/challenges/AttemptsCarousel';

type Challenge = {
  _id: string;
  name: string;
  instructions: string;
  pictures: { file: string }[];
  execBootstraps: {
    _id: string;
    tests: string;
    functionTemplate: string;
    language: string;
  }[];
};

export const ChallengePage = (props: {
  match: { params: { id: string; language: string } };
}) => {
  const [challenge, setChallenge] = useState({} as Challenge);
  const [code, setCode] = useState('');
  const [bootstrap, setBootstrap] = useState({} as { _id: string });

  const [attempts, setAttempts] = useState([] as AttemptProps[]);

  const [stdout, setStdout] = useState('STDOUT');
  const [stderr, setStderr] = useState('STDERR');

  const [startLine, setStartLine] = useState(0);

  const authHeader = useAuthHeader();
  const currentUser = useAuthUser();

  useEffect(() => {
    const fetchAttempts = async () => {
      const {
        data: { content },
      } = await Axios.get(
        `attempts/find-by-user-and-bootstrap/${currentUser()?.sub}/${
          bootstrap._id
        }`,
      );
      setAttempts(content);
    };

    if (bootstrap._id) {
      fetchAttempts();
    }
  }, [bootstrap._id, stdout]);

  useEffect(() => {
    const fetchChallenge = async (id: string) => {
      const {
        data: { content },
      } = await Axios.get(`/challenges/${id}`, {
        headers: { Authorization: authHeader() },
      });
      setChallenge(content);
      const bootstrap = (content as Challenge).execBootstraps.find(
        (eb) => eb.language === props.match.params.language,
      );
      setStartLine(bootstrap?.tests?.split('\n')?.length || 0);
      setBootstrap(bootstrap || ({} as { _id: string }));
    };

    fetchChallenge(props.match.params.id);
  }, [props.match.params.id]);

  useEffect(() => {
    const fetchChallenge = async (id: string) => {
      const {
        data: { content },
      } = await Axios.get(`/challenges/${id}`, {
        headers: { Authorization: authHeader() },
      });
      setChallenge(content);
      const bootstrap = (content as Challenge).execBootstraps.find(
        (eb) => eb.language === props.match.params.language,
      );
      setStartLine(bootstrap?.tests?.split('\n')?.length || 0);
      setBootstrap(bootstrap || ({} as { _id: string }));
    };

    fetchChallenge(props.match.params.id);
  }, [props.match.params.id]);

  useEffect(() => {
    const placeholder = challenge?.execBootstraps?.find(
      (eb) => eb.language === props.match.params.language,
    )?.functionTemplate;

    if (placeholder) {
      // setCodePlaceholder(placeholder);
      setCode(placeholder);
    }
  }, [challenge]);

  const runOnClick = () => {
    const toastId = toast.loading('Running code...');

    Axios.post(
      `/attempts`,
      {
        execBootstrap: bootstrap?._id,
        code,
      },
      {
        headers: {
          Authorization: authHeader(),
        },
      },
    )
      .then(({ data }) => {
        toast.success(`Successfully ran the code.`, {
          id: toastId,
        });

        setStderr(data.content.stderr);
        setStdout(data.content.stdout);
      })
      .catch((err) => {
        if (err.isAxiosError) {
          toast.error(`An error occured: ${err.response?.data.message}`, {
            id: toastId,
          });
        } else {
          toast.error(`An unknown error occured: ${err}`, { id: toastId });
        }
      });
  };

  return (
    <>
      <div className="py-6 flex flex-col justify-center">
        <div className="grid grid-cols-12 gap-2 rounded px-5 h-screen">
          <div className="bg-gray-600 rounded m-15 p-4 col-span-9">
            <div className="font-bold text-xl mb-2 flex flex-row">
              {challenge.name}
              <div className="bg-blue-500 py-1 px-2 rounded-full text-sm w-min ml-2">
                {props.match.params.language}
              </div>
            </div>
            <p>{challenge.instructions}</p>
          </div>
          <Carousel
            className="h-64 max-h-64 flex flex-col items-center bg-gray-600 rounded p-5 col-span-3"
            picturesUrls={challenge.pictures}
          />
          <div className="rounded-lg h-full overflow-hidden flex flex-col justify-center items-center col-span-6">
            <div className="relative max-h-full w-full">
              <Editor
                options={{
                  lineNumbers: (lineNumber: number) => {
                    return (lineNumber + startLine).toString();
                  },
                }}
                language={props.match.params.language}
                defaultLanguage={props.match.params.language}
                height="80vh"
                onChange={(value) => {
                  setCode(value as string);
                }}
                value={code}
                theme="vs-dark"
              />

              <button
                className="absolute bottom-0 right-0 bg-blue-500 px-2 rounded-tl-lg h-10 w-20 "
                onClick={runOnClick}
              >
                Run
              </button>
            </div>
          </div>
          <div className="h-auto w-full overflow-hidden rounded-lg col-span-6 divide-y-4 divide-gray-800 divide-dotted">
            <div className="bg-black max-h-1/2 h-1/2 p-2 w-full text-left font-light overflow-y-scroll">
              <span className="whitespace-pre-line">
                {stderr || "Aucune erreur durant l'execution de ce code."}
              </span>
            </div>
            <div className="bg-black max-h-1/2 h-1/2 p-2 w-full text-left font-light overflow-y-scroll">
              <span className="whitespace-pre-line">
                {stdout || "Aucune sortie après l'execution de ce code."}
              </span>
            </div>
          </div>
          <AttemptsCarousel
            onLoadCode={(code) => {
              setCode(code);
            }}
            className="col-span-12"
            attempts={attempts}
          />
        </div>
      </div>
    </>
  );
};
