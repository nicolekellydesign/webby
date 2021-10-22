const Footer = (): JSX.Element => {
  return (
    <footer
      className="relative justify-center text-xs bottom-0 w-full h-12 mt-8"
      role="contentinfo"
    >
      <div className="text-center py-3">
        <p>&copy; 2020-{new Date().getFullYear()} Nicole Kelly Design</p>
      </div>
    </footer>
  );
};

export default Footer;
