import { useEffect, useState } from "react";
import { getPhotos, Photo } from "../entities/Photo";
import { alertService } from "../services/alert.service";

const Photography = (): JSX.Element => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photosLength] = useState(0);

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
