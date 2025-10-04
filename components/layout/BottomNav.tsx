

import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../../types';

interface BottomNavProps {
    userRole: UserRole | null;
}

const BottomNav: React.FC<BottomNavProps> = ({ userRole }) => {
    const navItems = [
        { path: '/', icon: 'fas fa-home', label: 'Home' },
        { path: '/search', icon: 'fas fa-search', label: 'Search' },
        { path: '/create', icon: 'fas fa-plus-square', label: 'Create', talentOnly: true },
        { path: '/reels', activeIcon: 'fas fa-play-circle', inactiveIcon: 'far fa-play-circle', label: 'Reels' },
        { path: '/profile', activeIcon: 'fas fa-user-circle', inactiveIcon: 'far fa-user-circle', label: 'Profile' },
    ];

    const activeLinkClass = "text-[var(--accent-color)]";
    const inactiveLinkClass = "text-gray-400 dark:text-gray-500";

    return (
        <nav className="flex justify-around items-center h-16 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 shrink-0">
            {navItems.map(item => {
                if (item.talentOnly && userRole !== UserRole.Talent) {
                    return null;
                }
                
                if (item.path === '/create') {
                    return (
                        <NavLink key={item.path} to={item.path} className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} transform transition-transform duration-200 hover:scale-110`}>
                           <div className="text-4xl -mt-1">+</div>
                        </NavLink>
                    );
                }

                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} flex flex-col items-center w-16 transform transition-transform duration-200 hover:scale-110`}
                    >
                        {({ isActive }) => {
                            let iconClass = item.icon; // Default for icons that don't change
                            if (item.activeIcon && item.inactiveIcon) {
                                iconClass = isActive ? item.activeIcon : item.inactiveIcon;
                            }
                            return <i className={`${iconClass} text-2xl`}></i>;
                        }}
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default BottomNav;