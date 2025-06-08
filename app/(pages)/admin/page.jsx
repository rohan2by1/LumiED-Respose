//app\(pages)\admin\page.jsx
'use client';
import CustomLink from '@/app/_components/CustomLink';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Welcome to Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CustomLink href="/admin/courses" className="block bg-white shadow-brand hover:shadow-selected transition p-6 rounded border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">📚 Manage Courses</h2>
          <p className="text-gray-600">Add, edit, publish, or remove courses.</p>
        </CustomLink>

        <CustomLink href="/admin/queries" className="block bg-white shadow-brand hover:shadow-selected transition p-6 rounded border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">❓ View Queries</h2>
          <p className="text-gray-600">See questions, concerns, or support requests submitted by users.</p>
        </CustomLink>
      </div>
    </div>
  );
}
