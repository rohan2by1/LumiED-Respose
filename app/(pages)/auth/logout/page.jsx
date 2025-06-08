//app\(pages)\auth\logout\page.jsx
"use client";
import { useSession } from "@/app/_provider/sessionProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LogoutPage = () => {
    const { isAuth, setSession } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const logout = async () => {
        try {
            if (isAuth === true) {
                setIsLoading(true); // Start loading
                await fetch(`/api/auth/logout`);
                setSession({ isAuth: false, user_id: undefined });
            }
            setIsLoading(false); // Stop loading
            router.push("/"); // Redirect
        } catch (err) {
            console.error(err);
            setIsLoading(false); // Ensure loading stops on error
        }
    };

    useEffect(() => {
        logout();
    }, [isAuth]); // Ensure useEffect is called only when `isAuth` changes

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {isLoading ? (
                <div className="text-center p-5 bg-white rounded-lg shadow-brand">
                    <p className="text-xl font-semibold text-gray-700">Please wait, we are redirecting...</p>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

export default LogoutPage;
