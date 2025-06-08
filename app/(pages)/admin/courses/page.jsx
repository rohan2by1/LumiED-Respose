//app\(pages)\admin\courses\page.jsx
'use client';

import { useEffect, useState } from 'react';
import CustomLink from '@/app/_components/CustomLink';
import { formatPrice } from '@/app/_utils/common';
import { toast } from 'react-toastify';
import request from '@/app/_utils/request';

const AdminCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await request(`/api/admin/course`);
      setCourses(data || []);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
    setLoading(false);
  };

  const toggleSelection = (course_id) => {
    setSelectedCourses(prev =>
      prev.includes(course_id)
        ? prev.filter(courseID => courseID !== course_id)
        : [...prev, course_id]
    );
  };

  const toggleAll = () => {
    if (selectedCourses.length === courses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(courses.map(c => c.course_id));
    }
  };

  const performBulkAction = async (action) => {
    if (selectedCourses.length === 0) {
      toast.warning('Please select at least one course');
      return;
    }

    try {
      await request('/api/admin/course', {
        method: 'PATCH',
        body: { courseIDs: selectedCourses, action }
      });
      setSelectedCourses([]);
      fetchCourses();
    } catch (err) {
      toast.error('Bulk action failed');
      console.error('Bulk action error', err);
    }
  };

  const deleteCourse = async (course_id) => {
    const confirmDelete = confirm('Are you sure you want to delete this course?');
    if (!confirmDelete) return;

    try {
      await request(`/api/admin/course`, {
        method: 'DELETE',
        body: { course_id }
      });
      setCourses(prev => prev.filter(course => course.course_id !== course_id));
      setSelectedCourses([])
    } catch (err) {
      toast.error('Failed to delete course');
      console.error('Delete error', err);
    }
  };

  const getStatusClassName = (status) => {
    status.toLowerCase();
    switch (status) {
      case "published":
        return "bg-green-500";
      case "unpublished":
        return "bg-yellow-500";
      case "draft":
        return "bg-gray-300";
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Admin Dashboard - Courses</h1>
        <CustomLink href="/admin/courses/modify">
          <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm sm:text-base">
            + Add New
          </button>
        </CustomLink>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <p className="text-sm sm:text-base text-gray-700 w-full sm:w-auto">Actions on {selectedCourses.length}:</p>
        <button onClick={() => performBulkAction('draft')} className="px-2 sm:px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition-colors text-xs sm:text-sm">Draft</button>
        <button onClick={() => performBulkAction('published')} className="px-2 sm:px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs sm:text-sm">Publish</button>
        <button onClick={() => performBulkAction('unpublished')} className="px-2 sm:px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-xs sm:text-sm">Unpublish</button>
        {selectedCourses.length === 1 && <button onClick={() => deleteCourse(selectedCourses[0])} className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs sm:text-sm">Delete</button>}
        {false && selectedCourses.length === 1 && <CustomLink target="_blank" href={`/admin/courses/modify/${selectedCourses[0]}`}><button className="px-2 sm:px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-xs sm:text-sm">Edit</button></CustomLink>}
      </div>

      {loading ? (
        <p className="text-sm sm:text-base">Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-sm sm:text-base">No courses available.</p>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 sm:p-3 border-b border-gray-200 text-center sticky left-0 bg-gray-100">
                  <input
                    type="checkbox"
                    checked={selectedCourses.length === courses.length}
                    onChange={toggleAll}
                  />
                </th>
                <th className="p-2 sm:p-3 border-b border-gray-200 text-left text-xs sm:text-sm font-medium whitespace-nowrap">Status</th>
                <th className="p-2 sm:p-3 border-b border-gray-200 text-left text-xs sm:text-sm font-medium whitespace-nowrap">Name</th>
                <th className="p-2 sm:p-3 border-b border-gray-200 text-left text-xs sm:text-sm font-medium whitespace-nowrap">URL</th>
                <th className="p-2 sm:p-3 border-b border-gray-200 text-left text-xs sm:text-sm font-medium whitespace-nowrap">Price</th>
                <th className="p-2 sm:p-3 border-b border-gray-200 text-left text-xs sm:text-sm font-medium whitespace-nowrap">Duration</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course.course_id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-2 sm:p-3 text-center sticky left-0 bg-white">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.course_id)}
                      onChange={() => toggleSelection(course.course_id)}
                    />
                  </td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">
                    <p className={`m-auto rounded text-center max-w-5 px-1 py-0.5 text-xs sm:text-sm ${getStatusClassName(course.status)}`}>{course?.status?.toUpperCase()?.slice(0, 1)}</p>
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium">{course.course_name}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">
                    <CustomLink href={`/course/${course.unique_url}?preview=true`} target="_blank" className={"hover:underline inline-flex items-center gap-1 text-xs sm:text-sm"}>
                      {course.unique_url}
                    </CustomLink>
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">{formatPrice(course.price)}</td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">{course.course_duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCoursesPage;
