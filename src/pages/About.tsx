import { useEffect, useState } from "react";
import * as AiIcons from "react-icons/ai";
import { alertService } from "../services/alert.service";
import BlankAvatar from "../blank-avatar.svg";

const About = (): JSX.Element => {
  const [statement, setStatement] = useState("");
  const [statementLength] = useState(0);

  useEffect(() => {
    fetch(`https://${window.location.hostname}/api/v1/about`, {
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
    <div className="flex gap-16 ml-28">
      <div className="p-4 max-w-lg w-full">
        <img
          src={`https://${window.location.hostname}/images/about-portrait.jpg`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = BlankAvatar;
            e.currentTarget.classList.add("bg-white");
            e.currentTarget.classList.add("p-4");
            // e.currentTarget.classList.add("w-52");
            // e.currentTarget.classList.add("h-52");
          }}
          alt="portrait"
          className="rounded-xl w-full"
        />
      </div>
      <div className="p-4">
        <h2 className="font-bold text-lg">Designer Statement</h2>
        {statement &&
          statement.split("\n\n").map((paragraph) => (
            <>
              <p className="pt-6">{paragraph}</p>
              <br />
            </>
          ))}
        <button
          type="button"
          className="btn rounded text-black text-center"
          onClick={() => {
            window.open("resources/resume.pdf");
          }}
        >
          <AiIcons.AiOutlineDownload />
          <span>Download Résumé</span>
        </button>
      </div>
    </div>
  );
};

export default About;
