import { useState } from "react";
import { useParams } from "react-router";
import { GalleryItem } from "../entities/GalleryItem";

interface ParamTypes {
  name: string;
}

const ProjectSettings = (): JSX.Element => {
  const { name } = useParams<ParamTypes>();

  return (
    <div className="container text-center mx-auto">
      <h1 className="font-bold text-5xl">Project Settings</h1>
      <div className="max-w-max mx-auto my-8">
        <form>
          <input id="title" type="text" name="title" value={name} required />
        </form>
      </div>
    </div>
  );
};

export default ProjectSettings;
