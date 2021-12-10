import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router";
import { useQuery } from "react-query";

import remarkGfm from "remark-gfm";

import { LoadingCard } from "@Components/LoadingCard";
import { slideToggle } from "@Components/slider";
import { SlideToggle } from "@Components/SlideToggle";
import { SmoothImage } from "@Components/SmoothImage";
import { NotFound } from "@Pages/NotFound";
import { alertService } from "@Services/alert.service";
import { Project } from "../declarations";
import { ProjectQuery } from "../Queries";

interface ParamTypes {
  name: string;
}

export const ProjectView: React.FC = () => {
  const { name } = useParams<ParamTypes>();
  const projectQuery = useQuery(["projects", name], () => ProjectQuery(name));
  const [projectInfoVisible, setProjectInfoVisible] = useState(false);

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

  return (
    <div className="container text-center mx-auto">
      <div>
        <SlideToggle isShowing={projectInfoVisible} onClick={toggleProjectInfo} text="Project Information" />
        <div id="project-info" className="hidden text-left text-2xl pt-8">
          <h1 className="font-bold text-5xl">{project.title}</h1>
          <ReactMarkdown remarkPlugins={[remarkGfm]} className="pt-6">
            {project.projectInfo}
          </ReactMarkdown>
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
          {project.images?.map((image, idx) => (
            <div key={idx} className="mb-5">
              <SmoothImage alt={image} src={`/images/${image}`} />
            </div>
          ))}
        </div>
      </article>
    </div>
  );
};
