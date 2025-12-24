import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Search, Home, DollarSign, Ban, UserCheck } from 'lucide-react';

const HostelDashboard = () => {
    const [searchUsn, setSearchUsn] = useState('');
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fee Actions
    const [assignAmount, setAssignAmount] = useState('');
    const [payAmount, setPayAmount] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStudent(null);
        setAssignAmount('');
        setPayAmount('');

        try {
            const { data } = await api.get(`/hostel/student/${searchUsn}`);
            setStudent(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Student search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignFee = async (e) => {
        e.preventDefault();
        if (!assignAmount) return;

        try {
            await api.post('/hostel/fees/assign', {
                usn: student.usn,
                amount: assignAmount
            });
            toast.success('Hostel Fee Assigned');
            setAssignAmount('');
            handleSearch({ preventDefault: () => { } }); // Refresh
        } catch (error) {
            toast.error('Failed to assign fee');
        }
    };

    const handlePayFee = async (e) => {
        e.preventDefault();
        if (!payAmount) return;

        try {
            await api.post('/hostel/fees/pay', {
                usn: student.usn,
                amount: payAmount
            });
            toast.success('Payment Recorded Successfully');
            setPayAmount('');
            handleSearch({ preventDefault: () => { } }); // Refresh
        } catch (error) {
            toast.error('Payment Record Failed');
        }
    };

    const handleDisableHostel = async () => {
        if (!window.confirm(`Are you sure you want to disable hostel for ${student.usn}?`)) return;

        try {
            await api.post('/hostel/disable', { usn: student.usn });
            toast.success('Hostel Access Disabled');
            handleSearch({ preventDefault: () => { } });
        } catch (error) {
            toast.error('Failed to disable hostel');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center">
                <Home className="mr-3 h-8 w-8 text-indigo-600" />
                Hostel Administration
            </h1>

            {/* Search Section */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Enter Student USN to Manage"
                            value={searchUsn}
                            onChange={(e) => setSearchUsn(e.target.value.toUpperCase())}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-medium"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </div>

            {/* Student Details & Actions */}
            {student && (
                <div className="bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{student.usn}</h2>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide mt-2 ${student.hostelOpted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {student.hostelOpted ? <UserCheck className="w-3 h-3 mr-1" /> : <Ban className="w-3 h-3 mr-1" />}
                                {student.hostelOpted ? 'Hostel Active' : 'Hostel Disabled'}
                            </span>
                        </div>
                        {student.hostelOpted && (
                            <button
                                onClick={handleDisableHostel}
                                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors flex items-center"
                            >
                                <Ban className="w-4 h-4 mr-2" />
                                Disable Access
                            </button>
                        )}
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Assign Fee */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-600 uppercase tracking-widest text-xs border-b pb-2 mb-4">Assign New Fee</h3>
                            <form onSubmit={handleAssignFee} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee Amount (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={assignAmount}
                                        onChange={e => setAssignAmount(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="e.g. 75000"
                                    />
                                </div>
                                <button type="submit" className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-sm">
                                    Assign Fee
                                </button>
                            </form>
                        </div>

                        {/* Collect Payment */}
                        <div className="space-y-4 border-l pl-0 md:pl-10 border-gray-100">
                            <h3 className="font-bold text-gray-600 uppercase tracking-widest text-xs border-b pb-2 mb-4 flex justify-between">
                                Collect Payment
                                <span className="text-red-500">Due: ₹{student.hostelFeeDue?.toLocaleString() || 0}</span>
                            </h3>
                            <form onSubmit={handlePayFee} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={payAmount}
                                        onChange={e => setPayAmount(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="Enter amount"
                                    />
                                </div>
                                <button type="submit" className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-sm flex justify-center items-center">
                                    <DollarSign className="w-4 h-4 mr-1" /> Record Payment
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HostelDashboard;
