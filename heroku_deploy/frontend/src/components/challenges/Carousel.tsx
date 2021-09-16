import { useState } from 'react';

export const Carousel = (props: {
  picturesUrls: { file: string }[];
  className: string;
}) => {
  const [index, setIndex] = useState(0);

  function nextImage() {
    const currentIndex = index;
    setIndex(currentIndex + 1);
  }

  function previousImage() {
    const currentIndex = index;
    setIndex(currentIndex - 1);
  }

  return (
    <div className={props.className}>
      <img
        className="h-4/6 w-80 object-contain m-auto"
        alt="pattern"
        src={props.picturesUrls && props.picturesUrls[index].file}
      />
      <span className="text-center w-full">
        {index + 1}/{props.picturesUrls?.length || 0}
      </span>
      <div className="grid grid-cols-2 grid-rows-1 gap-0 divide-x divide-gray-500">
        <button
          disabled={index === 0}
          className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-700 disabled:opacity-50 rounded-l-full px-4 py-2"
          onClick={(_) => {
            previousImage();
          }}
        >
          Previous
        </button>
        <button
          disabled={
            !props.picturesUrls || index === props.picturesUrls.length - 1
          }
          className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-700 disabled:opacity-50 rounded-r-full px-4 py-2"
          onClick={(_) => {
            nextImage();
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};
