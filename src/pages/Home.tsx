import { useApiClient } from "@/hooks";

export function Home() {
  const api = useApiClient();

  const { loading, data, errors } = api.useTracks();

  console.log({
    loading,
    data,
    errors,
  });

  return <div>Home</div>;
}
