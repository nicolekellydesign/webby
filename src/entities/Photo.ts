/**
 * A representation of a photography gallery items.
 */
export interface Photo {
  filename: string;
}

/**
 * Sends a list of image file names to add to the photography gallery.
 *
 * @param {string[]} files The file names to insert into the database.
 */
export function addPhotos(files: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    fetch("/api/v1/admin/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(files),
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
 * @param {string[]} files The names of the files to remove.
 * @returns {Promise} A promise with the result of the API request.
 */
export function deletePhotos(files: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    fetch("/api/v1/admin/photos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(files),
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
