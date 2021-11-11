import { useEffect, useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { alertService } from "../services/alert.service";
import BlankAvatar from "../blank-avatar.svg";

const About = (): JSX.Element => {
  const [statement, setStatement] = useState("");
  const [statementLength] = useState(0);

  useEffect(() => {
    fetch("api/v1/about", {
      method: "GET",
    })
      .then(async (response) => {
        const isJson = response.headers
          .get("Content-Type")
          ?.includes("application/json");
        const body = isJson && (await response.json());

        if (!response.ok) {
          const error = (body && body.message) || response.status;
          return Promise.reject(error);
        }

        setStatement(body.statement);
      })
      .catch((error) => {
        console.error(`error getting about page statement: ${error}`);
        alertService.error(`Error getting designer statement: ${error}`, false);
      });
  }, [statementLength]);

  return (
    <div className="container mx-auto mt-8">
      <div className="card lg:card-side">
        <figure>
          <img
            src={"/images/about-portrait.jpg"}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = BlankAvatar;
              e.currentTarget.classList.add("bg-white");
              e.currentTarget.classList.add("p-4");
            }}
            alt="portrait"
            className="rounded-xl h-192"
          />
        </figure>

        <article className="card-body prose pl-24 max-w-4xl">
          <h2 className="card-title">Designer Statement</h2>
          {statement &&
            statement.split("\n\n").map((paragraph) => <p>{paragraph}</p>)}

          <div className="card-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                window.open("/resources/resume.pdf");
              }}
            >
              <AiOutlineDownload className="inline-block w-6 h-6 mr-2 stroke-current" />
              Download résumé
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default About;
