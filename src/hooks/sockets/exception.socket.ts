import { ListenEventParams } from '@/types/socket';
import { useSocketSubscription } from '@/hooks/sockets/common/use-socket-subscription';
import { onException } from '@/services/gateways/common-gateway.service';

export const useGetExceptionSocket = ({ callback, ...params }: ListenEventParams<any>) => {
  useSocketSubscription({
    ...params,
    subscription: onException,
    callback,
  });
};
