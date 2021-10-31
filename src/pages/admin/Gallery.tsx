import { useEffect, useState } from "react";
import * as AiIcons from "react-icons/ai";
import {
  addGalleryItem,
  GalleryItem,
  getGalleryItems,
} from "../../entities/GalleryItem";
import { alertService } from "../../services/alert.service";
import { slideToggle } from "../../components/slider";
import { NavLink } from "react-router-dom";
import SlideToggle from "../../components/SlideToggle";

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

const AdminGallery = (): JSX.Element => {
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
    const { name, title, caption, projectInfo, embedURL, submitButton } =
      form.elements;

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
        console.error(`error adding new gallery project: ${error}`);
        alertService.error(`Error adding new project: ${error}`, false);
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
        console.info({ items });
        setGalleryItems(items);
      })
      .catch((error) => {
        console.error(`error getting gallery items: ${error}`);
        alertService.error(`Error getting gallery items: ${error}`, false);
      });
  }, [galleryItemsLength]);

  return (
    <div className="container text-center mx-auto">
      <h1 className="font-bold text-5xl">Portfolio Gallery Settings</h1>
      <div className="max-w-max mx-auto my-8">
        <ul className="border border-solid border-white grid grid-cols-4 gap-4 p-4 rounded overflow-y-scroll max-h-screen">
          {galleryItems.map((galleryItem) => (
            <li className="thumb relative max-w-thumb">
              <NavLink to={`/admin/gallery/${galleryItem.name}`}>
                <img
                  src={`https://${window.location.hostname}/images/${galleryItem.thumbnail}`}
                  alt={galleryItem.title}
                  className="opacity-100 block transition"
                />
                <div className="cursor-pointer absolute flex items-center justify-center opacity-0 top-1/2 left-1/2 overlay transition w-full h-full">
                  <div className="font-bold text-lg w-max">
                    <AiIcons.AiOutlineSetting className="mx-auto w-8 h-8" />
                    Project Settings
                  </div>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="min-w-textLarge">
          <SlideToggle
            isShowing={addProjectVisible}
            onClick={toggleAddProject}
            text="Add new project"
          />
          <div id="add-project-form" className="hidden">
            <form onSubmit={onSubmit} className="text-left">
              <div className="p-2">
                <label htmlFor="name">Project name</label>
                <br />
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="project-name"
                  pattern="[A-z\d\-_]+"
                  title="Only use letters, numbers, - and _ characters."
                  className="w-full text-black"
                  required
                />
              </div>
              <div className="p-2">
                <label htmlFor="title">Title</label>
                <br />
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Project Title"
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
                  className="w-full text-black"
                />
              </div>
              <div className="p-2">
                <label htmlFor="thumbnail">Project thumbnail</label>
                <br />
                <input
                  type="file"
                  accept="image/*"
                  name="thumbnail"
                  title="Only images allowed."
                  onChange={changeHandler}
                  className="btn rounded text-center"
                  style={{ paddingLeft: 0 }}
                  required
                />
              </div>
              <div className="p-2">
                <input
                  id="submitButton"
                  type="submit"
                  value="Submit"
                  className="btn text-black text-center"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;
