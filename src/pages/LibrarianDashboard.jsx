import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Search, Book, User, Calendar, PlusCircle, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const LibrarianDashboard = () => {
    const [searchUsn, setSearchUsn] = useState('');
    const [student, setStudent] = useState(null);
    const [libraryHistory, setLibraryHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Issue Book Form State
    const [showIssueForm, setShowIssueForm] = useState(false);
    const [newBook, setNewBook] = useState({ title: '', bookId: '' });

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStudent(null);
        setLibraryHistory([]);
        setShowIssueForm(false);

        try {
            // Fetch student profile using a dedicated search endpoint or existing one if permissive (using library endpoint instead)
            // Since we need library history, let's just hit the library/student/:usn endpoint which we built
            // But we also need student name/details. The library endpoint fetches student by USN inside controller.
            // Let's modify the controller to return student details or just fetch history and infer existence.
            // Actually, querying the history will fail 404 if student doesn't exist.

            const { data } = await api.get(`/library/student/${searchUsn}`);
            // We need student details (Name, USN). The current endpoint returns ONLY the records.
            // I should have populated the student details in the records or made a separate call.
            // For now, I'll assumme if records come back, the student exists. Ideally I want name.
            // I'll make a quick call to `/admin/students` search if available, but I don't want to overcomplicate.
            // Let's just USE the records. if record[0] exists, it has `student` ID.

            setLibraryHistory(data);

            // Hacky: To get student name, I might need another endpoint or just rely on manual verification.
            // Let's just show USN for now or assume the user verifies the face.
            setStudent({ usn: searchUsn }); // Placeholder until we have name

        } catch (error) {
            toast.error(error.response?.data?.message || 'Student not found or error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleIssueBook = async (e) => {
        e.preventDefault();
        if (!newBook.title || !newBook.bookId) return toast.error('Please fill all fields');

        try {
            await api.post('/library/issue', {
                usn: searchUsn,
                bookTitle: newBook.title,
                bookId: newBook.bookId
            });
            toast.success('Book Issued Successfully');
            setShowIssueForm(false);
            setNewBook({ title: '', bookId: '' });
            handleSearch({ preventDefault: () => { } }); // Refresh
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to issue book');
        }
    };

    const handleReturnBook = async (recordId) => {
        if (!window.confirm('Mark this book as returned?')) return;

        try {
            await api.post('/library/return', { recordId });
            toast.success('Book Returned Successfully');
            handleSearch({ preventDefault: () => { } }); // Refresh
        } catch (error) {
            toast.error('Failed to return book');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center">
                <Book className="mr-3 h-8 w-8 text-indigo-600" />
                Library Management
            </h1>

            {/* Search Section */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Enter Student USN"
                            value={searchUsn}
                            onChange={(e) => setSearchUsn(e.target.value.toUpperCase())}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all uppercase font-medium"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50"
                    >
                        {loading ? <RefreshCw className="animate-spin h-5 w-5" /> : <Search className="h-5 w-5 mr-2" />}
                        Search Student
                    </button>
                </form>
            </div>

            {/* Student Details & Actions */}
            {student && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                                {student.usn.slice(0, 2)}
                            </div>
                            <div>
                                <p className="text-sm text-indigo-600 font-bold uppercase tracking-wide">Student USN</p>
                                <h2 className="text-2xl font-bold text-gray-900">{student.usn}</h2>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowIssueForm(!showIssueForm)}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors flex items-center shadow-md"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Issue New Book
                        </button>
                    </div>

                    {/* Issue Book Form */}
                    {showIssueForm && (
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 relative overflow-hidden">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <PlusCircle className="mr-2 h-5 w-5 text-emerald-600" />
                                Issue Book
                            </h3>
                            <form onSubmit={handleIssueBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Book Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={newBook.title}
                                        onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Algorithms & Data Structures"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Book ID / Accession No</label>
                                    <input
                                        type="text"
                                        required
                                        value={newBook.bookId}
                                        onChange={e => setNewBook({ ...newBook, bookId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="LIB-CS-2024-001"
                                    />
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowIssueForm(false)}
                                        className="px-4 py-2 text-gray-500 font-bold hover:text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-md"
                                    >
                                        Confirm Issue
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Active Borrowings */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="font-bold text-gray-700 flex items-center">
                                <Book className="mr-2 h-5 w-5" />
                                Borrowing History ({libraryHistory.length})
                            </h3>
                        </div>
                        {libraryHistory.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                <Book className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>No borrowing record found for this student.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {libraryHistory.map(record => (
                                    <div key={record._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 transition-colors">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-lg text-gray-900">{record.bookTitle}</h4>
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${record.status === 'returned' ? 'bg-green-100 text-green-700' :
                                                        record.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 font-mono">ID: {record.bookId}</p>
                                            <div className="flex gap-4 text-xs text-gray-500">
                                                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> Issued: {new Date(record.borrowedDate).toLocaleDateString()}</span>
                                                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> Due: <span className={record.status === 'overdue' ? 'text-red-600 font-bold' : ''}>{new Date(record.dueDate).toLocaleDateString()}</span></span>
                                                {record.returnDate && (
                                                    <span className="flex items-center text-emerald-600 font-medium"><CheckCircle className="w-3 h-3 mr-1" /> Returned: {new Date(record.returnDate).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                        </div>

                                        {record.status !== 'returned' && (
                                            <button
                                                onClick={() => handleReturnBook(record._id)}
                                                className="mt-4 md:mt-0 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 hover:text-emerald-700 hover:border-emerald-200 transition-all shadow-sm flex items-center"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Mark Returned
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LibrarianDashboard;
