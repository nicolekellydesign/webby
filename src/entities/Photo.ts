/**
 * A representation of a photography gallery items.
 */
export interface Photo {
  filename: string;
}

/**
 * Uploads a new photography gallery image to the server.
 *
 * @param {File} file The file to upload to the server.
 * @param {string} filename The name of the file being uploaded.
 * @returns {Promise} A promise with the result of the API request.
 */
export function addPhoto(file: File, filename: string): Promise<void> {
  const formData = new FormData();
  formData.append("image", file, filename);

  return new Promise((resolve, reject) => {
    fetch("/api/v1/admin/photos", {
      method: "POST",
      body: formData,
    }).then(async (response) => {
      const isJson = response.headers
        .get("Content-Type")
        ?.includes("application/json");
      const body = isJson && (await response.json());

      if (!response.ok) {
        const error = (body && body.message) || response.status;
        reject(error);
      }

      resolve();
    });
  });
}

/**
 * Removes a photography image from the server.
 *
 * @param {string} filename The name of the file to remove.
 * @returns {Promise} A promise with the result of the API request.
 */
export function deletePhoto(filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/admin/photos/${filename}`, {
      method: "DELETE",
    }).then(async (response) => {
      const isJson = response.headers
        .get("Content-Type")
        ?.includes("application/json");
      const body = isJson && (await response.json());

      if (!response.ok) {
        const error = (body && body.message) || response.status;
        reject(error);
      }

      resolve();
    });
  });
}

/**
 * Get all of the images in the photography gallery.
 *
 * @returns {Promise<Photo[]>} A promise with the list of photos.
 */
export function getPhotos(): Promise<Photo[]> {
  return new Promise((resolve, reject) => {
    fetch("/api/v1/photos", {
      method: "GET",
    }).then(async (response) => {
      const isJson = response.headers
        .get("Content-Type")
        ?.includes("application/json");
      const body = isJson && (await response.json());

      if (!response.ok) {
        const error = (body && body.message) || response.status;
        reject(error);
      }

      resolve(body.photos);
    });
  });
}
