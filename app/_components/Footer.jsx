//app\_components\Footer.jsx
import CustomLink from './CustomLink';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 text-white py-8 sm:py-10 md:py-12 shadow-lg rounded-t-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 border-b border-white/20 pb-6 sm:pb-8 mb-6 sm:mb-8">
          
          {/* Footer Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 drop-shadow-md">
                LumiED 
                <span className="text-indigo-300 text-xs sm:text-sm font-semibold ml-2">
                  E-learning platform
                </span>
              </h1>
            </div>
            
            <p className="text-sm sm:text-base text-indigo-200 leading-relaxed drop-shadow-sm">
              LumiED is your ultimate e-learning solution. With personalized learning paths, microservices-driven
              architecture, and an intuitive interface, we aim to revolutionize education. Discover, learn, and excel
              with LumiED — where education meets innovation.
            </p>
            
            <div className="space-y-2 text-sm sm:text-base">
              <p className="font-semibold text-indigo-300 drop-shadow-md">
                support@lumied.com
              </p>
              <p className="font-semibold text-indigo-300 drop-shadow-md">
                +91 1245369870
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:justify-end">
            {/* Social Media Links */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5 drop-shadow-md">
                Social
              </h2>
              <ul className="space-y-3">
                <li>
                  <CustomLink
                    href="#"
                    target="_blank"
                    className="flex items-center gap-3 hover:text-indigo-300 transition-colors duration-300 text-sm sm:text-base font-medium sm:font-semibold group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987H7.898v-2.892h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.466h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.892h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                    Facebook
                  </CustomLink>
                </li>
                <li>
                  <CustomLink
                    href="#"
                    target="_blank"
                    className="flex items-center gap-3 hover:text-indigo-300 transition-colors duration-300 text-sm sm:text-base font-medium sm:font-semibold group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23 3a10.9 10.9 0 01-3.14.86 4.48 4.48 0 001.98-2.48 9.03 9.03 0 01-2.85 1.08 4.52 4.52 0 00-7.69 4.13A12.9 12.9 0 013 4.15a4.48 4.48 0 001.39 6.04 4.41 4.41 0 01-2.05-.57v.06a4.5 4.5 0 003.63 4.42 4.52 4.52 0 01-2.04.08 4.52 4.52 0 004.21 3.13A9.05 9.05 0 012 19.54a12.75 12.75 0 006.92 2.03c8.31 0 12.85-6.87 12.85-12.82 0-.2 0-.39-.02-.58A9.18 9.18 0 0023 3z" />
                    </svg>
                    Twitter
                  </CustomLink>
                </li>
                <li>
                  <CustomLink
                    href="#"
                    target="_blank"
                    className="flex items-center gap-3 hover:text-indigo-300 transition-colors duration-300 text-sm sm:text-base font-medium sm:font-semibold group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 2A3.75 3.75 0 004 7.75v8.5A3.75 3.75 0 007.75 20h8.5a3.75 3.75 0 003.75-3.75v-8.5A3.75 3.75 0 0016.25 4h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                      <circle cx="18.5" cy="5.5" r="1.5" />
                    </svg>
                    Instagram
                  </CustomLink>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5 drop-shadow-md">
                Company
              </h2>
              <ul className="space-y-3">
                <li>
                  <CustomLink
                    href="#"
                    className="hover:text-indigo-300 hover:underline transition duration-300 text-sm sm:text-base font-medium sm:font-semibold inline-block"
                  >
                    Terms and Conditions
                  </CustomLink>
                </li>
                <li>
                  <CustomLink
                    href="#"
                    className="hover:text-indigo-300 hover:underline transition duration-300 text-sm sm:text-base font-medium sm:font-semibold inline-block"
                  >
                    Privacy Policy
                  </CustomLink>
                </li>
                <li>
                  <CustomLink
                    href="#"
                    className="hover:text-indigo-300 hover:underline transition duration-300 text-sm sm:text-base font-medium sm:font-semibold inline-block"
                  >
                    Refund Policy
                  </CustomLink>
                </li>
                <li>
                  <CustomLink
                    href="#"
                    className="hover:text-indigo-300 hover:underline transition duration-300 text-sm sm:text-base font-medium sm:font-semibold inline-block"
                  >
                    FAQ
                  </CustomLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Copyright Info */}
        <div className="text-center sm:text-right text-indigo-300 text-xs sm:text-sm select-none">
          <p>© {new Date().getFullYear()} LumiED Pvt. Ltd., India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}