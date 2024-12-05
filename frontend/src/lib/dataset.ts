import useSWR from "swr";
import { fetchJson } from "./fetching";

type Dataset = {
  id: number;
  name: string;
};
/*
type UmaSetPointwithColors={
  signal: number;
  x_coor: number;
  y_coor: number;
  sample_id:number;

}*/
export type UmaSetPoint = {
  id: number;
  x_coor: number;
  y_coor: number;
  sample_id: number;
  signal:number;
};

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
/*
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
}*/
export function useUmaSetPoints_Donor1() {
  const { data, error, isLoading } = useSWR<UmaSetPoint[]>(
    '/api/MetaData/?id=3&&metadata={"donor":"Donor 1"}',
    fetchJson
  );

  return {
    datasetsD1: data,
    isLoading,
    isError: error
  };
}
export function useUmaSetPoints_Donor2() {
  const { data, error, isLoading } = useSWR<UmaSetPoint[]>(
    '/api/MetaData/?id=3&&metadata={"donor":"Donor 2"}',
    fetchJson
  );

  return {
    datasetsD2: data,
    isLoading,
    isError: error
  };
}

export function useUmaSetPoints2() {
  const { data, error, isLoading } = useSWR<UmaSetPoint[]>(
    "/api/UmaPlotPoint/?id=4",
    fetchJson
  );

  return {
    datasets2: data,
    isLoading,
    isError: error
  };
}
export function useUmaSetPoints2_Donor1() {
  const { data, error, isLoading } = useSWR<UmaSetPoint[]>(
    '/api/MetaData/?id=4&&metadata={"donor":"Donor 1"}',
    fetchJson
  );

  return {
    datasets2D1: data,
    isLoading,
    isError: error
  };
}

export function useUmaSetPoints2_Donor2() {
  const { data, error, isLoading } = useSWR<UmaSetPoint[]>(
    '/api/MetaData/?id=4&&metadata={"donor":"Donor 2"}',
    fetchJson
  );

  return {
    datasets2D2: data,
    isLoading,
    isError: error
  };
}
/*
export function usecolors_set1_april() {
  const { data, error, isLoading } = useSWR<UmaSetPointwithColors[]>(
    '/api/Signals/with_signals/?id=3&target=APRIL&metadata=',
    fetchJson
  );

  return {
    cdataset1_april: data,
    isLoading,
    isError: error
  };
}
export function usecolors_set2_april() {
  const { data, error, isLoading } = useSWR<UmaSetPointwithColors[]>(
    '/api/Signals/with_signals/?id=4&target=APRIL&metadata=',
    fetchJson
  );

  return {
    cdataset2_april: data,
    isLoading,
    isError: error
  };
}
*/

export function useSignals2(id: number, target: string, metadata: object = {}) {
  const metadataString = metadata ? JSON.stringify(metadata) : "";
  const { data, error, isLoading } = useSWR(
    id && target
      ? `/api/Signals/with_signals/?id=${id}&target=${target}&metadata=${encodeURIComponent(
          metadataString
        )}`
      : null,
    fetchJson
  );

  return {
    cdataset: data,
    isLoading,
    isError: error,
  };
}
export function useUmaSetPointsWithMetadata(id: number, metadata: object) {
  const metadataString = metadata ? JSON.stringify(metadata) : "";
  const { data, error, isLoading } = useSWR(
    id && metadataString
      ? `/api/MetaData/?id=${id}&metadata=${encodeURIComponent(metadataString)}`
      : null,
    fetchJson
  );

  return {
    datasets: data,
    isLoading,
    isError: error,
  };
}


export function useUmaSetPoints(id: number) {
  const { data, error, isLoading } = useSWR<UmaSetPoint[]>(
    id ? `/api/UmaPlotPoint/?id=${id}` : null,
    fetchJson
  );

  return {
    datasets: data || [], // Provide a default value to avoid undefined
    isLoading,
    isError: error,
  };
}
export function useSignals(id: number, target: string, metadata: object = {}) {
  const metadataString = metadata ? JSON.stringify(metadata) : "";
  const { data, error, isLoading } = useSWR<UmaSetPoint[]>(
    id && target
      ? `/api/Signals/with_signals/?id=${id}&target=${target}&metadata=${encodeURIComponent(
          metadataString
        )}`
      : null,
    fetchJson
  );

  return {
    cdataset: data || [], // Provide a default value
    isLoading,
    isError: error,
  };
}
