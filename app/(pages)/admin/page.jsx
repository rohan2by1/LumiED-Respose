//app\(pages)\admin\page.jsx
'use client';
import CustomLink from '@/app/_components/CustomLink';

export default function AdminDashboard() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-gray-900">
        Welcome to Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <CustomLink 
          href="/admin/courses" 
          className="block bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 rounded-lg border border-gray-200"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">
            📚 Manage Courses
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Add, edit, publish, or remove courses.
          </p>
        </CustomLink>

        <CustomLink 
          href="/admin/queries" 
          className="block bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 rounded-lg border border-gray-200"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">
            ❓ View Queries
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            See questions, concerns, or support requests submitted by users.
          </p>
        </CustomLink>
      </div>
    </div>
  );
}