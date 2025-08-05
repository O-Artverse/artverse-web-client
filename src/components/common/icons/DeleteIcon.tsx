import { FC } from "react";
import Svg, { SvgProp } from '@/components/common/svgs';

export const DeleteIcon: FC<SvgProp> = ({ ...props }) => (
    <Svg height="14" viewBox="0 0 20 20" width="14" {...props}>
     <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );