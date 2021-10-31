import { useHistory } from "react-router";
import { AiOutlineArrowLeft } from "react-icons/ai";

const NotFound = (): JSX.Element => {
  const history = useHistory();

  return (
    <div className="container text-center mx-auto mt-28">
      <div className="m-auto text-center text-2xl">
        <h2 className="text-5xl">Page Not Found</h2>
        <p className="pt-6">Sorry, that page doesn't exist!</p>
        {history.length > 0 && (
          <div onClick={() => history.goBack()} className="cursor-pointer mt-4">
            <AiOutlineArrowLeft className="w-8 h-8 relative inline mr-3" />
            <span className="align-middle">Go back</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFound;
