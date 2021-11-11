import { MutableRefObject, useEffect, useRef, useState } from "react";
import * as AiIcons from "react-icons/ai";
import { alertService } from "../../services/alert.service";
import BlankAvatar from "../../icons/blank-avatar.svg";
import UploadService, { ProgressInfo } from "../../services/upload.service";
import ProgressInfoDisplay from "../../components/ProgressInfo";

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
  const [portraitProgressInfo, setPortraitProgressInfo] =
    useState<ProgressInfo>();
  const portraitProgressInfoRef = useRef<any>(null);

  const [resumeFile, setResumeFile] = useState<File>();
  const [resumeProgressInfo, setResumeProgressInfo] = useState<ProgressInfo>();
  const resumeProgressInfoRef = useRef<any>(null);

  const portraitChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = event.target;

    if (!files) {
      return;
    }

    setPortraitFile(files[0]);
    setPortraitProgressInfo(undefined);
  };

  const resumeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files) {
      return;
    }

    setResumeFile(files[0]);
    setResumeProgressInfo(undefined);
  };

  const uploadPortrait = (event: React.FormEvent<PortraitFormElement>) => {
    event.preventDefault();

    if (!portraitFile) {
      return;
    }

    const form = event.currentTarget;
    const { submit } = form.elements;
    submit.disabled = true;

    let _progressInfo = { percentage: 0, fileName: "about-portrait.jpg" };
    portraitProgressInfoRef.current = {
      val: _progressInfo,
    };

    upload(portraitFile, portraitProgressInfoRef, "portrait")
      .then(() => {
        alertService.success("Portrait uploaded successfully!", true);
        setAboutLength(aboutLength + 1);
      })
      .catch((error) => {
        console.error(`error uploading portrait: ${error}`);
        alertService.error(`Error uploading portrait: ${error}`, false);
      })
      .finally(() => {
        form.reset();
        submit.disabled = false;
      });
  };

  const onSubmit = (event: React.FormEvent<StatementFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { statement, submit } = form.elements;
    submit.disabled = true;

    fetch("api/v1/admin/about", {
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

  const handleUploadResume = (event: React.FormEvent<ResumeFormElement>) => {
    event.preventDefault();

    if (!resumeFile) {
      return;
    }

    const form = event.currentTarget;
    const { submit } = form.elements;
    submit.disabled = true;

    let _progressInfo = { percentage: 0, fileName: resumeFile.name };
    resumeProgressInfoRef.current = {
      val: _progressInfo,
    };

    upload(resumeFile, resumeProgressInfoRef, "resume")
      .then(() => {
        alertService.success("Résumé uploaded successfully!", true);
        setAboutLength(aboutLength + 1);
      })
      .catch((error) => {
        console.error(`error uploading résumé: ${error}`);
        alertService.error(`Error uploading résumé: ${error}`, false);
      })
      .finally(() => {
        setResumeFile(undefined);
        form.reset();
        submit.disabled = false;
      });
  };

  const upload = (
    file: File,
    ref: MutableRefObject<any>,
    type: "portrait" | "resume"
  ): Promise<string> => {
    let _progressInfo = ref.current.val;

    return new Promise((resolve, reject) => {
      UploadService.upload(
        file,
        (percentage) => {
          _progressInfo.percentage = percentage;
          switch (type) {
            case "portrait":
              setPortraitProgressInfo(_progressInfo);
              break;
            case "resume":
              setResumeProgressInfo(_progressInfo);
              break;
            default:
              break;
          }
        },
        (status, response) => {
          if (status !== 200) {
            _progressInfo.percentage = 0;
            switch (type) {
              case "portrait":
                setPortraitProgressInfo(_progressInfo);
                break;
              case "resume":
                setResumeProgressInfo(_progressInfo);
                break;
              default:
                break;
            }
            reject(response.statusText);
          } else {
            resolve(_progressInfo.fileName);
          }
        }
      );
    });
  };

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
  }, [aboutLength]);

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-4xl text-center">About Page Settings</h1>
      <div className="max-w-max mx-auto my-8">
        <div className="card lg:card-side bordered">
          <figure className="relative">
            <img
              src="/images/about-portrait.jpg"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = BlankAvatar;
                e.currentTarget.classList.add("bg-white");
                e.currentTarget.classList.add("p-4");
              }}
              alt="portrait"
              className="rounded-xl h-72"
            />
          </figure>
          <form
            id="thumbnail-upload-form"
            onSubmit={uploadPortrait}
            className="card-body"
          >
            <div className="form-control">
              <label htmlFor="image" className="card-title">
                Change portrait
              </label>
              <div className="text-xs">
                <p>Max file size: 8 MB</p>
              </div>
              <div className="card-actions">
                <input
                  type="file"
                  accept="image/jpeg"
                  name="image"
                  title="Only images allowed."
                  onChange={portraitChangeHandler}
                  className="btn btn-ghost"
                  required
                />
                <button type="submit" name="submit" className="btn btn-primary">
                  <AiIcons.AiOutlineUpload className="inline-block w-6 h-6 mr-2 stroke-current" />
                  Upload portrait
                </button>
              </div>
            </div>

            {portraitProgressInfo && (
              <ProgressInfoDisplay
                percentage={portraitProgressInfo.percentage}
              />
            )}
          </form>
        </div>

        <div id="update-about-form" className="card lg:card-side bordered mt-4">
          <form onSubmit={onSubmit} className="card-body">
            <div className="form-control">
              <label htmlFor="title" className="card-title">
                Designer Statement
              </label>
              <textarea
                id="statement"
                name="statement"
                defaultValue={statement}
                className="textarea textarea-bordered h-96"
                required
              />
            </div>
            <div className="card-actions">
              <button id="submit" type="submit" className="btn btn-primary">
                Update statement
              </button>
            </div>
          </form>
        </div>

        <div className="card lg:card-side bordered mt-4">
          <form onSubmit={handleUploadResume} className="card-body">
            <div className="form-control">
              <label htmlFor="resume" className="card-title">
                Upload résumé
              </label>
              <div className="card-actions">
                <input
                  type="file"
                  accept="application/pdf"
                  name="resume"
                  title="Only PDF files allowed."
                  onChange={resumeChangeHandler}
                  className="btn btn-ghost"
                  required
                />
                <button type="submit" name="submit" className="btn btn-primary">
                  <AiIcons.AiOutlineUpload className="inline-block w-6 h-6 mr-2 stroke-current" />
                  Upload résumé
                </button>
              </div>
            </div>

            {resumeProgressInfo && (
              <ProgressInfoDisplay percentage={resumeProgressInfo.percentage} />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default About;
