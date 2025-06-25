// types globals.d.ts
import { PropsWithChildren } from 'react';

declare global {
  interface ExtraTWClassProps {
    className?: string;
  }

  type ComponentProps = PropsWithChildren<ExtraTWClassProps> & {};
}
