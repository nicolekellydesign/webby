import { useEffect, useState } from "react";
import * as AiIcons from "react-icons/ai";
import { addUser, deleteUser, getUsers, User } from "../../entities/User";
import { alertService } from "../../services/alert.service";

interface LoginElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
  submit: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: LoginElements;
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [usersLength, setUsersLength] = useState(0);

  const handleSubmit = (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { username, password, submit } = form.elements;

    submit.disabled = true;

    addUser(username.value, password.value)
      .then(() => {
        alertService.success("User added successfully!", true);
        setUsersLength(usersLength + 1);
      })
      .catch((error) => {
        console.error(`error sending addUser request: ${error}`);
        alertService.error(`Error adding user: ${error}`, false);
      })
      .finally(() => {
        submit.disabled = false;
        form.reset();
      });
  };

  const handleDelete = (user: User) => {
    if (!user.protected) {
      deleteUser(user.id)
        .then(() => {
          alertService.success("User deleted successfully!", true);
          setUsersLength(usersLength + 1);
        })
        .catch((error) => {
          console.error(`error deleting user: ${error}`);
          alertService.error(`Error removing user: ${error}`, false);
        });
    }
  };

  useEffect(() => {
    getUsers()
      .then((users) => {
        setUsers(users);
      })
      .catch((error) => {
        console.error(`error getting user list: ${error}`);
        alertService.error(`Error getting user list: ${error}`, false);
      });
  }, [usersLength]);

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-4xl text-center">Administrators</h1>

      <div className="mx-auto my-8 w-1/2">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Created At</th>
              <th>Last Login</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user.id}>
                <th>{user.id}</th>
                <td>{user.username}</td>
                <td>
                  {new Date(user.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "medium",
                  })}
                </td>
                {user.lastLogin ? (
                  <td>
                    {new Date(user.lastLogin).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "medium",
                    })}
                  </td>
                ) : (
                  <td className="text-base-300">n/a</td>
                )}
                <td className="text-center">
                  {user.protected ? (
                    <div data-tip="User is protected" className="tooltip">
                      <button className="btn btn-ghost btn-disabled btn-sm" disabled>
                        <AiIcons.AiOutlineClose className="inline-block w-6 h-6 stroke-current" />
                      </button>
                    </div>
                  ) : (
                    <div data-tip="Delete user" className="tooltip">
                      <label htmlFor={`delete-${user.username}-modal`} className="btn btn-ghost btn-sm modal-open">
                        <AiIcons.AiOutlineClose className="inline-block w-6 h-6 stroke-current" />
                      </label>
                      <input type="checkbox" id={`delete-${user.username}-modal`} className="modal-toggle" />
                      <div className="modal">
                        <div className="modal-box">
                          <h2 className="font-bold text-xl">Are you sure you want to delete user '{user.username}'?</h2>
                          <br />
                          <p>This action cannot be reversed.</p>

                          <div className="modal-action">
                            <label
                              htmlFor={`delete-${user.username}-modal`}
                              className="btn btn-secondary"
                              onClick={() => {
                                handleDelete(user);
                              }}
                            >
                              Delete
                            </label>
                            <label htmlFor={`delete-${user.username}-modal`} className="btn">
                              Cancel
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <form id="addUser" className="mt-8 input-group w-full" onSubmit={handleSubmit}>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            pattern="^(\w+)$"
            title="Username cannot contain whitespace"
            required
            className="input input-bordered"
          />
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            required
            className="input input-bordered"
          />
          <button id="submit" type="submit" className="btn btn-primary">
            Add user
          </button>
        </form>
      </div>
    </div>
  );
}
