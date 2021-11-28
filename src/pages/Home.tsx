import { NavLink } from "react-router-dom";
import { useQuery } from "react-query";

import { LoadingCard } from "@Components/LoadingCard";
import { alertService } from "@Services/alert.service";
import { Project } from "../declarations";
import { ProjectsQuery } from "../Queries";

export const Home: React.FC = () => {
  const projectsQuery = useQuery("projects", ProjectsQuery);

  if (projectsQuery.isLoading) {
    return <LoadingCard />;
  }

  if (projectsQuery.isError) {
    console.error("error getting projects", projectsQuery.error);
    alertService.error(`Error getting projects: ${projectsQuery.error}`, false);
  }

  const projects = projectsQuery.data as Project[];

  return (
    <>
      <div className="mx-auto my-0">
        <div className="min-h-60">
          <p className="font-bold text-xl text-center py-8">
            “If you can design one thing, you can design everything.” &mdash; Massimo Vignelli
          </p>
        </div>

        <div className="flex flex-wrap">
          {projects.map((project) => (
            <div className="w-full xl:w-1/2 p-4">
              <div
                className="bg-cover bg-center bg-no-repeat"
                data-src={`/images/${project.thumbnail}`}
                style={{
                  backgroundImage: `url("/images/${project.thumbnail}")`,
                }}
              >
                <NavLink
                  to={`/project/${project.name}`}
                  className="opacity-0 hover:opacity-70 hover:bg-black block relative overflow-hidden pb-2/3 transition"
                >
                  <div className="absolute box-border max-w-xs h-full p-5">
                    <h2 className="text-white mb-0 font-bold text-2xl">{project.title}</h2>
                    <p className="text-white text-xl">{project.caption}</p>
                  </div>
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
