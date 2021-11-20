export interface GalleryItem {
  name: string;
  title: string;
  caption: string;
  projectInfo: string;
  thumbnail?: string | undefined;
  embedURL?: string | undefined;
  images?: string[] | undefined;
}

/**
 * Adds a new gallery item to the server.
 *
 * @param {string} item The gallery item to add.
 * @param {File} file The file to upload.
 * @param {string} filename The name of the uploaded file.
 * @returns {Promise<void>} A promise with the result of the API request.
 */
export function addGalleryItem(item: GalleryItem, file: File, filename: string): Promise<void> {
  const formData = new FormData();
  formData.append("name", item.name);
  formData.append("title", item.title);
  formData.append("caption", item.caption);
  formData.append("project_info", item.projectInfo);
  formData.append("thumbnail", file, filename);

  if (item.embedURL) {
    formData.append("embed_url", item.embedURL);
  }

  return new Promise((resolve, reject) => {
    fetch("/api/v1/admin/gallery", {
      method: "POST",
      body: formData,
    }).then(async (response) => {
      const isJson = response.headers.get("Content-Type")?.includes("application/json");
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
 * Get all of the gallery items from the server.
 *
 * @returns {Promise<GalleryItem[]>} A promise with the list of gallery items.
 */
export function getGalleryItems(): Promise<GalleryItem[]> {
  return new Promise((resolve, reject) => {
    fetch("/api/v1/gallery", {
      method: "GET",
    }).then(async (response) => {
      const isJson = response.headers.get("Content-Type")?.includes("application/json");
      const body = isJson && (await response.json());

      if (!response.ok) {
        const error = (body && body.message) || response.status;
        reject(error);
      }

      resolve(body.items);
    });
  });
}

/**
 * Removes a gallery item from the server.
 *
 * @param {string} name The name of the gallery item to remove.
 * @returns {Promise<void>} A promise with the result of the API request.
 */
export function deleteGalleryItem(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/admin/gallery/${name}`, {
      method: "DELETE",
    }).then(async (response) => {
      const isJson = response.headers.get("Content-Type")?.includes("application/json");
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
 *
 * @param {string} name The name of the portfolio project to fetch.
 * @returns {Promise<GalleryItem>} The returned project, or an error.
 */
export function getProject(name: string): Promise<GalleryItem> {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/gallery/${name}`, {
      method: "GET",
    }).then(async (response) => {
      const isJson = response.headers.get("Content-Type")?.includes("application/json");
      const body = isJson && (await response.json());

      if (!response.ok) {
        const error = (body && body.message) || response.status;
        reject(error);
      }

      const project: GalleryItem = {
        name: name,
        title: body.title,
        caption: body.caption,
        projectInfo: body.projectInfo,
        thumbnail: body.thumbnail,
        embedURL: body.embedURL,
        images: body.images,
      };

      resolve(project);
    });
  });
}

/**
 * Sends a list of image file names to attach to the project on the server.
 *
 * @param {string} galleryID The ID of the gallery item the image is a part of.
 * @param {string[]} files The file names to attach to the project.
 * @returns {Promise} A promise with the result of the API request.
 */
export function addProjectImages(galleryID: string, files: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/admin/gallery/${galleryID}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(files),
    }).then(async (response) => {
      const isJson = response.headers.get("Content-Type")?.includes("application/json");
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
 * Removes portfolio project images from the server.
 *
 * @param {string} galleryID The ID of the gallery item the image is a part of.
 * @param {string[]} files The names of the files to remove.
 * @returns {Promise} A promise with the result of the API request.
 */
export function deleteProjectImages(galleryID: string, files: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/admin/gallery/${galleryID}/images`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(files),
    }).then(async (response) => {
      const isJson = response.headers.get("Content-Type")?.includes("application/json");
      const body = isJson && (await response.json());

      if (!response.ok) {
        const error = (body && body.message) || response.status;
        reject(error);
      }

      resolve();
    });
  });
}

export function changeThumbnail(galleryID: string, file: File, filename: string): Promise<void> {
  const formData = new FormData();
  formData.append("thumbnail", file, filename);

  return new Promise((resolve, reject) => {
    fetch(`/api/v1/admin/gallery/${galleryID}/thumbnail`, {
      method: "PATCH",
      body: formData,
    }).then(async (response) => {
      const isJson = response.headers.get("Content-Type")?.includes("application/json");
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
 * Sends a request to update a project's values to the server.
 *
 * @param item The item with updated values.
 * @returns {Promise<void>} A promise with the result of the API request.
 */
export function updateProject(item: GalleryItem): Promise<void> {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/admin/gallery/${item.name}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    }).then(async (response) => {
      const isJson = response.headers.get("Content-Type")?.includes("application/json");
      const body = isJson && (await response.json());

      if (!response.ok) {
        const error = (body && body.message) || response.status;
        reject(error);
      }

      resolve();
    });
  });
}
