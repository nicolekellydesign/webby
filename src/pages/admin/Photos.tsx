import axios, { AxiosError } from "axios";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Container, Heading } from "@chakra-ui/react";

import { ImageManager } from "@Components/ImageManager";
import { LoadingCard } from "@Components/LoadingCard";
import { alertService } from "@Services/alert.service";
import { APIError, Photo } from "../../declarations";
import { PhotosQuery } from "../../Queries";

export const AdminPhotos: React.FC = () => {
  const queryClient = useQueryClient();
  const photosQuery = useQuery("photos", PhotosQuery);

  const addImagesMutation = useMutation(
    async (images: string[]) => {
      await queryClient.cancelQueries("photos");
      return axios.post("/api/v1/admin/photos", images);
    },
    {
      onSuccess: () => {
        alertService.success("Images uploaded successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;
        console.error("error uploading photography images", { err });
        alertService.error(`Error uploading images: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries("photos");
        window.scrollTo(0, 0);
      },
    }
  );

  const deleteImagesMutation = useMutation(
    async (images: string[]) => {
      await queryClient.cancelQueries("photos");
      return axios({
        url: "/api/v1/admin/photos",
        method: "DELETE",
        data: images,
      });
    },
    {
      onSuccess: () => {
        alertService.success("Image(s) deleted successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;
        console.error(`error removing photography images`, { err });
        alertService.error(`Error removing images: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries("photos");
        window.scrollTo(0, 0);
      },
    }
  );

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
    <Container maxWidth="72rem">
      <Heading as="h1" textAlign="center">
        Photography Gallery Settings
      </Heading>

      {addImagesMutation.isLoading || deleteImagesMutation.isLoading ? (
        <LoadingCard />
      ) : (
        <ImageManager
          images={photos}
          title="Photography Images"
          deleteImages={deleteImagesMutation.mutate}
          uploadFunc={addImagesMutation.mutate}
        />
      )}
    </Container>
  );
};
