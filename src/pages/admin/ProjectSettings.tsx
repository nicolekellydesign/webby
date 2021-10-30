import { useEffect, useState } from "react";
import { useParams } from "react-router";
import * as AiIcons from "react-icons/ai";
import {
  addProjectImage,
  changeThumbnail,
  deleteProjectImage,
  GalleryItem,
  getProject,
  updateProject,
} from "../../entities/GalleryItem";
import { alertService } from "../../services/alert.service";

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

interface UploadImageElements extends HTMLFormControlsCollection {
  image: HTMLInputElement;
  submit: HTMLInputElement;
}

interface UploadImageFormElement extends HTMLFormElement {
  readonly elements: UploadImageElements;
}

const ProjectSettings = (): JSX.Element => {
  const { name } = useParams<ParamTypes>();

  const [project, setProject] = useState<GalleryItem>();
  const [projectLength, setProjectLength] = useState(0);

  const [thumbFile, setThumbFile] = useState<File>();
  const [isThumbPicked, setIsThumbPicked] = useState(false);

  const [imageFile, setImageFile] = useState<File>();
  const [isImagePicked, setIsImagePicked] = useState(false);

  const thumbChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files) {
      return;
    }

    setThumbFile(files[0]);
    setIsThumbPicked(true);
  };

  const imageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files) {
      return;
    }

    setImageFile(files[0]);
    setIsImagePicked(true);
  };

  const uploadImage = (event: React.FormEvent<UploadImageFormElement>) => {
    event.preventDefault();

    if (!isImagePicked || !imageFile) {
      return;
    }

    const form = event.currentTarget;
    const { submit } = form.elements;
    submit.disabled = true;

    addProjectImage(name, imageFile, imageFile.name)
      .then(() => {
        alertService.success("Image uploaded successfully!", true);
        setProjectLength(projectLength + 1);
      })
      .catch((error) => {
        console.error(`error uploading project image: ${error}`);
        alertService.error(`Error uploading image: ${error}`, false);
      })
      .finally(() => {
        setIsImagePicked(false);
        setImageFile(undefined);
        form.reset();
        submit.disabled = false;
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
  }, [projectLength]);

  return project ? (
    <div className="container text-center mx-auto">
      <h1 className="font-bold text-5xl">Project Settings</h1>
      <div className="max-w-max mx-auto my-8">
        <div className="flex">
          <div className="relative max-w-thumb pl-2">
            <img
              src={`https://${window.location.hostname}/images/${project.thumbnail}`}
              alt={project.title}
            />
          </div>
          <div className="flex flex-col items-start mt-4">
            <form
              id="thumbnail-upload-form"
              onSubmit={uploadThumbnail}
              className="mt-8 p-2"
            >
              <div className="text-left">
                <label htmlFor="image" className="pl-3 font-semibold">
                  Change thumbnail image
                </label>
                <br />
                <div className="pl-3 text-xs">
                  <p>Max file size: 8 MB</p>
                </div>
                <br />
                <input
                  type="file"
                  name="image"
                  onChange={thumbChangeHandler}
                  className="btn rounded text-center"
                  required
                />
                <br />
                <div className="pl-3">
                  <input
                    type="submit"
                    name="submit"
                    value="Upload"
                    className="btn rounded text-black text-center"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div id="update-project-form" className="mt-4">
          <form onSubmit={onSubmit} className="text-left">
            <div className="p-2">
              <label htmlFor="title">Title</label>
              <br />
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Project Title"
                defaultValue={project.title}
                className="w-full text-black"
                required
              />
            </div>
            <div className="p-2">
              <label htmlFor="caption">Caption</label>
              <br />
              <input
                id="caption"
                type="text"
                name="caption"
                placeholder="Short thumbnail caption"
                defaultValue={project.caption}
                className="w-full text-black"
                required
              />
            </div>
            <div className="p-2">
              <label htmlFor="projectInfo">Project info</label>
              <br />
              <textarea
                id="projectInfo"
                name="projectInfo"
                defaultValue={project.projectInfo}
                className="w-full text-black min-h-textLarge"
                required
              />
            </div>
            <div className="p-2">
              <label htmlFor="embedURL">Embed URL (optional)</label>
              <br />
              <input
                id="embedURL"
                type="text"
                name="embedURL"
                placeholder="https://youtube.com/embed/video-key"
                defaultValue={project.embedURL}
                className="w-full text-black"
              />
            </div>
            <div className="p-2">
              <input
                id="submit"
                type="submit"
                value="Submit"
                className="btn text-black text-center"
              />
            </div>
          </form>
        </div>
        <div className="mt-8">
          <h2 className="font-semibold text-left text-xl">Project Images</h2>
          <ul className="border border-solid border-white grid grid-cols-4 gap-4 p-4 mt-4 rounded overflow-y-scroll max-h-screen">
            {project.images?.map((image) => (
              <li className="thumb relative max-w-thumb">
                <img
                  src={`https://${window.location.hostname}/images/${image}`}
                  alt={image}
                  className="opacity-100 block transition"
                />
                <div
                  className="cursor-pointer absolute flex items-center justify-center opacity-0 top-1/2 left-1/2 overlay transition w-full h-full"
                  onClick={() => {
                    deleteProjectImage(name, image)
                      .then(() => {
                        alertService.success(
                          "Image deleted successfully!",
                          false
                        );
                        setProjectLength(projectLength + 1);
                      })
                      .catch((error) => {
                        console.error(
                          `error removing image '${image}' from project '${name}': ${error}`
                        );
                        alertService.error(
                          `Error removing image: ${error}`,
                          false
                        );
                      });
                  }}
                >
                  <div className="font-bold text-lg w-max">
                    <AiIcons.AiOutlineClose className="mx-auto w-8 h-8" />
                    Delete image
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <form
            id="image-upload-form"
            onSubmit={uploadImage}
            className="mt-4 p-2"
          >
            <label htmlFor="image" className="pl-3 font-semibold">
              Add project image
            </label>
            <br />
            <input
              type="file"
              name="image"
              onChange={imageChangeHandler}
              className="btn rounded text-center"
            />
            <input
              type="submit"
              name="submit"
              value="Upload"
              className="btn rounded text-black text-center"
            />
          </form>
          <div className="text-xs mb-6">
            <p>Max file size: 8 MB</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    // TODO: Make a 404 page
    <></>
  );
};

export default ProjectSettings;
