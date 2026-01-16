import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ toggleTheme, isDark }) => {
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-tertiary/20 hover:bg-tertiary/40 text-secondary transition-all"
            aria-label="Toggle theme"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

export default ThemeToggle;
