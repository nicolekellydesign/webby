import { useQuery } from "react-query";

import { LoadingCard } from "@Components/LoadingCard";
import { alertService } from "@Services/alert.service";
import { Photo } from "../declarations";
import { PhotosQuery } from "../Queries";

export const PhotographyView: React.FC = () => {
  const photosQuery = useQuery("photos", PhotosQuery);

  if (photosQuery.isLoading) {
    return <LoadingCard />;
  }

  if (photosQuery.isError) {
    console.error("Error fetching photos", photosQuery.error);
    alertService.error(`Error getting photos: ${photosQuery.error}`, false);
  }

  // Get the photos
  const photos = (photosQuery.data as Photo[]).flatMap((photo) => photo.filename);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-1">
      {console.info(typeof photos)}
      {photos &&
        photos.map((photo) => (
          <div>
            <img src={`/images/${photo}`} alt={photo} className="w-full h-auto" />
          </div>
        ))}
    </div>
  );
};
