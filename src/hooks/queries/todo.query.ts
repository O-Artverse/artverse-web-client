import { QUERY_KEYS } from "@/constants/query-keys";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactNode } from "react";

export const useGetTodos = () => {
  return useQuery({
    queryKey: QUERY_KEYS.todo.getTodos(),
    queryFn: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(["todo 1", "todo 2", "todo 3"]);
        }, 1000);
      });
    },
  });
};
