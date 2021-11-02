import { useEffect, useState } from "react";
import * as AiIcons from "react-icons/ai";
import IconButton from "../../components/IconButton";
import { addPhoto, deletePhoto, getPhotos, Photo } from "../../entities/Photo";
import { alertService } from "../../services/alert.service";
import "./Photos.css";

interface UploadImageElements extends HTMLFormControlsCollection {
  image: HTMLInputElement;
  submit: HTMLInputElement;
}

interface UploadImageFormElement extends HTMLFormElement {
  readonly elements: UploadImageElements;
}

const AdminPhotos = (): JSX.Element => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photosLength, setPhotosLength] = useState(0);

  const [selectedFile, setSelectedFile] = useState<File>();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const imageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files) {
      return;
    }

    setSelectedFile(files[0]);
    setIsFilePicked(true);
  };

  const uploadImage = (event: React.FormEvent<UploadImageFormElement>) => {
    event.preventDefault();

    if (!isFilePicked || !selectedFile) {
      return;
    }

    const form = event.currentTarget;
    const { submit } = form.elements;
    submit.disabled = true;

    addPhoto(selectedFile, selectedFile.name)
      .then(() => {
        alertService.success("Photo uploaded successfully!", false);
        setPhotosLength(photosLength + 1);
      })
      .catch((error) => {
        console.error(`error adding photography gallery item: ${error}`);
        alertService.error(`Error uploading photo: ${error}`, false);
      })
      .finally(() => {
        setIsFilePicked(false);
        setSelectedFile(undefined);
        form.reset();
        submit.disabled = false;
        window.scrollTo(0, 0);
      });
  };

  useEffect(() => {
    getPhotos()
      .then((photos) => {
        setPhotos(photos);
      })
      .catch((error) => {
        console.error(`error getting photography images: ${error}`);
        alertService.error(`Error getting photos: ${error}`, false);
      });
  }, [photosLength]);

  return (
    <div className="container text-center mx-auto">
      <h1 className="font-bold text-5xl">Photography Gallery Settings</h1>
      <div className="max-w-max mx-auto my-8">
        <ul className="border border-solid border-white grid grid-cols-4 gap-4 p-4 rounded overflow-y-scroll max-h-screen">
          {photos.map((photo: Photo) => (
            <li className="thumb relative max-w-thumb">
              <img
                src={`/images/${photo.filename}`}
                alt={photo.filename}
                className="opacity-100 block transition"
              />
              <div
                className="cursor-pointer absolute flex items-center justify-center opacity-0 top-1/2 left-1/2 overlay transition w-full h-full"
                onClick={() => {
                  deletePhoto(photo.filename)
                    .then(() => {
                      alertService.success(
                        "Photo deleted successfully!",
                        false
                      );
                      setPhotosLength(photosLength + 1);
                    })
                    .catch((error) => {
                      console.error(
                        `error removing photography gallery item: ${error}`
                      );
                      alertService.error(
                        `Error removing photo: ${error}`,
                        false
                      );
                    });
                }}
              >
                <div className="font-bold text-lg w-max">
                  <AiIcons.AiOutlineClose className="mx-auto w-8 h-8" />
                  Delete image
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 p-2">
          <form
            id="image-upload-form"
            onSubmit={uploadImage}
            className="mt-4 p-2"
          >
            <label htmlFor="image" className="pl-3 font-semibold">
              Add project image
            </label>
            <br />
            <input
              type="file"
              accept="image/*"
              name="image"
              title="Only images allowed."
              onChange={imageChangeHandler}
              className="btn rounded text-center"
            />
            <IconButton
              type="submit"
              name="submit"
              icon={<AiIcons.AiOutlineUpload />}
              text="Upload image"
            />
          </form>
        </div>
        <div className="text-xs mb-6">
          <p>Max file size: 8 MB</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPhotos;
