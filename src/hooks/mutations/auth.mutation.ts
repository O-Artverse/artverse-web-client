import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import type { LoginPostDto, RegisterPostDto } from '@/types/user';
import { AuthService } from '@/services/auth.service';

export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegisterPostDto) => AuthService.register(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.auth.register(),
            });
        },
    });
};
export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginPostDto) => AuthService.login(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.auth.login(),
            });
        },
    });
};
