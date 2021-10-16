import { useEffect, useState } from "react";
import * as AiIcons from "react-icons/ai";
import { Photo } from "../entities/Photo";
import { alertService } from "../services/alert.service";
import "./AdminPhotos.css";

const AdminPhotos = (): JSX.Element => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photosLength, setPhotosLength] = useState(0);

  const [selectedFile, setSelectedFile] = useState<File>();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files) {
      return;
    }

    setSelectedFile(files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    if (!isFilePicked || !selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile, selectedFile.name);

    fetch(`https://${window.location.hostname}/api/v1/admin/photos`, {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        const isJson = response.headers
          .get("Content-Type")
          ?.includes("application/json");
        const body = isJson && (await response.json());

        if (!response.ok) {
          const error = (body && body.message) || response.status;
          return Promise.reject(error);
        }

        alertService.success("Photo uploaded successfully!", false);

        setPhotosLength(photosLength + 1);
      })
      .then(() => {
        setIsFilePicked(false);
        setSelectedFile(undefined);
      })
      .catch((error) => {
        console.error(`error sending addPhoto request: ${error}`);
        alertService.error(`Error uploading photo: ${error}`, false);
      });
  };

  const deletePhoto = (filename: string) => {
    fetch(
      `https://${window.location.hostname}/api/v1/admin/photos/${filename}`,
      {
        method: "DELETE",
      }
    )
      .then(async (response) => {
        const isJson = response.headers
          .get("Content-Type")
          ?.includes("application/json");
        const body = isJson && (await response.json());

        if (!response.ok) {
          const error = (body && body.message) || response.status;
          return Promise.reject(error);
        }

        alertService.success("Photo deleted successfully!", false);

        setPhotosLength(photosLength + 1);
      })
      .catch((error) => {
        console.error(`error sending deletePhoto request: ${error}`);
        alertService.error(`Error removing photo: ${error}`, false);
      });
  };

  const getPhotos = () => {
    fetch(`https://${window.location.hostname}/api/v1/photos`, {
      method: "GET",
    })
      .then(async (response) => {
        const isJson = response.headers
          .get("Content-Type")
          ?.includes("application/json");
        const body = isJson && (await response.json());

        if (!response.ok) {
          const error = (body && body.message) || response.status;
          return Promise.reject(error);
        }

        setPhotos(body.photos);
      })
      .catch((error) => {
        console.error(`error getting user list: ${error}`);
        alertService.error(`Error getting photos: ${error}`, false);
      });
  };

  useEffect(() => {
    getPhotos();
  }, [photosLength]);

  return (
    <div className="container text-center mx-auto">
      <h1 className="font-bold text-5xl">Photography Gallery Settings</h1>
      <div className="max-w-max mx-auto my-8">
        <ul className="border border-solid border-white grid grid-cols-4 gap-4 p-4 rounded overflow-y-scroll max-h-screen">
          {photos.map((photo: Photo) => (
            <li className="thumb relative max-w-thumb">
              <img
                src={`https://${window.location.hostname}/images/${photo.filename}`}
                alt={photo.filename}
                className="opacity-100 block transition"
              />
              <div
                className="cursor-pointer absolute opacity-0 top-1/2 left-1/2 overlay transition w-full h-full"
                title="Delete Image"
                onClick={() => {
                  deletePhoto(photo.filename);
                }}
              >
                <AiIcons.AiOutlineClose className="absolute icon w-10 h-10" />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 p-2">
          <input
            type="file"
            name="file"
            onChange={changeHandler}
            className="btn rounded text-center"
          />
          <input
            type="button"
            name="submit"
            value="Submit"
            onClick={handleSubmission}
            className="btn rounded text-black text-center"
          />
        </div>
        <div className="text-xs mb-6">
          <p>Max file size: 8 MB</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPhotos;
