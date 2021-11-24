import { useEffect, useState } from "react";
import { ImageManager } from "../../components/ImageManager";
import { addPhotos, deletePhotos, getPhotos, Photo } from "../../entities/Photo";
import { alertService } from "../../services/alert.service";

export function AdminPhotos() {
  // eslint-disable-next-line
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photosLength, setPhotosLength] = useState(0);

  const [images, setImages] = useState<string[]>([]);

  const deleteImages = (images: string[]) => {
    deletePhotos(images)
      .then(() => {
        alertService.success("Image(s) deleted successfully!", true);
        setPhotosLength(photosLength + 1);
      })
      .catch((error) => {
        console.error("error removing photography images", error);
        alertService.error(`Error removing images: ${error.message}`, false);
      })
      .finally(() => {
        window.scrollTo(0, 0);
      });
  };

  const insertImages = (files: string[]) => {
    addPhotos(files)
      .then(() => {
        alertService.success("Photos uploaded successfully!", true);
        setPhotosLength(photosLength + 1);
      })
      .catch((error) => {
        console.error("error adding photography gallery items", error);
        alertService.error(`Error uploading photos: ${error.message}`, false);
      })
      .finally(() => {
        window.scrollTo(0, 0);
      });
  };

  useEffect(() => {
    getPhotos()
      .then((photos) => {
        setPhotos(photos);
        setImages(photos.map((photo) => photo.filename));
      })
      .catch((error) => {
        console.error("error getting photography images", error);
        alertService.error(`Error getting photos: ${error.message}`, false);
      });
  }, [photosLength]);

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-4xl text-center">Photography Gallery Settings</h1>
      <div className="max-w-max mx-auto my-8">
        <ImageManager
          images={images}
          title="Photography Images"
          deleteImages={deleteImages}
          uploadFunc={insertImages}
        />
      </div>
    </div>
  );
}
