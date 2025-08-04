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
      base: 'bg-white/70 backdrop-blur-md border border-white/30 shadow-md',
      icon: 'mr-5',
    },
    variants: {
      color: {
        default: {
          base: 'bg-white/70 backdrop-blur-md border border-white/30 shadow-md',
        },
        primary: { base: '' },
        secondary: { base: '' },
        success: {
          base: 'to-success-400/1 border-none bg-black-900 bg-gradient-to-r from-success-400/10',
          icon: 'text-success-300',
        },
        error: {
          base: 'bg-red-500 text-white',
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
    },
    hideIcon: !icon,
    icon,
    endContent,
  });
}
