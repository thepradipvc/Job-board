import { CircularProgress } from "@nextui-org/react";

const Loader = () => {
  return (
    <div className="h-full grid place-items-center">
      <CircularProgress aria-label="Loading..." />
    </div>
  );
};

export default Loader;
