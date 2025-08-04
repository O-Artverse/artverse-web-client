import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { AuthService } from '@/services/auth.service';
import { LoginPostDto } from '@/models/auth/LoginSchema';
import { SignUpPostDto } from '@/models/auth/SignUpSchema';

export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SignUpPostDto) => AuthService.register(data),
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
