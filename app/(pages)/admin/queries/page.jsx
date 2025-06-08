//app\(pages)\admin\queries\page.jsx
'use client';

import { useEffect, useState } from 'react';
import Editor from '@/app/_components/Editor';
import { toast } from 'react-toastify';

const AdminQueriesPage = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ sort: 'new', status: 'all' });
  const [replyTo, setReplyTo] = useState(null);
  const [subject, setSubject] = useState('');
  const [viewQuery, setViewQuery] = useState(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchQueries();
  }, [filter]);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filter.sort) queryParams.append('sort', filter.sort);
      if (filter.status && filter.status !== 'all') queryParams.append('status', filter.status);

      const res = await fetch(`/api/admin/query?${queryParams.toString()}`);
      const data = await res.json();
      setQueries(data?.data || []);
    } catch (err) {
      console.error('Failed to fetch queries', err);
    }
    setLoading(false);
  };

  const handleReplyQuery = async (e) => {
    e.preventDefault();

    const body = content;

    if (!subject || !body) return toast.warn('Subject and body are required.');

    try {
      const req = await fetch('/api/admin/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query_id: replyTo.query_id, subject, body }),
      });

      const res = await req.json();

      if (res.success) {
        setSubject('');
        setReplyTo(null);
        setContent('');
        toast.success(res?.message);
        fetchQueries();
      }
      else{
        toast.error(res?.message || 'Failed to send email.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-300';
      case 'in-progress':
        return 'bg-yellow-300';
      case 'closed':
        return 'bg-green-300';
      default:
        return '';
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-bold">Admin Dashboard - Queries</h1>
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="mr-2">Sort:</label>
            <select
              value={filter.sort}
              onChange={e => setFilter({ ...filter, sort: e.target.value })}
              className="border p-1"
            >
              <option value="new">Newest</option>
              <option value="old">Oldest</option>
            </select>
          </div>

          <div>
            <label className="mr-2">Status:</label>
            <select
              value={filter.status}
              onChange={e => setFilter({ ...filter, status: e.target.value })}
              className="border p-1"
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>
      <hr className="mt-2 mb-6 w-full h-[2px] bg-gray-300" />

      {loading ? (
        <p>Loading...</p>
      ) : queries.length === 0 ? (
        <p>No queries available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border text-left">Sno</th>
                <th className="p-2 border text-left">Name</th>
                <th className="p-2 border text-left">Email</th>
                <th className="p-2 border text-left">Query</th>
                <th className="p-2 border text-left">Status</th>
                <th className="p-2 border text-left">Date</th>
                <th className="p-2 border text-left">Time</th>
                <th className="p-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((q, index) => {
                const dateObj = new Date(q.createdAt);
                const date = dateObj.toLocaleDateString();
                const time = dateObj.toLocaleTimeString();

                return (
                  <tr key={q.query_id} className="border-t group">
                    <td className="p-2 border text-center">{index + 1}</td>
                    <td className="p-2 border" title={q.name || 'N/A'}>{q.name || 'N/A'}</td>
                    <td className="p-2 border" title={q.email}>{q.email}</td>
                    <td className="p-2 border max-w-[200px] truncate" title={q.query}>{q.query}</td>
                    <td className="p-2 border">
                      <span className={`${getStatusBgColor(q.status)} p-1 flex items-center justify-center rounded`}>{q.status}</span>
                    </td>
                    <td className="p-2 border">{date}</td>
                    <td className="p-2 border">{time}</td>
                    <td className="p-2 border flex justify-around items-center">
                      <button onClick={() => setViewQuery(q.query)}>
                        <img src="/icons/view.png" alt="" className="bg-green-400 p-1 h-6 w-6 rounded hover:bg-green-500" />
                      </button>
                      <button
                        onClick={() => {
                          setReplyTo(q);
                          setSubject('');
                        }}
                      >
                        <img src="/icons/reply.png" alt="" className="bg-yellow-400 p-1 h-6 w-6 rounded hover:bg-yellow-500" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* View Query Modal */}
      {viewQuery && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-3xl max-h-[80vh] p-6 rounded shadow-lg overflow-y-auto relative">
            <h2 className="text-lg font-semibold mb-4">Full Query</h2>
            <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded border">
              {viewQuery}
            </pre>
            <button
              onClick={() => setViewQuery(null)}
              className="absolute top-3 right-4 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyTo && (
        <form onSubmit={handleReplyQuery} className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl mb-4 font-light">
              Reply to <span className='font-normal'>{replyTo.email}</span>
            </h2>

            <label className="block mb-2 font-semibold">Subject</label>
            <input
              className="w-full border px-3 py-2 mb-4"
              placeholder="Enter subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />

            <label className="block mb-2 font-semibold">Body</label>
            <div className="mb-4 border rounded overflow-hidden">
            <Editor content={content} setContent={setContent} />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type='button'
                onClick={() => setReplyTo(null)}
                className="text-gray-500 border rounded px-4 py-2 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminQueriesPage;
