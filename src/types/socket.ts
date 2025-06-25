import { Optional } from "@/utils/util";

export type QueuedEvent = {
  event: string;
  data: any;
};

export type QueuedListener = {
  event: string;
  callback: (...args: any[]) => void;
};

export type QueuedOff = {
  event: string;
  callback?: (...args: any[]) => void;
};

export type SocketCallback<TData> = (data: TData) => void;

export type SubscriptionFunction<T> = (callback: SocketCallback<T>) => Optional<UnsubscribeFunction>;
export type UnsubscribeFunction = () => void;

export type ListenEventParams<TData> = {
  callback: SocketCallback<TData>;
  enabled?: boolean;
  dependencies?: any[];
};
