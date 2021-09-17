/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { useAuthUser } from 'react-auth-kit';

export type AttemptProps = {
  code: string;
  stderr: string;
  stdout: string;
  phase: string;
  status: string;
  time: number;
  time_wall: number;
  used_memory: number;
  csw_voluntary: number;
  csw_forced: number;
  createdAt: string;
};

export const AttemptsCarousel = (props: {
  attempts: AttemptProps[];
  className?: string;
  onLoadCode: (code: string) => void;
}) => {
  const [shownAttemptIndex, setShownAttemptIndex] = useState(0);

  const [showStderr, setShowStderr] = useState(false);
  const [showStdout, setShowStdout] = useState(false);

  const currentUser = useAuthUser();

  if (props.attempts.length === 0) {
    return (
      <div
        className={`h-full w-full bg-gray-600 rounded grid grid-flow-col grid-cols-8 grid-cols-1 p-4 ${props.className}`}
      >
        No attempt were made yet.
      </div>
    );
  }

  function changeAttempt(nbAttempts: number) {
    const currentIndex = shownAttemptIndex;

    setShownAttemptIndex(currentIndex + nbAttempts);
  }

  return (
    <>
      <div
        className={`h-full w-full bg-gray-600 rounded gap-4 p-4 grid grid-flow-col grid-cols-12 grid-rows-1 ${props.className}`}
      >
        <div className="grid grid-flow-col grid-rows-2 col-span-2">
          <div className="font-bold"> Attempted at : </div>
          <div className="">
            {new Date(
              props.attempts[shownAttemptIndex].createdAt,
            ).toUTCString() || 'N/A'}
          </div>
        </div>
        <div className="grid grid-flow-col grid-rows-2">
          <div className="font-bold"> Time : </div>
          <div className="">
            {' '}
            {props.attempts[shownAttemptIndex].time || 'N/A'}{' '}
          </div>
        </div>
        <div className="grid grid-flow-col grid-rows-2">
          <div className="font-bold"> Time wall : </div>
          <div className="">
            {' '}
            {props.attempts[shownAttemptIndex].time_wall || 'N/A'}{' '}
          </div>
        </div>
        <div className="grid grid-flow-col grid-rows-2">
          <div className="font-bold"> Used memory : </div>
          <div className="">
            {' '}
            {props.attempts[shownAttemptIndex].used_memory || 'N/A'}{' '}
          </div>
        </div>
        <div className="grid grid-flow-col grid-rows-2">
          <div className="font-bold"> CSW volontary : </div>
          <div className="">
            {' '}
            {props.attempts[shownAttemptIndex].csw_voluntary || 'N/A'}{' '}
          </div>
        </div>
        <div className="grid grid-flow-col grid-rows-2">
          <div className="font-bold"> CSW forced : </div>
          <div className="">
            {' '}
            {props.attempts[shownAttemptIndex].csw_forced || 'N/A'}{' '}
          </div>
        </div>

        <div className="grid grid-flow-col grid-rows-2 gap-2 align-center">
          <div className="font-bold"> Phase : </div>
          <div className="flex flex-cols">
            <div className="bg-green-500 rounded-full w-5 h-5" />
            <p className="px-2">
              {props.attempts[shownAttemptIndex].phase || 'N/A'}
            </p>
          </div>
        </div>

        <div></div>

        <div className="flex">
          <button
            className="bg-blue-500 hover:bg-blue-700 py-1 px-3 rounded-lg m-auto"
            onClick={(_) =>
              props.onLoadCode(props.attempts[shownAttemptIndex].code)
            }
          >
            Load code
          </button>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-flow-col grid-rows-2 gap-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 rounded m-auto w-full"
              onClick={() => setShowStdout(true)}
            >
              STDOUT
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 rounded m-auto w-full"
              onClick={() => setShowStderr(true)}
            >
              STDERR
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="grid grid-flow-col grid-rows-2 gap-2">
            <button
              disabled={shownAttemptIndex === 0}
              className="bg-blue-500 hover:bg-blue-700 rounded m-auto w-full disabled:bg-blue-700 disabled:opacity-50"
              onClick={() => changeAttempt(-1)}
            >
              <i className="fas fa-chevron-up ml-auto"></i>
            </button>
            <button
              disabled={
                !props.attempts ||
                shownAttemptIndex === props.attempts.length - 1
              }
              className="bg-blue-500 hover:bg-blue-700 rounded m-auto w-full disabled:bg-blue-700 disabled:opacity-50"
              onClick={() => changeAttempt(1)}
            >
              <i className="fas fa-chevron-down"></i>
            </button>
          </div>
        </div>
      </div>
      <div
        className={`transition-all duration-300 fixed bg-gray-900 flex ${
          showStdout
            ? 'opacity-100 z-20 h-screen w-screen top-0 left-0 bg-opacity-50'
            : 'opacity-0 z-0 h-0 w-0 inset-1/2 bg-opacity-0'
        }`}
        onClick={() => setShowStdout(false)}
      >
        <div className="relative h-3/4 w-3/4 bg-gray-600 rounded text-center z-50 m-auto overflow-hidden shadow-lg">
          <button
            className="absolute top-0 right-0 bg-blue-500 hover:bg-blue-700 py-1 px-3 rounded-bl-lg"
            onClick={(_) => setShowStdout(false)}
          >
            <i className="fas fa-times" />
          </button>
          <div className="h-full w-full flex overflow-y-scroll">
            <div className="m-auto whitespace-pre-line">
              {props.attempts[shownAttemptIndex].stdout ||
                'No output for this execution'}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-300 fixed bg-gray-900 flex ${
          showStderr
            ? 'opacity-100 z-20 h-screen w-screen top-0 left-0 bg-opacity-50'
            : 'opacity-0 z-0 h-0 w-0 inset-1/2 bg-opacity-0'
        }`}
        onClick={() => setShowStderr(false)}
      >
        <div className="relative h-3/4 w-3/4 bg-gray-600 rounded text-center z-50 m-auto overflow-hidden shadow-lg">
          <button
            className="absolute top-0 right-0 bg-blue-500 hover:bg-blue-700 py-1 px-3 rounded-bl-lg"
            onClick={(_) => setShowStderr(false)}
          >
            <i className="fas fa-times" />
          </button>
          <div className="h-full w-full flex overflow-y-scroll">
            <div className=" m-auto whitespace-pre-line">
              {props.attempts[shownAttemptIndex].stdout ||
                'No error for this execution'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
