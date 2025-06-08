'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import CustomLink from '@/app/_components/CustomLink';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Close sidebar on mobile when resizing
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { href: '/admin/courses', label: 'Courses', icon: '/icons/course.png', key: 'courses' },
    { href: '/admin/queries', label: 'Queries', icon: '/icons/query.png', key: 'queries' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Mobile Menu Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        ${!isMobile && sidebarOpen ? 'w-64' : !isMobile ? 'w-20' : 'w-64'}
        bg-white shadow-lg transition-all duration-300 z-50
        h-full md:h-auto
      `}>
        <div className={`p-4 flex ${sidebarOpen || isMobile ? "justify-between" : "justify-center"} items-center border-b`}>
          {(sidebarOpen || isMobile) && (
            <span className="font-bold text-lg text-gray-800">Admin Panel</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? (
              <XMarkIcon className="w-5 h-5 text-gray-600" />
            ) : (
              <Bars3Icon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <nav className="mt-4 px-2">
          {menuItems.map((item) => (
            <CustomLink
              key={item.key}
              href={item.href}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={`
                flex items-center px-3 py-3 mb-1 rounded-lg transition-all
                ${sidebarOpen || isMobile ? "" : "justify-center"}
                ${pathname.includes(item.key) 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100 text-gray-700'
                }
              `}
            >
              <img src={item.icon} alt={item.label} className="w-5 h-5" />
              {(sidebarOpen || isMobile) && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </CustomLink>
          ))}
        </nav>

        {/* User Info Section - Optional */}
        {(sidebarOpen || isMobile) && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@lumied.com</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white shadow-sm p-4 flex items-center justify-between md:hidden">
            <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        )}

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}