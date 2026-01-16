import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

const MathText = ({ children, block = false, className = '' }) => {
    // If block is true, wrap in $$...$$, else $...$
    // But react-latex-next handles delimiters.
    // We can just pass the string with delimiters or use the component prop.

    // Custom styled wrapper for 3b1b look (serif font for math)
    return (
        <span className={`font-serif text-lg tracking-wide ${className} ${block ? 'block my-4 text-center' : ''}`}>
            <Latex>{children}</Latex>
        </span>
    );
};

export default MathText;
