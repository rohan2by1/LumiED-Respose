//app\(pages)\course\[unique_url]\learn\page.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import CustomLink from "@/app/_components/CustomLink";
import Button from "@/app/_ui/Button";
import Loader from "@/app/_components/Loader";
import YouTube from "react-youtube";
import { iframeToYouTubeLink } from "@/app/_utils/common";

export default function LearnPage() {
    const { unique_url } = useParams();
    const [course, setCourse] = useState(null);
    const [progress, setProgress] = useState(null);
    const [watchedSeconds, setWatchedSeconds] = useState(0);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const lastSynced = useRef(0);
    const intervalRef = useRef(null);

    // Convert normal YouTube URL to video ID
    const getVideoIdFromUrl = (url) => {
        const match = url?.match(/(?:\?v=|\/embed\/|\.be\/)([^&\n?#]+)/);
        return match?.[1] || "";
    };

    // Load course + progress
    useEffect(() => {
        if (!unique_url) return;
        const fetchCourse = async () => {
            const res = await fetch(`/api/course/${unique_url}/learn`);
            const json = await res.json();
            if (json.success) {
                setCourse(json.data.course);
                setIsEnrolled(json.data.is_enrolled);
                setProgress(json.data.progress);
                setWatchedSeconds(json.data.progress?.watched_seconds || 0);
            }
        };
        fetchCourse();
    }, [unique_url]);

    // Track watchedSeconds while playing
    const handleStateChange = (event) => {
        const YT = event.target;

        const state = YT.getPlayerState();

        if (state === 1) {
            // Playing
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setWatchedSeconds((prev) => {
                    const current = Math.floor(YT.getCurrentTime());
                    return Math.max(prev, current);
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
    };

    // Sync progress every 30 seconds
    useEffect(() => {
        const syncInterval = setInterval(() => {
            if (course?.course_id && watchedSeconds > lastSynced.current) {
                syncProgress(watchedSeconds);
                lastSynced.current = watchedSeconds;
            }
        }, 30000);
        return () => clearInterval(syncInterval);
    }, [watchedSeconds, course]);

    // Unload sync
    useEffect(() => {
        const handleUnload = () => {
            if (!course?.course_id || !isEnrolled) return;
            navigator.sendBeacon(
                "/api/course/progress",
                JSON.stringify({ course_id: course.course_id, watchedSeconds })
            );
        };
        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [watchedSeconds]);

    const syncProgress = async (seconds) => {
        try {
            await fetch("/api/course/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ course_id: course.course_id, watched_seconds: seconds }),
            });
        } catch (err) {
            console.warn("Sync failed", err);
        }
    };

    const totalDuration = useMemo(() => progress?.total_duration || 1800, [progress]);
    const percent = useMemo(() => Math.min((watchedSeconds / totalDuration) * 100, 100), [watchedSeconds, totalDuration]);
    const isAssignmentUnlocked = useMemo(() => progress?.assignment_unlocked || percent >= 85, [progress, percent]);

    const videoId = iframeToYouTubeLink(`${course?.video_link}`); //iframeToYouTubeLink
    //   console.log(videoId)
    return (
        <div className="min-h-screen px-4 py-10 bg-background text-foreground">
            {course ? (
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel: Video Player */}
                    <div className="lg:col-span-2">
                        <div className="aspect-video rounded overflow-hidden shadow-brand border">
                            <YouTube
                                videoId={videoId?.replace("https://www.youtube.com/watch?v=", "") || ""}
                                onStateChange={handleStateChange}
                                className="w-full h-full rounded"
                                opts={{
                                    height: '100%',
                                    width: '100%',
                                    playerVars: {
                                        modestbranding: 1,
                                        rel: 0,
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Panel: Course Info & Progress */}
                    <div className="space-y-6 border border-gray-200 rounded p-6 shadow-sm bg-white dark:bg-gray-900">
                        <h2 className="text-xl font-bold">{course.course_name}</h2>

                        {isEnrolled ? (
                            <>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Progress: {watchedSeconds}s / {totalDuration}s
                                    </p>
                                    <div className="w-full bg-gray-200 h-4 rounded overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 transition-all"
                                            style={{ width: `${percent.toFixed(2)}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {percent.toFixed(1)}% watched
                                    </p>
                                </div>

                                {isAssignmentUnlocked ? (
                                    <CustomLink href={`/course/${unique_url}/assignment`}>
                                        <Button variant="primary" className="w-full">
                                            Take Assignment
                                        </Button>
                                    </CustomLink>
                                ) : (
                                    <p className="text-red-500 text-sm font-medium">
                                        Watch at least 85% to unlock the assignment.
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-red-600 font-medium">
                                You are not enrolled in this course.
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="min-h-screen flex items-center justify-center">
                    <Loader />
                </div>
            )}
        </div>
    );

}
