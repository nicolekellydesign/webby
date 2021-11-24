import { useEffect, useState } from "react";
import { alertService } from "@Services/alert.service";
import BlankAvatar from "@Icons/blank-avatar.svg";
import MarkdownInput from "@Components/MarkdownInput";
import Dropzone from "react-dropzone-uploader";
import { Input, Layout, Preview, Submit } from "@Components/dropzone/DropzoneOverrides";

interface StatementElements extends HTMLFormControlsCollection {
  statement: HTMLInputElement;
  submit: HTMLInputElement;
}

interface StatementFormElement extends HTMLFormElement {
  readonly elements: StatementElements;
}

export function About() {
  const [aboutLength, setAboutLength] = useState(0);
  const [portrait, setPortrait] = useState("");
  const [statement, setStatement] = useState("");

  const updatePortrait = (portrait: string) => {
    fetch("/api/v1/admin/about", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portrait: portrait }),
    })
      .then(async (response) => {
        if (!response.ok) {
          return Promise.reject(await response.json());
        }
      })
      .then(() => {
        alertService.success("Portrait uploaded successfully!", true);
        setAboutLength(aboutLength + 1);
      })
      .catch((error) => {
        console.error("error uploading portrait", error);
        alertService.error(`Error uploading portrait: ${error.message}`, false);
      })
      .finally(() => {
        window.scrollTo(0, 0);
      });
  };

  const updateStatement = (event: React.FormEvent<StatementFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { statement, submit } = form.elements;
    submit.disabled = true;

    fetch("/api/v1/admin/about", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statement: statement.value }),
    })
      .then(async (response) => {
        if (!response.ok) {
          return Promise.reject(await response.json());
        }
      })
      .then(() => {
        alertService.success("Designer statement updated!", true);
        setAboutLength(aboutLength + 1);
      })
      .catch((error) => {
        console.error("error updating designer statement", error);
        alertService.error(`Error updating designer statement: ${error.message}`, false);
      })
      .finally(() => {
        submit.disabled = false;
        window.scrollTo(0, 0);
      });
  };

  const updateResume = (resume: string) => {
    fetch("/api/v1/admin/about", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume: resume }),
    })
      .then(async (response) => {
        if (!response.ok) {
          return Promise.reject(await response.json());
        }
      })
      .then(() => {
        alertService.success("Résumé uploaded successfully!", true);
        setAboutLength(aboutLength + 1);
      })
      .catch((error) => {
        console.error("error uploading résumé", error);
        alertService.error(`Error uploading résumé: ${error.message}`, false);
      })
      .finally(() => {
        window.scrollTo(0, 0);
      });
  };

  useEffect(() => {
    fetch("/api/v1/about", {
      method: "GET",
    })
      .then(async (response) => {
        const resp = await response.json();

        if (!response.ok) {
          return Promise.reject(resp);
        }

        return resp;
      })
      .then((json) => {
        setPortrait(json.portrait);
        setStatement(json.statement);
      })
      .catch((error) => {
        console.error("error getting about page details", error);
        alertService.error(`Error getting page details: ${error.message}`, false);
      });
  }, [aboutLength]);

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-4xl text-center">About Page Settings</h1>
      <div className="max-w-max mx-auto my-8">
        <div className="card lg:card-side bordered">
          <figure className="relative">
            {portrait && (
              <img
                src={`/images/${portrait}`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = BlankAvatar;
                  e.currentTarget.classList.add("bg-white");
                  e.currentTarget.classList.add("p-4");
                }}
                alt="portrait"
                className="rounded-xl h-72"
              />
            )}
          </figure>
          <div className="card-body">
            <h2 className="card-title">Update Portrait</h2>

            <div className="card-actions">
              <Dropzone
                getUploadParams={() => {
                  return { method: "POST", url: "/api/v1/admin/upload" };
                }}
                onChangeStatus={({ meta, file }, status) => {
                  console.log(status, meta, file);
                }}
                onSubmit={(files) => {
                  updatePortrait(files[0].meta.name);
                }}
                accept="image/*"
                maxSizeBytes={8 * 1024 * 1024}
                multiple={false}
                LayoutComponent={Layout}
                PreviewComponent={Preview}
                InputComponent={Input}
                SubmitButtonComponent={Submit}
                classNames={{ dropzone: "dropzone" }}
                inputContent="Drag or click to upload portrait"
              />
            </div>
          </div>
        </div>

        <div id="update-about-form" className="card lg:card-side bordered mt-4">
          <form onSubmit={updateStatement} className="card-body">
            <MarkdownInput
              inputId="statement"
              inputName="statement"
              title="Designer Statement"
              startingText={statement}
            />
            <div className="card-actions">
              <button id="submit" type="submit" className="btn btn-primary">
                Update statement
              </button>
            </div>
          </form>
        </div>

        <div className="card lg:card-side bordered mt-4">
          <div className="card-body">
            <h2 className="card-title">Update Résumé</h2>

            <div className="card-actions">
              <Dropzone
                getUploadParams={() => {
                  return { method: "POST", url: "/api/v1/admin/upload" };
                }}
                onChangeStatus={({ meta, file }, status) => {
                  console.log(status, meta, file);
                }}
                onSubmit={(files) => {
                  updateResume(files[0].meta.name);
                }}
                accept="application/pdf"
                maxSizeBytes={8 * 1024 * 1024}
                multiple={false}
                LayoutComponent={Layout}
                PreviewComponent={Preview}
                InputComponent={Input}
                SubmitButtonComponent={Submit}
                classNames={{ dropzone: "dropzone" }}
                inputContent="Drag or click to upload résumé"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
