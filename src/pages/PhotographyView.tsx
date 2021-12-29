import React from "react";
import { useQuery } from "react-query";

import { LoadingCard } from "@Components/LoadingCard";
import { SmoothImage } from "@Components/SmoothImage";
import { alertService } from "@Services/alert.service";
import { Photo } from "../declarations";
import { PhotosQuery } from "../Queries";
import { Grid } from "@chakra-ui/react";

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
    <Grid gap={1} templateColumns={{ base: "repeat(1, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" }}>
      {photos && photos.map((photo, idx) => <SmoothImage key={idx} src={`/images/${photo}`} alt={photo} />)}
    </Grid>
  );
};
