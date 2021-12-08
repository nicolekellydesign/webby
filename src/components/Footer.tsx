import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="p-4 footer text-base-content footer-center mt-8" role="contentinfo">
      <div>
        <p>&copy; 2020 &ndash; {new Date().getFullYear()} Nicole Kelly Design</p>
      </div>
    </footer>
  );
};
