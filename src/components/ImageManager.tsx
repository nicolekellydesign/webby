import { useState } from "react";
import {
  AiOutlineCheck,
  AiOutlineCheckCircle,
  AiOutlineDelete,
  AiOutlineUpload,
} from "react-icons/ai";
import DialogBox from "./DialogBox";
import IconButton, { DestructiveButton } from "./IconButton";

interface UploadImageElements extends HTMLFormControlsCollection {
  image: HTMLInputElement;
  submit: HTMLInputElement;
}

export interface UploadImageFormElement extends HTMLFormElement {
  readonly elements: UploadImageElements;
}

interface ImageManagerProps {
  images?: string[];
  label: string;
  title: string;
  uploadFunc: (image: File, imageName: string) => void;
  deleteImages: (images: string[]) => void;
}

const ImageManager = ({
  deleteImages,
  images,
  label,
  title,
  uploadFunc,
}: ImageManagerProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [imageFile, setImageFile] = useState<File>();
  const [isImagePicked, setIsImagePicked] = useState(false);

  const imageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files) {
      return;
    }

    setImageFile(files[0]);
    setIsImagePicked(true);
  };

  const handleUpload = (event: React.FormEvent<UploadImageFormElement>) => {
    event.preventDefault();

    if (!isImagePicked || !imageFile) {
      return;
    }

    const form = event.currentTarget;
    const { submit } = form.elements;
    submit.disabled = true;

    uploadFunc(imageFile, imageFile.name);

    setIsImagePicked(false);
    setImageFile(undefined);
    form.reset();
    submit.disabled = false;
  };

  return (
    <div className="mt-8 w-6xl">
      <h2 className="font-semibold text-left text-xl">{title}</h2>
      <ul className="border border-solid border-white flex flex-wrap gap-4 justify-start p-4 mt-4 rounded overflow-y-scroll min-h-64 max-h-screen ">
        {images?.map((image) => (
          <li
            className="bg-cover bg-center bg-no-repeat cursor-pointer flex flex-col justify-center w-64 h-64"
            data-src={`/images/${image}`}
            style={{
              backgroundImage: `url("/images/${image}")`,
            }}
          >
            {selected.some((name) => name === image) ? (
              <div
                className="opacity-70 bg-black hover:text-blue-400 relative flex-1 flex flex-col justify-center align-middle overflow-hidden transition"
                onClick={() => {
                  setSelected((selected) =>
                    selected.filter((name) => name !== image)
                  );
                }}
                title="Unselect image"
              >
                <div className="box-border font-bold text-lg mx-auto w-max">
                  <div className="w-max">
                    <AiOutlineCheckCircle className="w-12 h-12" />
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="opacity-0 hover:opacity-70 hover:bg-black relative flex-1 flex flex-col justify-center align-middle overflow-hidden transition"
                onClick={() => {
                  setSelected((selected) => selected.concat(image));
                }}
                title="Select image"
              >
                <div className="box-border font-bold text-lg mx-auto w-max">
                  <div className="w-max">
                    <AiOutlineCheck className="mx-auto w-12 h-12" />
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <form
          id="image-upload-form"
          onSubmit={handleUpload}
          className="flex flex-col items-start p-2"
        >
          <div className="text-left">
            <label htmlFor="image" className="pl-3 font-semibold">
              {label}
            </label>
            <br />
            <input
              type="file"
              accept="image/*"
              name="image"
              title="Only images allowed."
              onChange={imageChangeHandler}
              className="btn"
            />

            <div className="text-center text-xs pl-3 mb-6">
              <p>Max file size: 8 MB</p>
            </div>
          </div>

          <div className="flex gap-4 pl-3">
            <IconButton
              type="submit"
              name="submit"
              icon={<AiOutlineUpload />}
              text="Upload image"
            />
            {selected.length > 0 && (
              <div className="fade-in">
                <DestructiveButton
                  icon={<AiOutlineDelete />}
                  text="Delete selected"
                  onClick={() => {
                    setDialogOpen(true);
                  }}
                ></DestructiveButton>
              </div>
            )}
          </div>
        </form>
      </div>

      <DialogBox
        show={dialogOpen}
        type="warning"
        onClose={() => {
          setDialogOpen(false);
        }}
        onConfirm={() => {
          deleteImages(selected);
          setDialogOpen(false);
          setSelected([]);
        }}
      >
        <div className="flex-grow p-4">
          <h2 className="font-bold text-xl">
            Are you sure you want to delete {selected.length}{" "}
            {selected.length === 1 ? "image" : "images"}?
          </h2>
          <br />
          <p className="text-lg">This action cannot be reversed.</p>
        </div>
      </DialogBox>
    </div>
  );
};

export default ImageManager;