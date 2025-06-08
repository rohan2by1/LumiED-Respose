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
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard - Courses</h1>
        <CustomLink href="/admin/courses/modify">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            + Add New
          </button>
        </CustomLink>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <p className="text-gray-700">Actions on {selectedCourses.length}:</p>
        <button onClick={() => performBulkAction('draft')} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-200">Draft</button>
        <button onClick={() => performBulkAction('published')} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400">Publish</button>
        <button onClick={() => performBulkAction('unpublished')} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400">Unpublish</button>
        {selectedCourses.length === 1 && <button onClick={() => deleteCourse(selectedCourses[0])} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500">Delete</button>}
        {false && selectedCourses.length === 1 && <CustomLink target="_blank" href={`/admin/courses/modify/${selectedCourses[0]}`}><button className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-400">Edit</button></CustomLink>}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedCourses.length === courses.length}
                    onChange={toggleAll}
                  />
                </th>
                {/* <th className="p-2 border text-left">Sno</th> */}
                <th className="p-2 border text-left">Status</th>
                <th className="p-2 border text-left">Name</th>
                <th className="p-2 border text-left">URL</th>
                <th className="p-2 border text-left">Price</th>
                <th className="p-2 border text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course.course_id} className="border-t">
                  <td className="p-2 border text-center">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.course_id)}
                      onChange={() => toggleSelection(course.course_id)}
                    />
                  </td>
                  <td className="p-2 border">
                    <p className={`m-auto rounded text-center max-w-5 ${getStatusClassName(course.status)}`}>{course?.status?.toUpperCase()?.slice(0, 1)}</p>
                  </td>
                  {/* <td className="p-2 border">{index+1}</td> */}
                  <td className="p-2 border">{course.course_name}</td>
                  <td className="p-2 border">
                    <CustomLink href={`/course/${course.unique_url}?preview=true`} target="_blank" className={"hover:underline inline-flex items-center gap-1"}>
                      {course.unique_url}
                    </CustomLink>
                  </td>
                  <td className="p-2 border">{formatPrice(course.price)}</td>
                  <td className="p-2 border">{course.course_duration}</td>
                  {/* <td className="p-2 border flex justify-around items-center">
                    <CustomLink href={`/course/${course.unique_url}?preview=true`} target="_blank" disabled={selectedCourses.length > 0}>
                      <img src="/icons/view.png" alt="" className='bg-green-400 p-1 h-6 w-6 rounded hover:bg-green-500' />
                    </CustomLink>
                    {selectedCourses.length === 0 && <>
                      <button onClick={() => deleteCourse(course.course_id)} disabled={selectedCourses.length > 0}>
                        <img src="/icons/edit.png" alt="" className='bg-yellow-400 p-1 h-6 w-6 rounded hover:bg-yellow-500' />
                      </button>
                      <button onClick={() => deleteCourse(course.course_id)} disabled={selectedCourses.length > 0}>
                        <img src="/icons/delete.png" alt="" className='bg-red-400 p-1 h-6 w-6 rounded hover:bg-red-500' />
                      </button>
                    </>
                    }
                  </td> */}
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
