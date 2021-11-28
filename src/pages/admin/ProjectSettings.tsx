import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Redirect, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as AiIcons from "react-icons/ai";

import Dropzone from "react-dropzone-uploader";

import { Input, Layout, Preview, Submit } from "@Components/dropzone/DropzoneOverrides";
import { ImageManager } from "@Components/ImageManager";
import { LoadingCard } from "@Components/LoadingCard";
import { MarkdownInput } from "@Components/MarkdownInput";
import { NotFound } from "@Pages/NotFound";
import { alertService } from "@Services/alert.service";
import { APIError, Project } from "../../declarations";
import { ProjectQuery } from "../../Queries";

interface ParamTypes {
  name: string;
}

interface UpdateProjectElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  caption: HTMLInputElement;
  projectInfo: HTMLInputElement;
  embedURL: HTMLInputElement;
}

interface UpdateProjectFormElement extends HTMLFormElement {
  readonly elements: UpdateProjectElements;
}

export const ProjectSettings: React.FC = () => {
  const { name } = useParams<ParamTypes>();
  const queryClient = useQueryClient();
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const projectQuery = useQuery(["projects", name], () => ProjectQuery(name));

  const thumbMutation = useMutation(
    async (data: string) => {
      await queryClient.cancelQueries(["projects", name]);
      return axios.patch(`/api/v1/admin/gallery/${name}/thumbnail`, { thumbnail: data });
    },
    {
      onSuccess: () => {
        alertService.success("Thumbnail uploaded successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;
        console.error("error updating project thumbnail", { err });
        alertService.error(`Error updating thumbnail: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["projects", name]);
        window.scrollTo(0, 0);
      },
    }
  );

  const detailsMutation = useMutation(
    async (data: Project) => {
      await queryClient.cancelQueries(["projects", name]);
      return axios.put(`/api/v1/admin/gallery/${name}`, data);
    },
    {
      onSuccess: () => {
        alertService.success("Project settings updated successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;
        console.error(`error updating project settings for '${name}'`, { err });
        alertService.error(`Error updating project settings: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["projects", name]);
        window.scrollTo(0, 0);
      },
    }
  );

  const addImagesMutation = useMutation(
    async (images: string[]) => {
      await queryClient.cancelQueries(["projects", name]);
      return axios.post(`/api/v1/admin/gallery/${name}/images`, images);
    },
    {
      onSuccess: () => {
        alertService.success("Images uploaded successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;
        console.error("error uploading project images", { err });
        alertService.error(`Error uploading images: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["projects", name]);
        window.scrollTo(0, 0);
      },
    }
  );

  const deleteImagesMutation = useMutation(
    async (images: string[]) => {
      await queryClient.cancelQueries(["projects", name]);
      return axios({
        url: `/api/v1/admin/gallery/${name}/images`,
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
        console.error(`error removing images from project '${name}'`, { err });
        alertService.error(`Error removing images: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["projects", name]);
        window.scrollTo(0, 0);
      },
    }
  );

  const deleteProjectMutation = useMutation(
    async () => {
      await queryClient.cancelQueries("projects");
      return axios.delete(`/api/v1/admin/gallery/${name}`);
    },
    {
      onSuccess: () => {
        setRedirectToReferrer(true);
        alertService.success("Project deleted successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;
        console.error(`error deleting project '${name}'`, { err });
        alertService.error(`Error deleting project: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries("projects");
        window.scrollTo(0, 0);
      },
    }
  );

  const onSubmit = (event: React.FormEvent<UpdateProjectFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { title, caption, projectInfo, embedURL } = form.elements;

    const updatedProject: Project = {
      name: name,
      title: title.value,
      caption: caption.value,
      projectInfo: projectInfo.value,
      embedURL: embedURL.value,
    };

    detailsMutation.mutate(updatedProject);
  };

  if (typeof name !== "string" || name === "") {
    return <NotFound />;
  }

  if (projectQuery.isLoading) {
    return <LoadingCard />;
  }

  if (projectQuery.isError) {
    console.error("error getting projects", projectQuery.error);
    alertService.error(`Error getting project: ${projectQuery.error}`, false);
  }

  const project = projectQuery.data as Project;

  if (redirectToReferrer) {
    return <Redirect to="/admin/gallery" />;
  }

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-4xl text-center">Project Settings</h1>

      <div className="max-w-max mx-auto my-8">
        <div className="card lg:card-side bordered">
          <figure className="relative">
            {thumbMutation.isLoading ? (
              <LoadingCard />
            ) : (
              <img src={`/images/${project.thumbnail}`} alt={project.title} className="rounded-xl h-72" />
            )}
          </figure>
          <div className="card-body">
            <h2 className="card-title">Update Thumbnail</h2>

            <div className="card-actions">
              <Dropzone
                getUploadParams={() => {
                  return { method: "POST", url: "/api/v1/admin/upload" };
                }}
                onChangeStatus={({ meta, file }, status) => {
                  console.log(status, meta, file);
                }}
                onSubmit={(files) => {
                  thumbMutation.mutate(files[0].meta.name);
                }}
                accept="image/*"
                maxSizeBytes={8 * 1024 * 1024}
                multiple={false}
                LayoutComponent={Layout}
                PreviewComponent={Preview}
                InputComponent={Input}
                SubmitButtonComponent={Submit}
                classNames={{ dropzone: "dropzone" }}
                inputContent="Drag or click to change thumbnail"
                disabled={thumbMutation.isLoading}
              />
            </div>
          </div>
        </div>

        <div id="update-project-form" className="card lg:card-side bordered mt-8">
          {detailsMutation.isLoading ? (
            <LoadingCard />
          ) : (
            <form onSubmit={onSubmit} className="card-body">
              <h2 className="card-title">Project Details</h2>

              <div className="form-control">
                <label htmlFor="title" className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Project Title"
                  defaultValue={project.title}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label htmlFor="caption" className="label">
                  <span className="label-text">Caption</span>
                </label>
                <input
                  id="caption"
                  type="text"
                  name="caption"
                  placeholder="Short thumbnail caption"
                  defaultValue={project.caption}
                  className="input input-bordered"
                  required
                />
              </div>
              <MarkdownInput
                inputId="projectInfo"
                inputName="projectInfo"
                label="Project info"
                startingText={project.projectInfo}
              />
              <div className="form-control">
                <label htmlFor="embedURL" className="label">
                  <span className="label-text">Embed URL (optional)</span>
                </label>
                <input
                  id="embedURL"
                  type="text"
                  name="embedURL"
                  defaultValue={project.embedURL}
                  className="input input-bordered"
                />
              </div>
              <div className="card-actions">
                <button id="submit" type="submit" className="btn btn-primary" disabled={detailsMutation.isLoading}>
                  Update project
                </button>
              </div>
            </form>
          )}
        </div>

        {addImagesMutation.isLoading || deleteImagesMutation.isLoading ? (
          <LoadingCard />
        ) : (
          <ImageManager
            images={project.images}
            title="Project Images"
            deleteImages={(images) => deleteImagesMutation.mutate(images)}
            uploadFunc={(images) => addImagesMutation.mutate(images)}
          />
        )}

        <label htmlFor="delete-project-modal" className="btn btn-secondary btn-outline modal-open mt-8">
          <AiIcons.AiOutlineDelete className="btn-icon" />
          Delete project
        </label>
        <input type="checkbox" id="delete-project-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h2 className="font-bold text-xl">Are you sure you want to delete this project?</h2>
            <br />
            <p>This action cannot be reversed.</p>

            <div className="modal-action">
              <label
                htmlFor="delete-project-modal"
                className="btn btn-secondary"
                onClick={() => deleteProjectMutation.mutate()}
              >
                Delete
              </label>
              <label htmlFor="delete-project-modal" className="btn">
                Cancel
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
