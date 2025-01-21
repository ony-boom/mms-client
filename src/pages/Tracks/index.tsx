import { useApiClient } from "@/hooks";
import { PageTitle } from "@/components";
import { Loading } from "./components/loading";
import { TracksGrid } from "./components/tracks-grid";

export function Tracks() {
  const api = useApiClient();
  const { isLoading, data } = api.useTracks();

  return (
    <>
      <PageTitle>Tracks</PageTitle>
      <div className="mt-2">
        {isLoading ? <Loading /> : <TracksGrid tracks={data ?? []} />}
      </div>
    </>
  );
}
