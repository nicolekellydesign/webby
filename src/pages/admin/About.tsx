import { useEffect, useState } from "react";
import * as AiIcons from "react-icons/ai";
import { alertService } from "../../services/alert.service";
import BlankAvatar from "../../blank-avatar.svg";

interface PortraitElements extends HTMLFormControlsCollection {
  image: HTMLInputElement;
  submit: HTMLInputElement;
}

interface PortraitFormElement extends HTMLFormElement {
  readonly elements: PortraitElements;
}

interface StatementElements extends HTMLFormControlsCollection {
  statement: HTMLInputElement;
  submit: HTMLInputElement;
}

interface StatementFormElement extends HTMLFormElement {
  readonly elements: StatementElements;
}

interface ResumeElements extends HTMLFormControlsCollection {
  resume: HTMLInputElement;
  submit: HTMLInputElement;
}

interface ResumeFormElement extends HTMLFormElement {
  readonly elements: ResumeElements;
}

const About = (): JSX.Element => {
  const [aboutLength, setAboutLength] = useState(0);
  const [statement, setStatement] = useState("");

  const [portraitFile, setPortraitFile] = useState<File>();
  const [isPortraitPicked, setIsPortraitPicked] = useState(false);

  const [resumeFile, setResumeFile] = useState<File>();
  const [isResumePicked, setIsResumePicked] = useState(false);

  const portraitChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = event.target;

    if (!files) {
      return;
    }

    setPortraitFile(files[0]);
    setIsPortraitPicked(true);
  };

  const resumeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files) {
      return;
    }

    setResumeFile(files[0]);
    setIsResumePicked(true);
  };

  const uploadPortrait = (event: React.FormEvent<PortraitFormElement>) => {
    event.preventDefault();

    if (!isPortraitPicked || !portraitFile) {
      return;
    }

    const form = event.currentTarget;
    const { submit } = form.elements;
    submit.disabled = true;

    const formData = new FormData();
    formData.append("image", portraitFile);

    window.scrollTo(0, 0);
    alertService.info("Uploading portrait image", true);

    fetch(`https://${window.location.hostname}/api/v1/admin/about/portrait`, {
      method: "PATCH",
      body: formData,
    })
      .then(async (response) => {
        const isJson = response.headers
          .get("Content-Type")
          ?.includes("application/json");
        const body = isJson && (await response.json());

        if (!response.ok) {
          const error = (body && body.message) || response.status;
          Promise.reject(error);
        }

        alertService.success("Portrait image updated successfully!", true);
        setAboutLength(aboutLength + 1);
      })
      .catch((error) => {
        console.error(`error uploading portrait image: ${error}`);
        alertService.error(`Error uploading portrait: ${error}`, false);
      })
      .finally(() => {
        setIsPortraitPicked(false);
        setPortraitFile(undefined);
        form.reset();
        submit.disabled = false;
      });
  };

  const onSubmit = (event: React.FormEvent<StatementFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { statement, submit } = form.elements;
    submit.disabled = true;

    fetch(`https://${window.location.hostname}/api/v1/admin/about`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statement: statement.value }),
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

        alertService.success("Designer statement updated!", true);
        setAboutLength(aboutLength + 1);
      })
      .catch((error) => {
        console.error(`error updating designer statement: ${error}`);
        alertService.error(
          `Error updating designer statement: ${error}`,
          false
        );
      })
      .finally(() => {
        submit.disabled = false;
        window.scrollTo(0, 0);
      });
  };

  const uploadResume = (event: React.FormEvent<ResumeFormElement>) => {
    event.preventDefault();

    if (!isResumePicked || !resumeFile) {
      return;
    }

    const form = event.currentTarget;
    const { submit } = form.elements;
    submit.disabled = true;

    const formData = new FormData();
    formData.append("resume", resumeFile);

    window.scrollTo(0, 0);
    alertService.info("Uploading résumé", true);

    fetch(`https://${window.location.hostname}/api/v1/admin/about/resume`, {
      method: "PATCH",
      body: formData,
    })
      .then(async (response) => {
        const isJson = response.headers
          .get("Content-Type")
          ?.includes("application/json");
        const body = isJson && (await response.json());

        if (!response.ok) {
          const error = (body && body.message) || response.status;
          Promise.reject(error);
        }

        alertService.success("Résumé uploaded successfully!", true);
        setAboutLength(aboutLength + 1);
      })
      .catch((error) => {
        console.error(`error uploading résumé: ${error}`);
        alertService.error(`Error uploading résumé: ${error}`, false);
      })
      .finally(() => {
        setIsResumePicked(false);
        setResumeFile(undefined);
        form.reset();
        submit.disabled = false;
      });
  };

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
  }, [aboutLength]);

  return (
    <div className="container text-center mx-auto">
      <h1 className="font-bold text-5xl">About Page Settings</h1>
      <div className="max-w-max mx-auto my-8">
        <div className="flex">
          <div className="relative max-w-thumb pl-2">
            <img
              src={`https://${window.location.hostname}/images/about-portrait.jpg`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = BlankAvatar;
                e.currentTarget.classList.add("bg-white");
                e.currentTarget.classList.add("p-4");
              }}
              alt="portrait"
              className="rounded-xl w-52 h-52"
            />
          </div>
          <div className="flex flex-col items-start mt-4">
            <form
              id="thumbnail-upload-form"
              onSubmit={uploadPortrait}
              className="mt-8 p-2"
            >
              <div className="text-left">
                <label htmlFor="image" className="pl-3 font-semibold">
                  Change portrait
                </label>
                <br />
                <div className="pl-3 text-xs">
                  <p>Max file size: 8 MB</p>
                </div>
                <br />
                <input
                  type="file"
                  accept="image/jpeg"
                  name="image"
                  title="Only images allowed."
                  onChange={portraitChangeHandler}
                  className="btn rounded text-center"
                  required
                />
                <br />
                <div className="pl-3">
                  <button
                    type="submit"
                    name="submit"
                    className="btn rounded text-black text-center"
                  >
                    <AiIcons.AiOutlineUpload />
                    <span>Upload Portrait</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div id="update-about-form" className="mt-4">
          <form onSubmit={onSubmit} className="text-left">
            <div className="p-2">
              <label htmlFor="title" className="font-semibold">
                Designer Statement
              </label>
              <br />
              <textarea
                id="statement"
                name="statement"
                defaultValue={statement}
                className="w-full text-black min-h-textLarge"
                required
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

        <div className="mt-4">
          <form onSubmit={uploadResume} className="text-left">
            <div className="p-2">
              <label htmlFor="resume" className="font-semibold">
                Résumé
              </label>
              <br />
              <input
                type="file"
                accept="application/pdf"
                name="resume"
                title="Only PDF files allowed."
                onChange={resumeChangeHandler}
                className="btn rounded text-center"
                required
              />
              <br />
              <div className="pl-3">
                <button
                  type="submit"
                  name="submit"
                  className="btn rounded text-black text-center"
                >
                  <AiIcons.AiOutlineUpload />
                  <span>Upload Résumé</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default About;
