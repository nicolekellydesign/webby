import { useEffect, useState } from "react";
import * as AiIcons from "react-icons/ai";
import { User } from "../entities/User";
import { alertService } from "../services/alert.service";

interface LoginElements extends HTMLFormControlsCollection {
  usernameInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  submitButton: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: LoginElements;
}

const AdminUsers = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]);
  const [usersLength, setUsersLength] = useState(0);

  const addUser = (username: string, password: string) => {
    fetch(`https://${window.location.hostname}/api/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
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

        alertService.success("User added successfully!", false);

        setUsersLength(usersLength + 1);
      })
      .catch((error) => {
        console.error(`error sending addUser request: ${error}`);
        alertService.error(`Error adding user: ${error}`, false);
      });
  };

  const deleteUser = (id: number) => {
    fetch(`https://${window.location.hostname}/api/v1/admin/users/${id}`, {
      method: "DELETE",
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

        alertService.success("User deleted successfully!", false);

        setUsersLength(usersLength + 1);
      })
      .catch((error) => {
        console.error(`error sending deleteUser request: ${error}`);
        alertService.error(`Error removing user: ${error}`, false);
      });
  };

  const getUsers = () => {
    fetch(`https://${window.location.hostname}/api/v1/admin/users`, {
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

        setUsers(body.users);
      })
      .catch((error) => {
        console.error(`error getting user list: ${error}`);
        alertService.error(`Error getting user list: ${error}`, false);
      });
  };

  const handleSubmit = (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { usernameInput, passwordInput, submitButton } = form.elements;

    submitButton.disabled = true;

    addUser(usernameInput.value, passwordInput.value);

    submitButton.disabled = false;
    form.reset();
  };

  useEffect(() => {
    getUsers();
  }, [usersLength]);

  return (
    <div className="container text-center mx-auto">
      <h1 className="font-bold text-5xl">Administrators</h1>
      <div className="max-w-xl mx-auto my-8">
        <ul className="border border-solid border-white rounded">
          <li className="flex border-b border-white p-4">
            <div className="flex-none">ID</div>
            <div className="flex-grow">Username</div>
          </li>
          {users.map((user: User) => (
            <li className="flex p-4">
              <div className="flex-none">{user.id}</div>
              <div className="flex-grow">{user.username}</div>
              <div
                title={user.protected ? "User is protected" : "Delete user"}
                className={
                  user.protected
                    ? "btn disabled flex-none rounded"
                    : "btn flex-none rounded"
                }
                onClick={() => {
                  if (!user.protected) {
                    deleteUser(user.id);
                  }
                }}
              >
                <AiIcons.AiOutlineClose />
              </div>
            </li>
          ))}
        </ul>
        <form id="addUser" className="mt-8" onSubmit={handleSubmit}>
          <input
            id="usernameInput"
            type="text"
            name="username"
            placeholder="Username"
            required
            className="rounded text-black text-center"
          />
          <input
            id="passwordInput"
            type="password"
            name="password"
            placeholder="Password"
            required
            className="rounded text-black text-center m-2"
          />
          <input
            id="submitButton"
            type="submit"
            value="Add User"
            className="btn rounded text-black text-center"
          />
        </form>
      </div>
    </div>
  );
};

export default AdminUsers;
