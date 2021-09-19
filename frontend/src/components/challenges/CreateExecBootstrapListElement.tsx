/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useEffect } from 'react';

export interface ExecBootstrap {
  _id?: string;
  language: string;
  tests: string;
  functionTemplate: string;
}

export const CreateExecBootstrapListElement = ({
  language,
  onRemove,
  onChange,
  initialValues,
}: {
  language: string;
  onRemove: () => void;
  onChange: (execBootstrap: ExecBootstrap) => void;
  initialValues?: ExecBootstrap;
}) => {
  const [tests, setTests] = useState(initialValues?.tests || '');

  const [functionTemplate, setFunctionTemplate] = useState(
    initialValues?.functionTemplate || '',
  );

  useEffect(() => {
    onChange({
      tests,
      functionTemplate,
      language,
      _id: initialValues?._id,
    });
  }, [tests, functionTemplate]);

  return (
    <div className="h-100 text-center bg-gray-600 rounded p-4 text-center relative overflow-hidden">
      <button
        className="absolute top-0 right-0 bg-blue-500 hover:bg-blue-700 py-1 px-3 rounded-bl-lg"
        onClick={(_) => onRemove()}
      >
        <i className="fas fa-times" />
      </button>
      <h2 className="text-lg mb-5">{language} implementation</h2>
      <div className="grid grid-rows-2 gap-4">
        <div>
          <h2 className="text-base mb-2">Tests implementations</h2>
          <div className="rounded-lg overflow-hidden flex flex-col justify-center items-center">
            <Editor
              language={language}
              defaultLanguage={language}
              height="40vh"
              // defaultValue="// some comment"
              onChange={(value) => {
                setTests(value as string);
              }}
              theme="vs-dark"
              value={tests}
            />
          </div>
        </div>
        <div>
          <h2 className="text-base mb-2">User function wireframe</h2>
          <div className="rounded-lg overflow-hidden flex flex-col justify-center items-center">
            <Editor
              language={language}
              defaultLanguage={language}
              height="40vh"
              // defaultValue="// some comment"
              onChange={(value) => {
                setFunctionTemplate(value as string);
              }}
              theme="vs-dark"
              value={functionTemplate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
