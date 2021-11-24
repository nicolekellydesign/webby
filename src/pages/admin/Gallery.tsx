import { useEffect, useState } from "react";
import * as AiIcons from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { addGalleryItem, GalleryItem, getGalleryItems } from "@Entities/GalleryItem";
import { alertService } from "@Services/alert.service";
import { slideToggle } from "@Components/slider";
import MarkdownInput from "@Components/MarkdownInput";

interface AddProjectElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  title: HTMLInputElement;
  caption: HTMLInputElement;
  projectInfo: HTMLInputElement;
  embedURL: HTMLInputElement;
  thumbnail: HTMLInputElement;
  submitButton: HTMLInputElement;
}

interface AddProjectFormElement extends HTMLFormElement {
  readonly elements: AddProjectElements;
}

export function AdminGallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryItemsLength, setGalleryItemsLength] = useState(0);

  const [selectedFile, setSelectedFile] = useState<File>();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const [addProjectVisible, setAddProjectVisible] = useState(false);

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
    const { name, title, caption, projectInfo, embedURL, submitButton } = form.elements;

    submitButton.disabled = true;
    const item: GalleryItem = {
      name: name.value,
      title: title.value,
      caption: caption.value,
      projectInfo: projectInfo.value,
      embedURL: embedURL.value,
    };

    addGalleryItem(item, selectedFile, selectedFile.name)
      .then(() => {
        alertService.success("Gallery project added successfully!", false);
        setGalleryItemsLength(galleryItemsLength + 1);
      })
      .catch((error) => {
        console.error("error adding new gallery project", error);
        alertService.error(`Error adding new project: ${error.message}`, false);
      })
      .finally(() => {
        toggleAddProject();

        setIsFilePicked(false);
        setSelectedFile(undefined);

        form.reset();
        submitButton.disabled = false;
      });
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

  useEffect(() => {
    getGalleryItems()
      .then((items) => {
        setGalleryItems(items);
      })
      .catch((error) => {
        console.error("error getting gallery items", error);
        alertService.error(`Error getting gallery items: ${error.message}`, false);
      });
  }, [galleryItemsLength]);

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-4xl text-center">Portfolio Gallery Settings</h1>

      <div className="max-w-max mx-auto my-8">
        <div className="card lg:card-side bordered w-7xl">
          <div className="card-body">
            <h2 className="card-title">Gallery Projects</h2>

            <ul className="max-w-6xl max-h-80 gap-4 image-scroller carousel-center rounded-box p-4">
              {galleryItems.map((galleryItem) => (
                <li
                  data-src={`/images/${galleryItem.thumbnail}`}
                  className="carousel-item rounded-box bg-cover bg-center bg-no-repeat cursor-pointer justify-center w-64 h-64"
                  style={{
                    backgroundImage: `url("/images/${galleryItem.thumbnail}")`,
                  }}
                >
                  <NavLink
                    to={`/admin/gallery/${galleryItem.name}`}
                    className="opacity-0 hover:opacity-70 hover:bg-black rounded-box relative flex-1 flex flex-col justify-center align-middle overflow-hidden transition"
                  >
                    <div className="box-border font-bold text-lg mx-auto w-max">
                      <div className="font-bold text-lg w-max">
                        <AiIcons.AiOutlineSetting className="mx-auto w-8 h-8" />
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
            <form onSubmit={onSubmit} className="text-left">
              <div className="form-control">
                <label htmlFor="name" className="label">
                  <span className="label-text">Project name</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="project-name"
                  pattern="[A-z\d\-_]+"
                  title="Only use letters, numbers, - and _ characters."
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <label htmlFor="title" className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Project Title"
                  className="input input-bordered w-full"
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
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <MarkdownInput inputId="projectInfo" inputName="projectInfo" label="Project info" />
              <div className="form-control">
                <label htmlFor="embedURL" className="label">
                  <span className="label-text">Embed URL (optional)</span>
                </label>
                <input
                  id="embedURL"
                  type="text"
                  name="embedURL"
                  placeholder="https://youtube.com/embed/video-key"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label htmlFor="thumbnail" className="label">
                  <span className="label-text">Project thumbnail</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="thumbnail"
                  title="Only images allowed."
                  onChange={changeHandler}
                  className="btn btn-ghost"
                  required
                />
              </div>
              <div className="form-control mt-4">
                <button id="submitButton" type="submit" className="btn btn-primary">
                  Add project
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
