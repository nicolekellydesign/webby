import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

import Dropzone from "react-dropzone-uploader";

import { Input, Layout, Preview, Submit } from "@Components/dropzone/DropzoneOverrides";
import { LoadingCard } from "@Components/LoadingCard";
import { MarkdownInput } from "@Components/MarkdownInput";
import BlankAvatar from "@Icons/blank-avatar.svg";
import { alertService } from "@Services/alert.service";
import { About, APIError } from "../../declarations";
import { AboutQuery } from "../../Queries";

interface StatementElements extends HTMLFormControlsCollection {
  statement: HTMLInputElement;
  submit: HTMLInputElement;
}

interface StatementFormElement extends HTMLFormElement {
  readonly elements: StatementElements;
}

export const AdminAboutView: React.FC = () => {
  const queryClient = useQueryClient();
  const aboutQuery = useQuery("about", AboutQuery);

  const mutation = useMutation(
    (update) => {
      return axios.patch("/api/v1/admin/about", update);
    },
    {
      onMutate: async (newAbout: About) => {
        await queryClient.cancelQueries("about");

        const previousAbout = queryClient.getQueryData("about");

        queryClient.setQueryData("about", newAbout);

        return { previousAbout, newAbout };
      },
      onSuccess: () => {
        alertService.success("About info updated successfully!", true);
      },
      onError: (error: AxiosError, _, context) => {
        const err: APIError = error.response?.data;
        queryClient.setQueryData("about", context?.previousAbout);

        console.error("error updating about info", { err });
        alertService.error(`Error updating About page: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries("about");
        window.scrollTo(0, 0);
      },
    }
  );

  if (aboutQuery.isLoading) {
    return <LoadingCard />;
  }

  if (aboutQuery.isError) {
    console.error("error getting about info", aboutQuery.error);
    alertService.error(`Error getting about info: ${aboutQuery.error}`, false);
  }

  const about = aboutQuery.data as About;

  const updatePortrait = (portrait: string) => {
    mutation.mutate({ portrait: portrait });
  };

  const updateStatement = (event: React.FormEvent<StatementFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { statement } = form.elements;

    mutation.mutate({ statement: statement.value });
  };

  const updateResume = (resume: string) => {
    mutation.mutate({ resume: resume });
  };

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-4xl text-center">About Page Settings</h1>
      <div className="max-w-max mx-auto my-8">
        <div className="card lg:card-side bordered">
          <figure className="relative">
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
                disabled={mutation.isLoading}
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
              startingText={about.statement}
            />
            <div className="card-actions">
              <button id="submit" type="submit" className="btn btn-primary" disabled={mutation.isLoading}>
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
                disabled={mutation.isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
