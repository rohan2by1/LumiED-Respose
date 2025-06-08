//app\(pages)\admin\layout.jsx
'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import CustomLink from '@/app/_components/CustomLink';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white shadow-brand transition-all duration-300 ${sidebarOpen ? 'w-40' : 'w-16'}`}>
        <div className={`p-4 flex ${sidebarOpen ? "justify-between" : "justify-center"} items-center`}>
          {sidebarOpen && <span className="font-bold text-lg">Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? "X" : "☰"}</button>
        </div>
        <nav className="mt-4">
          <CustomLink href="/admin/courses" className={`flex items-center ${sidebarOpen ? "" : "justify-center"} px-4 py-2 hover:bg-gray-200 ${pathname.includes('courses') ? 'bg-gray-300' : ''}`}>
            <img src="/icons/course.png" alt="" className='w-5 h-5' />
            {sidebarOpen && <span className='ml-2'>Courses</span>}
          </CustomLink>
          <CustomLink href="/admin/queries" className={`flex items-center ${sidebarOpen ? "" : "justify-center"} px-4 py-2 hover:bg-gray-200 ${pathname.includes('queries') ? 'bg-gray-300' : ''}`}>
            <img src="/icons/query.png" alt="" className='w-5 h-5' />
            <span></span>
            {sidebarOpen && <span className='ml-2'>Queries</span>}
          </CustomLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
