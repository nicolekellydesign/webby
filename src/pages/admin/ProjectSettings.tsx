import { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router";
import * as AiIcons from "react-icons/ai";
import {
  addProjectImage,
  changeThumbnail,
  deleteGalleryItem,
  deleteProjectImages,
  GalleryItem,
  getProject,
  updateProject,
} from "../../entities/GalleryItem";
import { alertService } from "../../services/alert.service";
import NotFound from "../NotFound";
import IconButton, { DestructiveButton } from "../../components/IconButton";
import DialogBox from "../../components/DialogBox";

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

  const [imagesDialogOpen, setImagesDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [project, setProject] = useState<GalleryItem>();
  const [projectLength, setProjectLength] = useState(0);

  const [thumbFile, setThumbFile] = useState<File>();
  const [isThumbPicked, setIsThumbPicked] = useState(false);

  const [imageFile, setImageFile] = useState<File>();
  const [isImagePicked, setIsImagePicked] = useState(false);

  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

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

  const deleteImages = () => {
    deleteProjectImages(name, selectedImages)
      .then(() => {
        alertService.success("Image(s) deleted successfully!", true);
        setProjectLength(projectLength + 1);
      })
      .catch((error) => {
        console.error(`error removing images from project '${name}': ${error}`);
        alertService.error(`Error removing images: ${error}`, false);
      })
      .finally(() => {
        setSelectedImages([]);
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
    <div className="container text-center mx-auto">
      <h1 className="font-bold text-5xl">Project Settings</h1>
      <div className="max-w-max mx-auto my-8">
        <div className="flex">
          <div className="relative max-w-thumb pl-2">
            <img src={`/images/${project.thumbnail}`} alt={project.title} />
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
                  accept="image/*"
                  name="image"
                  title="Only images allowed."
                  onChange={thumbChangeHandler}
                  className="btn"
                  required
                />
                <br />
                <div className="pl-3">
                  <IconButton
                    type="submit"
                    name="submit"
                    icon={<AiIcons.AiOutlineUpload />}
                    text="Upload thumbnail"
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
                defaultValue={project.embedURL}
                className="w-full text-black"
              />
            </div>
            <div className="p-2">
              <input
                id="submit"
                type="submit"
                value="Update project"
                className="btn"
              />
            </div>
          </form>
        </div>

        <div className="mt-8 w-6xl">
          <h2 className="font-semibold text-left text-xl">Project Images</h2>
          <ul className="border border-solid border-white flex flex-wrap gap-4 justify-center py-8 mt-4 rounded overflow-y-scroll max-h-screen">
            {project.images?.map((image) => (
              <li
                className="bg-cover bg-center bg-no-repeat cursor-pointer flex flex-col justify-center w-64 h-64"
                data-src={`/images/${image}`}
                style={{
                  backgroundImage: `url("/images/${image}")`,
                }}
              >
                {selectedImages.some((name) => name === image) ? (
                  <div
                    className="opacity-70 bg-black hover:text-blue-400 relative flex-1 flex flex-col justify-center align-middle overflow-hidden transition"
                    onClick={() => {
                      setSelectedImages((selectedImages) =>
                        selectedImages.filter((name) => name !== image)
                      );
                    }}
                    title="Unselect image"
                  >
                    <div className="box-border font-bold text-lg mx-auto w-max">
                      <div className="w-max">
                        <AiIcons.AiOutlineCheckCircle className="w-12 h-12" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="opacity-0 hover:opacity-70 hover:bg-black relative flex-1 flex flex-col justify-center align-middle overflow-hidden transition"
                    onClick={() => {
                      setSelectedImages((selectedImages) =>
                        selectedImages.concat(image)
                      );
                    }}
                    title="Select image"
                  >
                    <div className="box-border font-bold text-lg mx-auto w-max">
                      <div className="w-max">
                        <AiIcons.AiOutlineCheck className="mx-auto w-12 h-12" />
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <form
              id="image-upload-form"
              onSubmit={uploadImage}
              className="flex flex-col items-start p-2"
            >
              <div className="text-left">
                <label htmlFor="image" className="pl-3 font-semibold">
                  Manage project images
                </label>
                <br />
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  title="Only images allowed."
                  onChange={imageChangeHandler}
                  className="btn"
                />

                <div className="text-center text-xs pl-3 mb-6">
                  <p>Max file size: 8 MB</p>
                </div>
              </div>

              <div className="flex gap-4 pl-3">
                <IconButton
                  type="submit"
                  name="submit"
                  icon={<AiIcons.AiOutlineUpload />}
                  text="Upload image"
                />
                {selectedImages.length > 0 && (
                  <div className="fade-in">
                    <DestructiveButton
                      icon={<AiIcons.AiOutlineDelete />}
                      text="Delete selected"
                      onClick={() => {
                        setImagesDialogOpen(true);
                      }}
                    ></DestructiveButton>
                  </div>
                )}
              </div>
            </form>
          </div>

          <DialogBox
            show={imagesDialogOpen}
            type="warning"
            onClose={() => {
              setImagesDialogOpen(false);
            }}
            onConfirm={() => {
              deleteImages();
              setImagesDialogOpen(false);
            }}
          >
            <div className="flex-grow p-4">
              <h2 className="font-bold text-xl">
                Are you sure you want to delete {selectedImages.length}{" "}
                {selectedImages.length === 1 ? "image" : "images"}?
              </h2>
              <br />
              <p className="text-lg">This action cannot be reversed.</p>
            </div>
          </DialogBox>
        </div>

        <div className="mt-8">
          <DestructiveButton
            icon={<AiIcons.AiOutlineDelete />}
            text="Delete project"
            onClick={() => {
              setProjectDialogOpen(true);
            }}
          />
        </div>
      </div>

      <DialogBox
        show={projectDialogOpen}
        type="warning"
        onClose={() => {
          setProjectDialogOpen(false);
        }}
        onConfirm={deleteProject}
      >
        <div className="flex-grow p-4">
          <h2 className="font-bold text-xl">
            Are you sure you want to delete this project?
          </h2>
          <br />
          <p className="text-lg">This action cannot be reversed.</p>
        </div>
      </DialogBox>
    </div>
  ) : (
    <NotFound />
  );
};

export default ProjectSettings;
