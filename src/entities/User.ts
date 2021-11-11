/**
 * Represents an administrator that can view and modify Webby settings.
 */
export interface User {
  id: number;
  username: string;
  protected: boolean;
  createdAt: Date;
}

/**
 * Adds a new administrator for Webby.
 *
 * @param {string} username The user's login username.
 * @param {string} password The user's login password.
 * @returns {Promise<void>} A promise for the result of the API request.
 */
export function addUser(username: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fetch("/api/v1/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
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
 * Removes an administrator account from the server.
 *
 * @param {number} id The ID of the administrator to remove.
 * @returns {Promise<void>} A promise with the result of the API request.
 */
export function deleteUser(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    fetch(`/api/v1/admin/users/${id}`, {
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
 * Gets all users from the server.
 *
 * @returns {Promise<User{}>} A promise with the list of users.
 */
export function getUsers(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    fetch("/api/v1/admin/users", {
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

      console.info({ body });

      resolve(body.users);
    });
  });
}
