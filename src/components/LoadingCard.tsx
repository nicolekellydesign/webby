import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

export const LoadingCard: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        maxHeight: "40vh",
        width: "40vw",
        top: "20vh",
        left: "30vw",
        paddingTop: "10vh",
        paddingBottom: "10vh",
      }}
    >
      <div className="flex items-center justify-center">
        <div className="p-32">
          <AiOutlineLoading className="animate-spin stroke-current w-16 h-16" />
          <h6 className="text-gray-400 text-lg mt-4">Loading...</h6>
        </div>
      </div>
    </div>
  );
};
