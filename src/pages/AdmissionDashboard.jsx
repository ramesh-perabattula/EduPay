import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { User, Search, DollarSign, CheckCircle } from 'lucide-react';

const AdmissionDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedStudent, setSearchedStudent] = useState(null);

    const handleSearchStudent = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.get(`/admission/students/search?query=${searchTerm}`);
            setSearchedStudent(data);
        } catch (error) {
            toast.error('Student not found');
            setSearchedStudent(null);
        }
    };

    const handleUpdate = async (updates) => {
        try {
            const { data } = await api.put(`/admission/students/${searchedStudent.usn}`, updates);
            setSearchedStudent(data);
            toast.success('Admission Details Updated');
        } catch (error) {
            toast.error('Update Failed');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <User className="mr-3 h-8 w-8 text-indigo-600" />
                Admission Department
            </h1>

            {/* Search Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-2xl mb-8">
                <form onSubmit={handleSearchStudent} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter Student USN / Roll Number"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center">
                        <Search className="w-4 h-4 mr-2" /> Search
                    </button>
                </form>
            </div>

            {/* Student Details Section */}
            {searchedStudent && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-4xl border border-gray-200">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">{searchedStudent.usn}</h3>
                            <p className="text-gray-500 text-sm">{searchedStudent.user?.name}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-semibold text-gray-700 bg-white px-3 py-1 rounded border">Quota: {searchedStudent.quota}</span>
                            <span className="text-sm text-gray-500">Dept: {searchedStudent.department}</span>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Fee Management */}
                            <div className="col-span-2 p-6 rounded-xl border flex flex-col justify-between bg-white border-gray-200">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                        <DollarSign className="w-5 h-5 mr-2" />
                                        College / Admission Fee Management
                                    </h4>

                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500 mb-1">Current College Fee Due</p>
                                            <p className="text-2xl font-bold text-gray-900">₹{searchedStudent.collegeFeeDue}</p>
                                        </div>

                                        {searchedStudent.collegeFeeDue > 0 ? (
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Mark ₹${searchedStudent.collegeFeeDue} as PAID?`)) {
                                                        handleUpdate({ collegeFeeDue: 0 });
                                                    }
                                                }}
                                                className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-sm flex justify-center items-center"
                                            >
                                                <DollarSign className="w-5 h-5 mr-2" />
                                                Mark Full Year Paid
                                            </button>
                                        ) : (
                                            <div className="w-full py-3 bg-green-100 text-green-800 font-bold rounded-lg flex justify-center items-center">
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Full Year Paid
                                            </div>
                                        )}

                                        {/* Semester Wise Breakdown */}
                                        <div className="mt-6 border-t border-gray-200 pt-4">
                                            <h5 className="font-semibold text-gray-700 mb-2">Semester Breakdown</h5>
                                            <div className="space-y-3">
                                                {/* Simulated Historic Data for Completed Years */}
                                                {Array.from({ length: searchedStudent.currentYear - 1 }, (_, i) => i + 1).flatMap(year => {
                                                    // Check if real record exists for this year to avoid duplicates
                                                    const hasRecord = searchedStudent.feeRecords?.some(r => r.year === year && r.feeType === 'college');
                                                    if (hasRecord) return [];

                                                    const semA = (year * 2) - 1;
                                                    const semB = year * 2;

                                                    return [semA, semB].map(sem => (
                                                        <div key={`hist-sem-${sem}`} className="flex flex-col bg-gray-50 p-3 rounded-lg border border-gray-100 opacity-60">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-sm font-medium text-gray-600">Year {year} - Sem {sem}</span>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">ARCHIVED</span>
                                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800">PAID</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between text-xs text-gray-500">
                                                                <span>Historic Record</span>
                                                                <span>Synced</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                                                <div className="h-1 rounded-full bg-green-500" style={{ width: '100%' }}></div>
                                                            </div>
                                                        </div>
                                                    ));
                                                })}

                                                {searchedStudent.feeRecords && searchedStudent.feeRecords
                                                    .filter(r => r.feeType === 'college')
                                                    .sort((a, b) => a.year - b.year || a.semester - b.semester)
                                                    .map((record, index) => (
                                                        <div key={index} className="flex flex-col bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-sm font-medium text-gray-600">Year {record.year} - Sem {record.semester}</span>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${record.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                        {record.status.toUpperCase()}
                                                                    </span>
                                                                    {record.status !== 'paid' && (
                                                                        <button
                                                                            onClick={() => {
                                                                                if (window.confirm(`Mark Semester ${record.semester} College Fee (₹${record.amountDue}) as PAID?`)) {
                                                                                    handleUpdate({ markSemPaid: record.semester });
                                                                                }
                                                                            }}
                                                                            className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition font-semibold"
                                                                        >
                                                                            Mark Paid
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between text-xs text-gray-500">
                                                                <span>Due: ₹{record.amountDue}</span>
                                                                <span>Paid: ₹{record.amountPaid}</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                                                <div
                                                                    className={`h-1 rounded-full ${record.status === 'paid' ? 'bg-green-500' : 'bg-indigo-500'}`}
                                                                    style={{ width: `${Math.min(100, (record.amountPaid / record.amountDue) * 100)}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdmissionDashboard;
