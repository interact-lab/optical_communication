import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

const ScrollToHashElement = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [hash]);

    return null;
};

const Layout = ({ toggleTheme, isDark }) => {
    return (
        <div className="flex min-h-screen font-sans text-secondary selection:bg-tertiary/30 bg-[var(--color-primary)] transition-all duration-300">
            <ScrollToHashElement />
            <Sidebar toggleTheme={toggleTheme} isDark={isDark} />
            <main className="flex-1 transition-all duration-300 relative">
                <div className="relative z-10 p-8 md:p-12 max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
