import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface Props {
  isShowing: boolean;
  text: string;
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
}

export function SlideToggle({ isShowing, onClick, text }: Props) {
  const classes = `w-8 h-8 relative inline mr-3`;

  const icon = isShowing ? <AiOutlineMinus className={classes} /> : <AiOutlinePlus className={classes} />;

  return (
    <div id="slide-toggle" className="cursor-pointer m-4 max-w-max" onClick={onClick}>
      {icon}
      <span className="align-middle text-2xl">{text}</span>
    </div>
  );
}
