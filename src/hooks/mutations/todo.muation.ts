import { QUERY_KEYS } from "@/constants/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todo: string) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(todo);
        }, 1000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.todo.addTodo() });
    },
  });
};
