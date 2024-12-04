import useSWR from "swr";
import { fetchJson } from "./fetching";

type Dataset = {
  id: number;
  name: string;
};
type UmaSetPoint={
  id: number;
  x_coor: number;
  y_coor: number;
  sample_id:number;

}


export function useDatasets() {
  const { data, error, isLoading } = useSWR<Dataset[]>(
    "/api/dataset/",
    fetchJson
  );

  return {
    datasets: data,
    isLoading,
    isError: error
  };
}

export function useUmaSetPoints() {
  const { data, error, isLoading } = useSWR<UmaSetPoint[]>(
    "/api/UmaPlotPoint/?id=3",
    fetchJson
  );

  return {
    datasets: data,
    isLoading,
    isError: error
  };
}