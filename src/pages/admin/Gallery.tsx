import axios, { AxiosError } from "axios";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { AiOutlineSetting } from "react-icons/ai";

import { Form } from "@Components/Form";
import { LoadingCard } from "@Components/LoadingCard";
import { MarkdownInput } from "@Components/MarkdownInput";
import { slideToggle } from "@Components/slider";
import { TextInput } from "@Components/TextInput";
import { alertService } from "@Services/alert.service";
import { APIError, Project } from "../../declarations";
import { ProjectsQuery } from "../../Queries";

interface AddProjectElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  title: HTMLInputElement;
  caption: HTMLInputElement;
  projectInfo: HTMLInputElement;
  embedURL: HTMLInputElement;
  thumbnail: HTMLInputElement;
}

interface AddProjectFormElement extends HTMLFormElement {
  readonly elements: AddProjectElements;
}

export const AdminGalleryView: React.FC = () => {
  const queryClient = useQueryClient();
  const projectsQuery = useQuery("projects", ProjectsQuery);

  const [selectedFile, setSelectedFile] = useState<File>();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const [addProjectVisible, setAddProjectVisible] = useState(false);

  const mutation = useMutation(
    (data: FormData) => {
      return axios.post("/api/v1/admin/gallery", data);
    },
    {
      onSuccess: () => {
        toggleAddProject();
        alertService.success("Project list updated successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;
        console.error("error adding or deleting project", { err });
        alertService.error(`Error updating project list: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries("projects");
        window.scrollTo(0, 0);
      },
    }
  );

  if (projectsQuery.isLoading) {
    return <LoadingCard />;
  }

  if (projectsQuery.isError) {
    console.error("error getting projects", projectsQuery.error);
    alertService.error(`Error getting projects: ${projectsQuery.error}`, false);
  }

  const projects = projectsQuery.data as Project[];

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files) {
      return;
    }

    setSelectedFile(files[0]);
    setIsFilePicked(true);
  };

  const onSubmit = (event: React.FormEvent<AddProjectFormElement>) => {
    event.preventDefault();

    if (!isFilePicked || !selectedFile) {
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    data.append("thumbnail", selectedFile, selectedFile.name);

    mutation.mutate(data);
    form.reset();
  };

  const toggleAddProject = () => {
    const toggle = document.getElementById("slide-toggle");
    if (!toggle) {
      return;
    }

    const form = document.getElementById("add-project-form");
    if (!form) {
      return;
    }

    toggle.classList.toggle("active");
    slideToggle(form, addProjectVisible, 150);
    setAddProjectVisible(!addProjectVisible);
  };

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-4xl text-center">Portfolio Gallery Settings</h1>

      <div className="max-w-max mx-auto my-8">
        <div className="card lg:card-side bordered w-7xl">
          <div className="card-body">
            <h2 className="card-title">Gallery Projects</h2>

            <ul className="max-w-6xl max-h-80 gap-4 image-scroller carousel-center rounded-box p-4">
              {projects.map((project) => (
                <li
                  data-src={`/images/${project.thumbnail}`}
                  className="carousel-item rounded-box bg-cover bg-center bg-no-repeat cursor-pointer justify-center w-64 h-64"
                  style={{
                    backgroundImage: `url("/images/${project.thumbnail}")`,
                  }}
                >
                  <NavLink
                    to={`/admin/gallery/${project.name}`}
                    className="opacity-0 hover:opacity-70 hover:bg-black rounded-box relative flex-1 flex flex-col justify-center align-middle overflow-hidden transition"
                  >
                    <div className="box-border font-bold text-lg mx-auto w-max">
                      <div className="font-bold text-lg w-max">
                        <AiOutlineSetting className="mx-auto w-8 h-8" />
                        Project Settings
                      </div>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="collapse w-96 border rounded-box border-base-300 collapse-plus mt-8">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">Add new project</div>
          <div className="collapse-content">
            <Form disabled={mutation.isLoading} onSubmit={onSubmit} submitText="Add project" className="text-left">
              <TextInput
                id="name"
                name="name"
                label="Project name"
                pattern="[A-z\d\-_]+"
                placeholder="project-name"
                title="Only use letters, numbers, - and _ characters."
                required
              />
              <TextInput id="title" name="title" label="Title" placeholder="Project Title" required />
              <TextInput id="caption" name="caption" label="Caption" placeholder="Short thumbnail caption" required />
              <MarkdownInput inputId="projectInfo" inputName="projectInfo" label="Project info" />
              <TextInput
                id="embedURL"
                name="embedURL"
                label="Embed URL (optional)"
                placeholder="https://youtube.com/embed/video-key"
              />
              <div className="form-control">
                <label htmlFor="thumbnail" className="label">
                  <span className="label-text">Project thumbnail</span>
                </label>
                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  name="thumbnail"
                  title="Only images allowed."
                  onChange={changeHandler}
                  className="btn btn-ghost"
                  required
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
