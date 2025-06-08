//app\(pages)\page.jsx
import About from "@/app/_components/About";
import Contact from "@/app/_components/Contact";
import CourseSection from "@/app/_components/CourseSection";
import HeroSection from "@/app/_components/HeroSection";
import TeamMember from "@/app/_components/TeamMember";
import { getCourses } from "../_services/course.server";

const page = async () => {
  const course_data = await getCourses(5);
  return (
    <>
    <HeroSection/>
    <About/>
    <CourseSection course_data={course_data}/>
    <TeamMember/>
    <hr className="w-full h-[2px] bg-primary" />
    <div  id="contact-us" className="mb-8"/>
    <Contact/>
    </>
  )
}

export default page