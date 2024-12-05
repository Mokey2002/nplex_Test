import useSWR from "swr";
import { fetchJson } from "./fetching";

type UmaSetPoint2={
  id: number;
  x_coor: number;
  y_coor: number;
  sample_id:number;

}

export function useUmaSetPoints2() {
  const { data, error, isLoading } = useSWR<UmaSetPoint2[]>(
    "/api/UmaPlotPoint/?id=4",
    fetchJson
  );

  return {
    datasets2: data,
    isLoading,
    isError: error
  };
}