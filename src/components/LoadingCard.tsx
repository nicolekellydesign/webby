import React from "react";

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
        <button className="btn btn-lg btn-ghost loading" />
        <h6 className="text-gray-400 text-lg">Loading...</h6>
      </div>
    </div>
  );
};
