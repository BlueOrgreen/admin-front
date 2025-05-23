import { NavLink } from 'react-router-dom';

import { useThemeToken } from '@/theme/hooks';
import logo from '@/assets/logo.png';

function Logo({ className = '' }: { className?: string }) {
    const { colorPrimary } = useThemeToken();

    return (
        <NavLink to="/" className="no-underline">
            <button className={`font-semibold ${className}`} style={{ color: colorPrimary }}>
                <img className="w-[60px]" src={logo} alt="logo" />
            </button>
        </NavLink>
    );
}

export default Logo;
