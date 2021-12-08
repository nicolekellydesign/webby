import axios, { AxiosError } from "axios";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { LoadingCard } from "@Components/LoadingCard";
import { Modal } from "@Components/Modal";
import { alertService } from "@Services/alert.service";
import { User } from "../../declarations";
import { UsersQuery } from "../../Queries";

interface LoginElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
  submit: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: LoginElements;
}

interface AddUserReq extends Object {
  username: string;
  password: string;
}

export const AdminUsers: React.FC = () => {
  const queryClient = useQueryClient();
  const usersQuery = useQuery("users", UsersQuery);

  const addUserMutation = useMutation(
    (data: AddUserReq) => {
      return axios.post("/api/v1/admin/users", data);
    },
    {
      onSuccess: () => {
        alertService.success("User added successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err = error.response?.data;
        console.error("error adding user", { err });
        alertService.error(`Error adding user: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries("users");
        window.scrollTo(0, 0);
      },
    }
  );

  const deleteUserMutation = useMutation(
    (id: number) => {
      return axios.delete(`/api/v1/admin/users/${id}`);
    },
    {
      onSuccess: () => {
        alertService.success("User deleted successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err = error.response?.data;
        console.error("error deleting user", { err });
        alertService.error(`Error deleting user: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries("users");
        window.scrollTo(0, 0);
      },
    }
  );

  const handleSubmit = (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { username, password } = form.elements;
    const data = { username: username.value, password: password.value };

    addUserMutation.mutate(data);
    form.reset();
  };

  if (usersQuery.isLoading) {
    return <LoadingCard />;
  }

  if (usersQuery.isError) {
    console.error("Error fetching users", usersQuery.error);
    alertService.error(`Error getting users: ${usersQuery.error}`, false);
  }

  const users = (usersQuery.data as User[]).sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    } else if (a.id > b.id) {
      return 1;
    } else {
      return 0;
    }
  });

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
                        <AiOutlineClose className="inline-block w-6 h-6 stroke-current" />
                      </button>
                    </div>
                  ) : (
                    <div data-tip="Delete user" className="tooltip">
                      <Modal
                        id={`delete-${user.username}-modal`}
                        openIcon={<AiOutlineClose className="inline-block w-6 h-6 stroke-current" />}
                        title={`Are you sure you want to delete user '${user.username}'?`}
                        primaryText="Delete"
                        secondaryText="Cancel"
                        onConfirm={() => {
                          deleteUserMutation.mutate(user.id);
                        }}
                        destructive
                        ghost
                      >
                        <p>This action cannot be reversed.</p>
                      </Modal>
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
          <button id="submit" type="submit" className="btn btn-outline btn-primary">
            Add user
          </button>
        </form>
      </div>
    </div>
  );
};
