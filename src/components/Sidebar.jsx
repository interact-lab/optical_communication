import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Menu,
    X,
    Zap,
    Layers,
    Waves,
    Activity,
    Sliders,
    Home as HomeIcon,
    HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const SidebarItem = ({ to, label, children, collapsed, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = React.Children.count(children) > 0;

    return (
        <div className="mb-1 w-full relative group">
            <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
                {!collapsed && hasChildren ? (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="mr-2 p-1 text-[var(--color-secondary)]/60 hover:text-[var(--color-secondary)] transition-colors"
                    >
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                ) : !collapsed && (
                    <span className="w-6 display-inline-block"></span>
                )}

                <NavLink
                    to={to}
                    className={({ isActive }) =>
                        `flex items-center py-1 px-2 rounded text-sm transition-all whitespace-nowrap overflow-hidden ${collapsed ? 'w-auto' : 'w-full'} ${isActive
                            ? 'bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] font-semibold border-l-2 border-[var(--color-tertiary)]'
                            : 'text-[var(--color-secondary)]/70 hover:text-[var(--color-secondary)] hover:bg-[var(--color-tertiary)]/5'
                        }`
                    }
                >
                    {Icon && <Icon size={18} className={collapsed ? '' : 'mr-3'} />}
                    {collapsed ? null : label}
                </NavLink>
            </div>

            {/* Tooltip for collapsed state */}
            {collapsed && (
                <div className="absolute left-full top-0 ml-2 bg-[var(--color-tertiary)] text-[var(--color-primary)] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap shadow-lg">
                    {label}
                </div>
            )}

            <AnimatePresence>
                {isOpen && hasChildren && !collapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-6 overflow-hidden border-l border-[var(--color-secondary)]/10"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Sidebar = ({ toggleTheme, isDark }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[var(--color-primary)] border border-[var(--color-secondary)]/10 rounded-lg text-[var(--color-secondary)]"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar Container - FIXED/STICKY */}
            <aside className={`
                fixed top-0 left-0 h-screen bg-[var(--color-primary)] border-r border-[var(--color-secondary)]/10 z-40
                transform transition-all duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:sticky
                ${isCollapsed ? 'w-16' : 'w-64'}
            `}>
                <div className="p-4 h-full flex flex-col">
                    {/* Header & Toggle */}
                    <div className="flex items-center justify-between mb-8 border-b border-[var(--color-secondary)]/10 pb-4 h-12">
                        {!isCollapsed && (
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xl font-bold font-serif text-[var(--color-secondary)] tracking-tight"
                            >
                                Optical Suite
                            </motion.h1>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-1 hover:bg-[var(--color-secondary)]/10 rounded-lg text-[var(--color-secondary)]/60 hover:text-[var(--color-secondary)] transition-colors"
                        >
                            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                    </div>

                    <nav className="space-y-4 flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                        <SidebarItem to="/" label="Introduction" collapsed={isCollapsed} icon={HomeIcon} />

                        <div className="mb-4">
                            {!isCollapsed && <h3 className="text-xs uppercase tracking-wider text-[var(--color-secondary)]/40 font-bold mb-2 ml-2">Modules</h3>}

                            {/* LASERS SECTION */}
                            <div className="mb-2">
                                {!isCollapsed && (
                                    <div className="flex items-center text-[var(--color-tertiary)] font-bold px-2 py-1 text-xs uppercase tracking-widest opacity-80">
                                        Lasers
                                    </div>
                                )}

                                <div className={`${isCollapsed ? 'flex flex-col items-center space-y-2 mt-2' : 'ml-2 mt-1 space-y-1'}`}>
                                    <SidebarItem to="/lasers/intro" label="Intro to Lasers" collapsed={isCollapsed} icon={Zap}>
                                        <div className="space-y-1 mt-1">
                                            <SidebarItem to="/lasers/intro#what-are-lasers" label="Definition" collapsed={isCollapsed} />
                                            <SidebarItem to="/lasers/intro#optical-sources" label="Optical Sources" collapsed={isCollapsed} />
                                            <SidebarItem to="/lasers/intro#components" label="Light Components" collapsed={isCollapsed} />
                                            <SidebarItem to="/lasers/intro#energy-levels" label="Energy Levels" collapsed={isCollapsed} />
                                        </div>
                                    </SidebarItem>

                                    <SidebarItem to="/lasers/resonators" label="Optical Resonators" collapsed={isCollapsed} icon={Layers}>
                                        <div className="space-y-1 mt-1">
                                            <SidebarItem to="/lasers/resonators/why-standing-waves" label="Why Standing Waves?" collapsed={isCollapsed} />
                                            <SidebarItem to="/lasers/resonators/boundary-conditions" label="Boundary Conditions" collapsed={isCollapsed} />
                                            <SidebarItem to="/lasers/resonators/modes" label="Cavity Modes" collapsed={isCollapsed} />
                                        </div>
                                    </SidebarItem>
                                    <SidebarItem to="/lasers/gain-loss" label="Gain & Line Broadening" collapsed={isCollapsed} icon={Waves} />
                                    <SidebarItem to="/lasers/modulation" label="Laser Modulation" collapsed={isCollapsed} icon={Activity} />
                                    <SidebarItem to="/lasers/tunable" label="Tunable Lasers" collapsed={isCollapsed} icon={Sliders} />
                                </div>
                            </div>

                            {/* Placeholders */}
                            <div className={`${isCollapsed ? 'flex flex-col items-center space-y-2' : ''}`}>
                                <SidebarItem to="/fiber-optics" label="Fiber Optics" collapsed={isCollapsed} icon={Waves} />
                                <SidebarItem to="/optical-comm" label="Optical Comm" collapsed={isCollapsed} icon={Zap} />
                                <SidebarItem to="/nonlinear" label="Non-linear Optics" collapsed={isCollapsed} icon={Activity} />
                                <SidebarItem to="/networks" label="Optical Networks" collapsed={isCollapsed} icon={Layers} />
                            </div>
                        </div>

                        <SidebarItem to="/faq" label="FAQ" collapsed={isCollapsed} icon={HelpCircle} />
                    </nav>

                    {/* Theme Toggle at Bottom */}
                    <div className="mt-auto pt-4 border-t border-[var(--color-secondary)]/10 flex justify-center">
                        <ThemeToggle toggleTheme={toggleTheme} isDark={isDark} />
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
