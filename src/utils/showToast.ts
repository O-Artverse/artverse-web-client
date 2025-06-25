import { addToast, cn } from '@heroui/react';
import { tv } from 'tailwind-variants';

type AddToastParams = Parameters<typeof addToast>[0];

type CustomToastOptions = Omit<AddToastParams, 'color'> & {
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'error';
  className?: string;
  showCloseButton?: boolean;
};

export function showToast({
  title,
  description,
  color = 'default',
  icon,
  endContent,
  className,
  ...props
}: CustomToastOptions) {
  const toastStyles = tv({
    slots: {
      base: '',
      icon: 'mr-5',
    },
    variants: {
      color: {
        default: {
          base: '',
        },
        primary: { base: '' },
        secondary: { base: '' },
        success: {
          base: 'to-success-400/1 border-none bg-black-900 bg-gradient-to-r from-success-400/10',
          icon: 'text-success-300',
        },
        error: {
          base: 'to-danger-400/1 border-none bg-black-900 bg-gradient-to-r from-danger-400/10',
          icon: 'text-danger-300',
        },
        warning: { base: '' },
        danger: { base: '' },
      },
    },
    defaultVariants: {
      color: 'default',
    },
  });

  return addToast({
    ...props,
    title,
    description,
    classNames: {
      base: cn(toastStyles({ color: color }).base(), className, props.classNames?.base),
      content: props.classNames?.content || '',
      icon: toastStyles({ color: color }).icon(),
      title: 'text-white',
      closeButton: 'opacity-100 absolute right-4 top-1/2 -translate-y-1/2 ',
      closeIcon: 'bg-transparent border-none color-neutral-70',
    },
    hideIcon: !icon,
    icon,
    endContent,
  });
}
