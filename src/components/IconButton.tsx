const IconButton = ({ icon, text, ...rest }: any) => {
  return (
    <button {...rest} className="btn rounded text-black text-center">
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default IconButton;
