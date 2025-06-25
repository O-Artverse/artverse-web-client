import { UseQueryOptions } from "@tanstack/react-query";

export type QueryParams<T> = Omit<
  UseQueryOptions<T, Error>,
  "queryFn" | "queryKey"
>;