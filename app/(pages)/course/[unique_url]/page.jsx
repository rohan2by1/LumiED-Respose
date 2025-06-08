//app\(pages)\course\[unique_url]\page.jsx
import { cookies } from "next/headers";
import CourseDetails from "@/app/_containers/CourseDetails";

export default async function Page({ params, searchParams }) {
  const { unique_url } = await params;
  const { preview } = await searchParams;
  const cookieStore = await cookies()

  const requestNormalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/course/${unique_url}`;
  const requestUserUrlWithPreview = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/course/${unique_url}`;
  const requestUrl = preview === "true" ? requestUserUrlWithPreview : requestNormalUrl;

  const res = await fetch(requestUrl, {
    headers: {
      Cookie: cookieStore.toString()
    },
    cache: "no-store",
  });

  const response = await res.json();
  const course = response.data;

  return <CourseDetails course={course} unique_url={unique_url}/>;
}
