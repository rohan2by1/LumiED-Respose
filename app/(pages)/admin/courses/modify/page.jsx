//app\(pages)\admin\courses\modify\page.jsx
"use client";

import { useEffect, useState } from "react";
import { ImageKitProvider, IKUpload } from "imagekitio-next";
import { toast } from "react-toastify";
import CONFIG from "@/app/_utils/config";

const publicKey = CONFIG.IK_PUBLIC_KEY;
const urlEndpoint = CONFIG.IK_URL_ENDPOINT;

const defaultForm = {
  unique_url: "",
  video_link: "",
  course_name: "",
  course_title: "",
  course_description: "",
  course_thumbnail: null,
  course_duration: "",
  assignment_added: false,

  price: "",
  instructor: "",
  language: "English",

  what_you_will_learn: [""],
  includes: {
    videoHours: "",
    articles: "",
    downloads: "",
    access: "",
    certificate: "",
  },
  content: [
    {
      title: "",
      lectures: [{ name: "", preview: false, duration: "" }],
    },
  ],
}

let toastId = null;

const Page = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    const saved = sessionStorage.getItem("courseForm");
    if (saved) {
      const parsed = JSON.parse(saved);
      setForm(parsed.form || form);
      setStep(parsed.step || 1);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("courseForm", JSON.stringify({ form, step }));
  }, [form, step]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!form.course_name) {
        toast.error("Course name is required");
        return;
      }
      if (!form.unique_url || !form.unique_url.match(/^[a-z0-9-]+$/)) {
        toast.error("Course URL must be lowercase letters, numbers, or hyphens");
        return;
      }
      if (!form.course_title) {
        toast.error("Course title is required");
        return;
      }
      if (!form.instructor) {
        toast.error("Instructor name is required");
        return;
      }
      if (!form.price || isNaN(Number(form.price))) {
        toast.error("Valid price is required");
        return;
      }
      if (!form.course_duration || !form.course_duration.match(/^\d{2}:\d{2}:\d{2}$/)) {
        toast.error("Course duration must be in format HH:MM:SS");
        return;
      }
      const iframeMatch = form.video_link.match(/<iframe[^>]+src="([^"]+)"[^>]*><\/iframe>/);
      if (!iframeMatch || !/^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]+(\?.*)?$/.test(iframeMatch[1])) {
        toast.error("Please provide a valid YouTube iframe embed code");
        return;
      }
    }

    if (step === 2) {
      if (!form.course_description || form.course_description.length < 100) {
        toast.error("Course description must be at least 100 characters");
        return;
      }
      if (!form.course_thumbnail) {
        toast.error("Please upload a thumbnail");
        return;
      }
    }

    if (step < 4)
      setStep(prev => prev + 1);
  };


  const handlePrevious = () => {
    if (step > 1)
      setStep(prev => prev - 1);
  };

  const updateThumbnail = (url) => {
    setForm((prev) => ({ ...prev, course_thumbnail: url }));
  };

  const authenticator = async () => {
    const res = await fetch("/api/imagekit/auth");
    const data = await res.json();
    return {
      signature: data.signature,
      expire: data.expire,
      token: data.token,
    };
  };

  const resetForm = () => {
    setForm(defaultForm);
    setStep(1);
    sessionStorage.removeItem("courseForm");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      if (key === "includes" || key === "content" || key === "what_you_will_learn") {
        formData.append(key, JSON.stringify(form[key]));
      } else {
        formData.append(key, form[key]);
      }
    }

    try {
      const request = await fetch("/api/admin/course", {
        method: "POST",
        body: formData,
      });

      const response = await request.json();
      if (response?.success) {
        toast.success(`${response?.message || "Course created!"}`);
        resetForm();
      } else {
        toast.error(`${response?.error || "Submission Failed!"}`);
      }
    } catch (error) {
      console.error("ERROR [add-course-api]: ", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-brand.dark mb-6">Create Course</h1>


        <div>
          <form onSubmit={handleSubmit} className="space-y-6 p-4 shadow-brand rounded-md bg-brand-light">

            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="course_name" value={form.course_name} onChange={handleChange} placeholder="Course Name" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                <input name="unique_url" value={form.unique_url} onChange={handleChange} placeholder="Course URL (ai-marketing-101)" pattern="^[a-z0-9-]+$" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                <input name="course_title" value={form.course_title} onChange={handleChange} placeholder="Course Title" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                <input name="instructor" value={form.instructor} onChange={handleChange} placeholder="Instructor Name" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price ₹" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                <input name="language" value={form.language} onChange={handleChange} placeholder="Language" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                <input name="course_duration" value={form.course_duration} onChange={handleChange} placeholder="00:00:00" pattern="\d{2}:\d{2}:\d{2}" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                <input name="video_link" value={form.video_link} onChange={handleChange} placeholder="YouTube Link" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                {/* <label className="flex items-center col-span-2 mt-2">
                  <input type="checkbox" name="assignment_added" checked={form.assignment_added} onChange={handleChange} className="mr-2" />
                  Add Assignment?
                </label> */}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <textarea name="course_description" value={form.course_description} onChange={handleChange} minLength={100} placeholder="Course Description (min 100 chars)" className="input h-32 w-full p-1 rounded" required />
                <label className="block text-sm font-medium">Upload Thumbnail</label>
                <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
                  <IKUpload
                    useUniqueFileName={false}
                    folder={`${CONFIG.IK_COURSE_FOLDER}`}
                    fileName={`${form.unique_url}.png`}
                    onUploadStart={() => toastId = toast.loading("Uploading thumbnail...")}
                    onSuccess={(res) => {
                      updateThumbnail(res.url);
                      toast.update(toastId, { render: "Thumbnail uploaded!", type: "success", isLoading: false, autoClose: 2000 });
                    }}
                    onError={() => toast.error("Upload failed.")}
                  />
                </ImageKitProvider>
                {form.course_thumbnail && <img src={form.course_thumbnail} className="w-32 h-32 object-cover rounded-md mt-2" />}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-xl">What You Will Learn</h2>
                  <button type="button" onClick={() => setForm((prev) => ({
                    ...prev,
                    what_you_will_learn: [...prev.what_you_will_learn, ""]
                  }))} className="h-6 w-6"><img src="/icons/add.png" alt="add-icon" /></button>
                </div>
                {form.what_you_will_learn.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      value={item}
                      onChange={(e) => {
                        const updated = [...form.what_you_will_learn];
                        updated[index] = e.target.value;
                        setForm((prev) => ({ ...prev, what_you_will_learn: updated }));
                      }}
                      placeholder={`Learning Point ${index + 1}`}
                      className="input flex-1 rounded p-2"
                    />
                    <button type="button" onClick={() => {
                      const updated = form.what_you_will_learn.filter((_, i) => i !== index);
                      setForm((prev) => ({ ...prev, what_you_will_learn: updated }));
                    }}>❌</button>
                  </div>
                ))}

                <hr className="w-full h-[2px] bg-primary" />

                <h2 className="font-semibold text-xl mt-6">Course Includes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(form.includes).map(([key, value]) => (
                    <input
                      key={key}
                      name={key}
                      value={value}
                      onChange={(e) => setForm((prev) => ({
                        ...prev,
                        includes: { ...prev.includes, [key]: e.target.value }
                      }))}
                      placeholder={key}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Course Content</h2>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        content: [
                          ...prev.content,
                          { title: "", lectures: [{ name: "", preview: false, duration: "" }] },
                        ],
                      }))
                    }
                    className="h-8 w-8"
                  >
                    <img src="/icons/add.png" alt="add-section" />
                  </button>
                </div>

                {form.content.map((section, sIdx) => (
                  <div key={sIdx} className="border p-4 rounded space-y-4 bg-white shadow-sm">
                    <div className="flex justify-between items-center">
                      <input
                        value={section.title}
                        onChange={(e) => {
                          const updated = [...form.content];
                          updated[sIdx].title = e.target.value;
                          setForm((prev) => ({ ...prev, content: updated }));
                        }}
                        placeholder={`Section Title ${sIdx + 1}`}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...form.content];
                          updated.splice(sIdx, 1);
                          setForm((prev) => ({ ...prev, content: updated }));
                        }}
                        className="ml-2 h-8 w-8"
                        title="Remove Section"
                      >
                        <img src="/icons/delete_red.png" alt="delete-section" />
                      </button>
                    </div>

                    {section.lectures.map((lecture, lIdx) => (
                      <div key={lIdx} className="flex gap-2 items-center">
                        <input
                          value={lecture.name}
                          onChange={(e) => {
                            const updated = [...form.content];
                            updated[sIdx].lectures[lIdx].name = e.target.value;
                            setForm((prev) => ({ ...prev, content: updated }));
                          }}
                          placeholder="Lecture Name"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <input
                          value={lecture.duration}
                          onChange={(e) => {
                            const updated = [...form.content];
                            updated[sIdx].lectures[lIdx].duration = e.target.value;
                            setForm((prev) => ({ ...prev, content: updated }));
                          }}
                          placeholder="Duration (e.g., 05:00)"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={lecture.preview}
                            onChange={(e) => {
                              const updated = [...form.content];
                              updated[sIdx].lectures[lIdx].preview = e.target.checked;
                              setForm((prev) => ({ ...prev, content: updated }));
                            }}
                          />
                          Preview
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...form.content];
                            updated[sIdx].lectures.splice(lIdx, 1);
                            setForm((prev) => ({ ...prev, content: updated }));
                          }}
                          className="h-8 w-16"
                          title="Remove Lecture"
                        >
                          <img src="/icons/delete_red.png" alt="delete-lecture" />
                        </button>
                        {lIdx === section.lectures.length - 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...form.content];
                              updated[sIdx].lectures.push({ name: "", preview: false, duration: "" });
                              setForm((prev) => ({ ...prev, content: updated }));
                            }}
                            className="h-8 w-16"
                            title="Add Lecture"
                          >
                            <img src="/icons/add.png" alt="add-lecture" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {step === 4 && <div className="flex justify-end mt-8">
              <button type="submit" className="py-2 px-4 rounded btn bg-blue-500 text-white hover:bg-primary">Submit</button>
            </div>}

          </form>

          <div className="flex justify-between mt-8">
            <button type="button" onClick={handlePrevious} className="py-2 px-4 rounded btn bg-primary text-white hover:bg-brand-dark">Back</button>
            <button type="button" onClick={handleNext} className="py-2 px-4 rounded btn bg-brand-dark text-white hover:bg-primary">Next</button>
          </div>
        </div>

      </div>
    </>
  );
};

export default Page;
