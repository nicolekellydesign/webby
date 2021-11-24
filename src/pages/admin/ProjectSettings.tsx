import { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router";
import * as AiIcons from "react-icons/ai";
import {
  addProjectImages,
  changeThumbnail,
  deleteGalleryItem,
  deleteProjectImages,
  GalleryItem,
  getProject,
  updateProject,
} from "@Entities/GalleryItem";
import { alertService } from "@Services/alert.service";
import { NotFound } from "@Pages/NotFound";
import { ImageManager } from "@Components/ImageManager";
import MarkdownInput from "@Components/MarkdownInput";
import Dropzone from "react-dropzone-uploader";
import { Input, Layout, Preview, Submit } from "@Components/dropzone/DropzoneOverrides";

interface ParamTypes {
  name: string;
}

interface UpdateProjectElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  caption: HTMLInputElement;
  projectInfo: HTMLInputElement;
  embedURL: HTMLInputElement;
  submit: HTMLInputElement;
}

interface UpdateProjectFormElement extends HTMLFormElement {
  readonly elements: UpdateProjectElements;
}

export function ProjectSettings() {
  const { name } = useParams<ParamTypes>();

  const [project, setProject] = useState<GalleryItem>();
  const [projectLength, setProjectLength] = useState(0);

  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const insertImages = (images: string[]) => {
    addProjectImages(name, images)
      .then(() => {
        alertService.success("Images uploaded successfully!", true);
        setProjectLength(projectLength + 1);
      })
      .catch((error) => {
        console.error("error uploading project images", error);
        alertService.error(`Error uploading images: ${error.message}`, false);
      })
      .finally(() => {
        window.scrollTo(0, 0);
      });
  };

  const uploadThumbnail = (filename: string) => {
    changeThumbnail(name, filename)
      .then(() => {
        alertService.success("Thumbnail uploaded successfully!", true);
        setProjectLength(projectLength + 1);
      })
      .catch((error) => {
        console.error("error updating project thumbnail", error);
        alertService.error(`Error updating thumbnail: ${error.message}`, false);
      })
      .finally(() => {
        window.scrollTo(0, 0);
      });
  };

  const onSubmit = (event: React.FormEvent<UpdateProjectFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { title, caption, projectInfo, embedURL, submit } = form.elements;
    submit.disabled = true;

    const updatedProject: GalleryItem = {
      name: name,
      title: title.value,
      caption: caption.value,
      projectInfo: projectInfo.value,
      embedURL: embedURL.value,
    };

    updateProject(updatedProject)
      .then(() => {
        alertService.success("Project settings updated successfully!", true);
        setProjectLength(projectLength + 1);
      })
      .catch((error) => {
        console.error(`error updating project settings for '${name}'`, error);
        alertService.error(`Error updating project settings: ${error.message}`, false);
      })
      .finally(() => {
        submit.disabled = false;
        window.scrollTo(0, 0);
      });
  };

  const deleteImages = (images: string[]) => {
    deleteProjectImages(name, images)
      .then(() => {
        alertService.success("Image(s) deleted successfully!", true);
        setProjectLength(projectLength + 1);
      })
      .catch((error) => {
        console.error(`error removing images from project '${name}': ${error}`);
        alertService.error(`Error removing images: ${error}`, false);
      })
      .finally(() => {
        window.scrollTo(0, 0);
      });
  };

  const deleteProject = () => {
    deleteGalleryItem(name).then(() => {
      setRedirectToReferrer(true);
      alertService.success("Project deleted successfully!", true);
    });
  };

  useEffect(() => {
    getProject(name)
      .then((p) => {
        setProject(p);
      })
      .catch((error) => {
        console.error(`error getting project info for project '${name}': ${error}'`);
        alertService.error(`Error getting project info: ${error}`, false);
      });
  }, [name, projectLength]);

  if (redirectToReferrer) {
    return <Redirect to="/admin/gallery" />;
  }

  return project ? (
    <div className="container mx-auto">
      <h1 className="font-bold text-4xl text-center">Project Settings</h1>

      <div className="max-w-max mx-auto my-8">
        <div className="card lg:card-side bordered">
          <figure className="relative">
            <img src={`/images/${project.thumbnail}`} alt={project.title} className="rounded-xl h-72" />
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
                  uploadThumbnail(files[0].meta.name);
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
              />
            </div>
          </div>
        </div>

        <div id="update-project-form" className="card lg:card-side bordered mt-8">
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
              <button id="submit" type="submit" className="btn btn-primary">
                Update project
              </button>
            </div>
          </form>
        </div>

        <ImageManager
          images={project.images}
          title="Project Images"
          deleteImages={deleteImages}
          uploadFunc={insertImages}
        />

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
              <label htmlFor="delete-project-modal" className="btn btn-secondary" onClick={deleteProject}>
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
  ) : (
    <NotFound />
  );
}
