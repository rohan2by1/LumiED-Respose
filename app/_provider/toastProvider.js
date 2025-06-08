"use client";

import "react-toastify/dist/ReactToastify.css";
import "../globals.css";
import { Bounce, ToastContainer } from "react-toastify";


export default function ToastProvider({ children }) {
    return (
        <>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

        </>
    );
}