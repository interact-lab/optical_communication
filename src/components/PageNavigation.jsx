import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PageNavigation = ({ prevTo, prevLabel, nextTo, nextLabel }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-20 pt-10 border-t border-secondary/10">
            {prevTo ? (
                <Link
                    to={prevTo}
                    className="group flex items-center gap-4 p-4 rounded-3xl hover:bg-secondary/5 transition-all text-secondary/40 hover:text-secondary border border-transparent hover:border-secondary/10"
                >
                    <div className="w-12 h-12 rounded-full border border-secondary/10 flex items-center justify-center group-hover:bg-secondary/10 transition-all">
                        <ChevronLeft size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Previous</span>
                        <span className="text-lg font-serif font-bold">{prevLabel}</span>
                    </div>
                </Link>
            ) : <div />}

            {nextTo ? (
                <Link
                    to={nextTo}
                    className="group flex items-center gap-4 p-4 rounded-3xl hover:bg-secondary/5 transition-all text-secondary/40 hover:text-secondary border border-transparent hover:border-secondary/10 text-right ml-auto"
                >
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Next</span>
                        <span className="text-lg font-serif font-bold">{nextLabel}</span>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-secondary/10 flex items-center justify-center group-hover:bg-secondary/10 transition-all">
                        <ChevronRight size={20} />
                    </div>
                </Link>
            ) : <div />}
        </div>
    );
};

export default PageNavigation;
