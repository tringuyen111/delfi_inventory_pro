import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const BoxIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.0006 18.26L4.94715 14.7346L4.94653 9.26461L12.0006 5.73931L19.0546 9.26461L19.054 14.7346L12.0006 18.26ZM12.0006 20L3.52215 15.7654V8.23461L12.0006 4L20.4791 8.23461V15.7654L12.0006 20ZM10.8654 11.8346L13.1327 13.0654L17.5146 10.7354L15.2473 9.50461L10.8654 11.8346ZM11.1327 15.2646L6.48653 12.7346L8.75385 11.5039L13.3994 14.0339L11.1327 15.2646Z" />
    </svg>
);

interface MenuItem {
  name: string;
  path: string;
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

const Sidebar: React.FC = () => {
    const [menu, setMenu] = useState<MenuGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await fetch(new URL('../menu.json', import.meta.url));
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: MenuGroup[] = await response.json();
                setMenu(data);
            } catch (error) {
                console.error("Failed to fetch menu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const activeClassName = "bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 border-l-4 border-primary-500 font-semibold";
    const inactiveClassName = "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100";
    
    return (
        <aside className="h-full bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-xl rounded-lg p-4 flex flex-col">
            <div className="flex items-center justify-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                 <BoxIcon className="w-8 h-8 text-primary-500" />
                 <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                    Delfi Pro
                 </h1>
            </div>
            <nav className="flex-1 space-y-4">
                {loading ? (
                    <p className="px-3 text-sm text-gray-500 dark:text-gray-400">Loading menu...</p>
                ) : (
                    menu.map((group, index) => (
                        <div key={index}>
                            <h3 className="px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                                {group.group}
                            </h3>
                            <div className="mt-2 space-y-1">
                                {group.items.map((item, itemIndex) => (
                                    <NavLink
                                        key={itemIndex}
                                        to={item.path}
                                        end={item.path === '/'}
                                        className={({ isActive }) =>
                                            `flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
                                                isActive ? activeClassName : inactiveClassName
                                            }`
                                        }
                                    >
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;