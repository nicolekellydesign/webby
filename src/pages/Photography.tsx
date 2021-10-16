import { useEffect, useState } from "react";
import { Photo } from "../entities/Photo";
import { alertService } from "../services/alert.service";

const Photography = (): JSX.Element => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photosLength] = useState(0);

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
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-1">
      {photos.map((photo) => {
        return (
          <div>
            <img
              src={`https://${window.location.hostname}/images/${photo.filename}`}
              alt={photo.filename}
              className="w-full h-auto"
            />
          </div>
        );
      })}
    </div>
  );
};

export default Photography;
