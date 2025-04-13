import clsx from 'classnames';

import type { SVGProps } from 'react';
import styles from './index.module.css';

export type SvgIconProps = {
    iconClass: string;
    className?: string;
} & SVGProps<SVGSVGElement>;

const SvgIcon: FC<SvgIconProps> = ({ iconClass, className, ...restProps }) => {
    return (
        <svg
            aria-hidden="true"
            fontSize={100}
            className={clsx(styles['mango-svg-icon'], `${className}`)}
            {...restProps}
        >
            <use href={`#icon-${iconClass}`} />
        </svg>
    );
};

export { SvgIcon };
