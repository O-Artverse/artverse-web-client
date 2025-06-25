import { useCallback, useEffect, useRef } from 'react';

import { SocketCallback, SubscriptionFunction, UnsubscribeFunction } from '@/types/socket';
import { Maybe } from '@/utils/util';

export interface UseSocketSubscriptionOptions<T> {
  subscription: SubscriptionFunction<T>;
  callback: SocketCallback<T>;
  enabled?: boolean;
  dependencies?: any[];
}

export function useSocketSubscription<T>({
  subscription,
  callback,
  enabled = true,
  dependencies = [],
}: UseSocketSubscriptionOptions<T>) {
  const memoizedCallback = useCallback(callback, [callback]);
  const unsubscribeRef = useRef<Maybe<UnsubscribeFunction>>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    unsubscribeRef.current = subscription(memoizedCallback);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [subscription, memoizedCallback, enabled, ...dependencies]);
}
