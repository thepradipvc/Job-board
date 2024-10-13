import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  // Extract the error message from the error object
  let errorMessage;
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }

  return (
    <div
      id="error-page"
      className="grid h-svh place-items-center gap-4 text-center"
    >
      <div className="grid gap-8">
        <h1 className="text-4xl font-bold">Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-400">
          <i>{errorMessage}</i>
        </p>
      </div>
    </div>
  );
}
