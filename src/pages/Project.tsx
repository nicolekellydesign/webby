import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { slideToggle } from "../components/slider";
import SlideToggle from "../components/SlideToggle";
import { GalleryItem, getProject } from "../entities/GalleryItem";
import { alertService } from "../services/alert.service";

interface ParamTypes {
  name: string;
}

const Project = (): JSX.Element => {
  const { name } = useParams<ParamTypes>();
  const [project, setProject] = useState<GalleryItem>();
  const [projectInfoVisible, setProjectInfoVisible] = useState(false);

  const toggleProjectInfo = () => {
    const toggle = document.getElementById("slide-toggle");
    if (!toggle) {
      return;
    }

    const info = document.getElementById("project-info");
    if (!info) {
      return;
    }

    toggle.classList.toggle("active");
    slideToggle(info, projectInfoVisible, 150);
    setProjectInfoVisible(!projectInfoVisible);
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
  }, [name]);

  return project ? (
    <div className="container text-center mx-auto">
      <div>
        <SlideToggle
          isShowing={projectInfoVisible}
          onClick={toggleProjectInfo}
          text="Project Information"
        />
        <div id="project-info" className="hidden text-xl">
          <h1 className="font-bold text-5xl">{project.title}</h1>
          <p className="pt-4 text-left">{project.projectInfo}</p>
        </div>
      </div>
      <article className="block mt-8">
        <div className="flex flex-wrap">
          {project.embedURL && project.embedURL?.length > 0 && (
            <div className="box-border px-2 w-full">
              <div className="relative p-0 w-full">
                <iframe
                  src={project.embedURL}
                  title="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  className="absolute border-none top-0 left-0 w-full h-full"
                />
              </div>
            </div>
          )}
          {project.images?.map((image) => (
            <div className="box-border px-2 w-full">
              <img
                alt=""
                data-src={`/images/${image}`}
                src={`/images/${image}`}
                className="block mb-5 w-full"
              />
            </div>
          ))}
        </div>
      </article>
    </div>
  ) : (
    // TODO: Make a 404 page
    <></>
  );
};

export default Project;
