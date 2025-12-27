import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const Avatar = ({ initials, label, color, image, size = "medium", name, subtext, fit = "cover" }) => {
    const sizeClasses = {
        medium: "h-24 w-24 md:h-32 md:w-32",
        large: "h-48 w-48 md:h-72 md:w-72"
    };

    return (
        <div className="flex flex-col items-center group animate-in fade-in zoom-in duration-700">
            <div className={`${sizeClasses[size]} rounded-full bg-brand-50 flex items-center justify-center border-2 border-brand-100 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_20px_60px_rgba(8,112,184,0.3)] group-hover:border-brand-600 ring-8 ring-transparent group-hover:ring-brand-50/50 overflow-hidden relative`}>
                {image ? (
                    <img
                        src={image}
                        alt={name || label}
                        className={`h-full w-full ${fit === 'contain' ? 'object-contain p-2' : 'object-cover'} transform transition-transform duration-700 group-hover:scale-110`}
                    />
                ) : (
                    <div className={`h-full w-full rounded-full ${color} flex items-center justify-center text-white shadow-inner`}>
                        <span className={`${size === 'large' ? 'text-5xl md:text-7xl' : 'text-3xl md:text-4xl'} font-black tracking-tighter leading-none`}>
                            {initials}
                        </span>
                    </div>
                )}
            </div>
            {(name || subtext) && (
                <div className="mt-8 text-center max-w-sm">
                    {name && (
                        <h3 className={`font-heading font-black text-brand-950 tracking-tight uppercase ${size === 'large' ? 'text-2xl md:text-4xl mb-2' : 'text-lg md:text-2xl mb-1'} drop-shadow-sm`}>
                            {name}
                        </h3>
                    )}
                    {subtext && (
                        <p className={`font-bold text-brand-600 uppercase tracking-[0.2em] ${size === 'large' ? 'text-sm md:text-base' : 'text-xs md:text-sm'}`}>
                            {subtext}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

const SectionHeader = ({ title }) => (sectionHeaderContent => (
    <div className="flex flex-col items-center mb-16 px-4">
        <h2 className="text-sm font-black text-brand-500 uppercase tracking-[0.6em] mb-4 text-center">{title}</h2>
        <div className="h-0.5 w-12 bg-brand-200 rounded-full"></div>
    </div>
))(title);

const SpecialThanks = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto selection:bg-brand-900 selection:text-white">
            {/* Glossy Background Accents */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-100/40 blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-100/30 blur-[120px] animate-pulse"></div>
            </div>

            <div className="relative z-10 min-h-screen py-16 px-6 sm:px-12">
                {/* Close Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="fixed top-8 right-8 p-4 rounded-full bg-brand-900 text-white shadow-2xl hover:bg-black hover:scale-110 active:scale-95 transition-all duration-300 z-50 group border-4 border-white"
                    title="Close"
                >
                    <X className="h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                </button>

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-32 animate-in slide-in-from-top duration-1000">
                        <h1 className="text-7xl md:text-[10rem] font-heading font-black text-brand-950 mb-8 tracking-tighter leading-[0.85] opacity-90">
                            Credits
                        </h1>
                        <div className="h-3 w-48 bg-brand-900 mx-auto rounded-full shadow-lg"></div>
                    </div>

                    <div className="flex flex-col space-y-48 text-center pb-40">
                        {/* Section 1 - Mentor */}
                        <section className="animate-in fade-in duration-1000">
                            <div className="flex flex-col items-center mb-16">
                                <h2 className="text-lg font-black text-brand-900 uppercase tracking-[0.8em] mb-4">Mentor</h2>
                                <div className="h-1 w-20 bg-brand-500 rounded-full"></div>
                            </div>
                            <div className="flex flex-col items-center">
                                <Avatar
                                    initials="SK"
                                    name="Dr. T. Saran Kumar"
                                    subtext="HOD ECE"
                                    size="large"
                                    image="/saran_sir.png"
                                    fit="cover"
                                />
                            </div>
                        </section>

                        {/* Section 2 - Guides */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-48">
                            <section>
                                <div className="flex flex-col items-center mb-16">
                                    <h2 className="text-base font-black text-brand-900 uppercase tracking-[0.6em] mb-4">Project Guide</h2>
                                    <div className="h-0.5 w-12 bg-brand-400 rounded-full"></div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Avatar
                                        initials="KR"
                                        name="Dr. K. Rajasekhar"
                                        color="bg-gradient-to-br from-blue-600 to-cyan-700"
                                        image="/project_guide.png"
                                        fit="cover"
                                    />
                                </div>
                            </section>
                            <section>
                                <div className="flex flex-col items-center mb-16">
                                    <h2 className="text-base font-black text-brand-900 uppercase tracking-[0.6em] mb-4">Coordinator</h2>
                                    <div className="h-0.5 w-12 bg-brand-400 rounded-full"></div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Avatar
                                        initials="PC"
                                        name="Project Coordinator"
                                        color="bg-gradient-to-br from-emerald-600 to-teal-700"
                                        image="/coordinator.jpg"
                                        fit="cover"
                                    />
                                </div>
                            </section>
                        </div>

                        {/* Section 4 - Developers */}
                        <section className="pt-24 border-t border-brand-100">
                            <div className="flex flex-col items-center mb-20">
                                <h2 className="text-lg font-black text-brand-900 uppercase tracking-[1em] mb-4 ml-[1em]">Developers</h2>
                                <div className="h-1 w-24 bg-brand-900 rounded-full"></div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12 md:gap-24">
                                <Avatar initials="JD" name="Dev 1" color="bg-gradient-to-br from-orange-400 to-red-600" />
                                <Avatar initials="AS" name="Dev 2" color="bg-gradient-to-br from-pink-500 to-rose-700" />
                                <Avatar initials="RK" name="Dev 3" color="bg-gradient-to-br from-amber-500 to-orange-600" />
                                <Avatar initials="MP" name="Dev 4" color="bg-gradient-to-br from-blue-700 to-indigo-800" />
                                <Avatar initials="SK" name="Dev 5" color="bg-gradient-to-br from-teal-500 to-emerald-700" />
                            </div>
                        </section>
                    </div>

                    <footer className="py-20 text-center border-t border-brand-50">
                        <p className="text-brand-400 font-black text-xs uppercase tracking-[0.5em]">
                            BVCE ECE DEPARTMENT &copy; 2025
                        </p>
                    </footer >
                </div>
            </div>
        </div>
    );
};

export default SpecialThanks;
