import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-container py-6 border-t border-brand-100 bg-white/80 backdrop-blur-md relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm">
                    <div className="flex items-center space-x-2 text-brand-500 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-400"></span>
                        <p>
                            &copy; {new Date().getFullYear()} ECE Department. All Rights Reserved.
                        </p>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link
                            to="/special-thanks"
                            className="text-brand-600 hover:text-brand-900 font-bold uppercase tracking-widest text-[10px] transition-all duration-300 flex items-center group"
                        >
                            Special Thanks
                            <span className="ml-2 h-[1px] w-0 bg-brand-900 group-hover:w-4 transition-all duration-300"></span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
