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
} from "../../entities/GalleryItem";
import { alertService } from "../../services/alert.service";
import NotFound from "../NotFound";
import ImageManager from "../../components/ImageManager";

interface ParamTypes {
  name: string;
}

interface ThumbnailElements extends HTMLFormControlsCollection {
  image: HTMLInputElement;
  submit: HTMLInputElement;
}

interface ThumbnailFormElement extends HTMLFormElement {
  readonly elements: ThumbnailElements;
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

const ProjectSettings = (): JSX.Element => {
  const { name } = useParams<ParamTypes>();

  const [project, setProject] = useState<GalleryItem>();
  const [projectLength, setProjectLength] = useState(0);

  const [thumbFile, setThumbFile] = useState<File>();
  const [isThumbPicked, setIsThumbPicked] = useState(false);

  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const thumbChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files) {
      return;
    }

    setThumbFile(files[0]);
    setIsThumbPicked(true);
  };

  const insertImages = (images: string[]) => {
    addProjectImages(name, images)
      .then(() => {
        alertService.success("Images uploaded successfully!", true);
        setProjectLength(projectLength + 1);
      })
      .catch((error) => {
        console.error(`error uploading project images: ${error}`);
        alertService.error(`Error uploading images: ${error}`, false);
      })
      .finally(() => {
        window.scrollTo(0, 0);
      });
  };

  const uploadThumbnail = (event: React.FormEvent<ThumbnailFormElement>) => {
    event.preventDefault();

    if (!isThumbPicked || !thumbFile) {
      return;
    }

    const form = event.currentTarget;
    const { submit } = form.elements;
    submit.disabled = true;

    changeThumbnail(name, thumbFile, thumbFile.name)
      .then(() => {
        alertService.success("Thumbnail uploaded successfully!", true);
        setProjectLength(projectLength + 1);
      })
      .catch((error) => {
        console.error(`error updating project thumbnail: ${error}`);
        alertService.error(`Error updating thumbnail: ${error}`, false);
      })
      .finally(() => {
        setIsThumbPicked(false);
        setThumbFile(undefined);
        form.reset();
        submit.disabled = false;
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
        console.error(
          `error updating project settings for '${name}': ${error}`
        );
        alertService.error(`Error updating project settings: ${error}`, false);
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
        console.error(
          `error getting project info for project '${name}': ${error}'`
        );
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
            <img
              src={`/images/${project.thumbnail}`}
              alt={project.title}
              className="rounded-xl h-52"
            />
          </figure>
          <form
            id="thumbnail-upload-form"
            onSubmit={uploadThumbnail}
            className="card-body"
          >
            <div className="form-control">
              <label htmlFor="image" className="card-title">
                Change thumbnail image
              </label>
              <div className="text-xs">
                <p>Max file size: 8 MB</p>
              </div>
              <div className="card-actions">
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  title="Only images allowed."
                  onChange={thumbChangeHandler}
                  className="btn btn-ghost"
                  required
                />
                <button type="submit" name="submit" className="btn btn-primary">
                  <AiIcons.AiOutlineUpload className="inline-block w-6 h-6 mr-2 stroke-current" />
                  Upload thumbnail
                </button>
              </div>
            </div>
          </form>
        </div>

        <div
          id="update-project-form"
          className="card lg:card-side bordered mt-8"
        >
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
            <div className="form-control">
              <label htmlFor="projectInfo" className="label">
                <span className="label-text">Project info</span>
              </label>
              <textarea
                id="projectInfo"
                name="projectInfo"
                defaultValue={project.projectInfo}
                className="textarea textarea-bordered h-96"
                required
              />
            </div>
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
          label="Manage project images"
          deleteImages={deleteImages}
          uploadFunc={insertImages}
        />

        <label
          htmlFor="delete-project-modal"
          className="btn btn-secondary btn-outline modal-open mt-8"
        >
          <AiIcons.AiOutlineDelete className="inline-block w-6 h-6 mr-2 stroke-current" />
          Delete project
        </label>
        <input
          type="checkbox"
          id="delete-project-modal"
          className="modal-toggle"
        />
        <div className="modal">
          <div className="modal-box">
            <h2 className="font-bold text-xl">
              Are you sure you want to delete this project?
            </h2>
            <br />
            <p>This action cannot be reversed.</p>

            <div className="modal-action">
              <label
                htmlFor="delete-project-modal"
                className="btn btn-secondary"
                onClick={deleteProject}
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
  ) : (
    <NotFound />
  );
};

export default ProjectSettings;
