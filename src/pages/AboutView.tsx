import React from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { useQuery } from "react-query";

import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

import { LoadingCard } from "@Components/LoadingCard";
import BlankAvatar from "@Icons/blank-avatar.svg";
import { alertService } from "@Services/alert.service";
import { About } from "../declarations";
import { AboutQuery } from "../Queries";

export const AboutView: React.FC = () => {
  const aboutQuery = useQuery("about", AboutQuery);

  if (aboutQuery.isLoading) {
    return <LoadingCard />;
  }

  if (aboutQuery.isError) {
    console.error("error getting about page", aboutQuery.error);
    alertService.error(`Error getting about page: ${aboutQuery.error}`, false);
  }

  const about = aboutQuery.data as About;

  return (
    <div className="container mx-auto mt-8">
      <div className="card lg:card-side">
        <figure>
          {about.portrait && (
            <img
              src={`/images/${about.portrait}`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = BlankAvatar;
                e.currentTarget.classList.add("bg-white");
                e.currentTarget.classList.add("p-4");
              }}
              alt="portrait"
              className="rounded-xl lg:h-192"
            />
          )}
        </figure>

        <article className="card-body prose pl-24 max-w-4xl">
          <h2 className="card-title">Designer Statement</h2>
          {about.statement && <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.statement}</ReactMarkdown>}

          {about.resume && (
            <div className="card-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  window.open(`/resources/${about.resume}`);
                }}
              >
                <AiOutlineDownload className="btn-icon" />
                Download résumé
              </button>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
