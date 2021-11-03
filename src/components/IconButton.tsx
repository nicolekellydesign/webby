export const DestructiveButton = ({ icon, text, ...rest }: any) => {
  return (
    <button {...rest} className="btn destructive">
      {icon}
      <span>{text}</span>
    </button>
  );
};

const IconButton = ({ icon, text, ...rest }: any) => {
  return (
    <button {...rest} className="btn">
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default IconButton;
