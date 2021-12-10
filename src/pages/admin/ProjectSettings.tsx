import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { Redirect, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as AiIcons from "react-icons/ai";

import { Form } from "@Components/Form";
import { ImageManager } from "@Components/ImageManager";
import { LoadingCard } from "@Components/LoadingCard";
import { MarkdownInput } from "@Components/MarkdownInput";
import { Modal } from "@Components/Modal";
import { TextInput } from "@Components/TextInput";
import { NotFound } from "@Pages/NotFound";
import { alertService } from "@Services/alert.service";
import { APIError, Project } from "../../declarations";
import { ProjectQuery } from "../../Queries";
import { Dropzone } from "@Components/Dropzone";

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
                onSubmit={(files) => {
                  thumbMutation.mutate(files[0].name);
                }}
                accept="image/*"
                maxSize={8 * 1024 * 1024}
                multiple={false}
                disabled={thumbMutation.isLoading}
              />
            </div>
          </div>
        </div>

        <div id="update-project-form" className="card lg:card-side bordered mt-8">
          {detailsMutation.isLoading ? (
            <LoadingCard />
          ) : (
            <Form
              disabled={detailsMutation.isLoading}
              header="Project Details"
              onSubmit={onSubmit}
              submitText="Update project"
              className="card-body"
            >
              <TextInput
                id="title"
                name="title"
                label="Title"
                placeholder="Project Title"
                defaultValue={project.title}
                required
              />
              <TextInput
                id="caption"
                name="caption"
                label="Caption"
                placeholder="Short thumbnail caption"
                defaultValue={project.caption}
                required
              />
              <MarkdownInput
                inputId="projectInfo"
                inputName="projectInfo"
                label="Project info"
                startingText={project.projectInfo}
              />
              <TextInput
                id="embedURL"
                name="embedURL"
                label="Embed URL (optional)"
                placeholder="https://youtube.com/embed/video-key"
                defaultValue={project.embedURL}
              />
            </Form>
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

        <Modal
          id="delete-project-modal"
          openIcon={<AiIcons.AiOutlineDelete className="btn-icon" />}
          openText="Delete project"
          title="Are you sure you want to delete this project?"
          primaryText="Delete"
          secondaryText="Cancel"
          onConfirm={() => {
            deleteProjectMutation.mutate();
          }}
          destructive
        >
          <p>This action cannot be reversed.</p>
        </Modal>
      </div>
    </div>
  );
};
