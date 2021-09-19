type PictureProps = {
  image: string | File;
  onRemoveImage: () => void;
};

export const Picture = ({ image, onRemoveImage }: PictureProps) => {
  return (
    <div className="h-100 text-center bg-gray-600 rounded p-4 text-center relative overflow-hidden">
      <button
        className="absolute top-0 right-0 bg-blue-500 hover:bg-blue-700 py-1 px-3 rounded-bl-lg"
        onClick={(_) => onRemoveImage()}
      >
        <i className="fas fa-times" />
      </button>
      <h2 className="text-lg">
        {typeof image !== 'string' ? image.name : 'Uploaded'}
      </h2>
      <div className="flex h-full">
        <img
          alt="user defined"
          className="w-full max-h-full object-contain m-auto pb-4"
          src={typeof image !== 'string' ? URL.createObjectURL(image) : image}
        />
      </div>
    </div>
  );
};
