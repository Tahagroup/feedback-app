import { useEffect, useState } from "react";

function useFetch(url: string) {
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>(undefined);
  const [isLoading, setisLoading] = useState<any>(true);

  // fetch only when URL changed.
  useEffect(() => {
    startFetch();
    async function startFetch() {
      try {
        setisLoading(true);
        const response = await fetch(url);
        // handling problems with server/URL. bad HTTP response:
        if (!response.ok) {
          throw new Error("Response was not OK!");
        }
        const fetchedData = await response.json();
        try {
          setisLoading(false);
          // #TODO:
          if (fetchedData.Response === "False") {
            throw new Error(fetchedData.Error);
          }
          setError(undefined);
          setData(fetchedData);
        } catch (err) {
          // catch any errors while processing fetched data
          let errorMessage;
          if (err instanceof Error) {
            //type gaurd
            errorMessage =
              err.message ===
              "Cannot read properties of undefined (reading 'Response')"
                ? new Error(
                    "There was a problem, check your connection and try again."
                  )
                : err;
            setError(errorMessage);
            console.log(errorMessage);
          }
        } // end of inner try/catch
      } catch (error) {
        // catch any errors while fetching or using json()
        setError(error as Error);
      }
    }
  }, [url]);

  return [data, error, isLoading];
}
export default useFetch;
