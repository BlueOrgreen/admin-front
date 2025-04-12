import clsx from 'classnames';

import type { SVGProps } from 'react';
// import './index.less';

export type SvgIconProps = {
    iconClass: string;
    className?: string;
} & SVGProps<SVGSVGElement>;

const SvgIcon: FC<SvgIconProps> = ({ iconClass, className, ...restProps }) => {
    return (
        <svg
            aria-hidden="true"
            fontSize={100}
            className={clsx(
                `h-[1em] w-[1em] overflow-hidden fill-current align-[-0.15em] ${className}`,
            )}
            {...restProps}
        >
            <use href={`#icon-${iconClass}`} />
        </svg>
    );
};

export { SvgIcon };
