/**
 * Universal fetch wrapper for our applications (SSR/CSR aware).
 * Handles caching, JSON parsing, headers, and error management.
 */

function getDefaultOptions(storeCache) {
  if (typeof window === "undefined") {
    // Server-side
    return storeCache
      ? { next: { revalidate: 15 * 24 * 60 * 60 } } // 15 days
      : { next: { revalidate: 0 } }; // No caching
  } else {
    // Client-side
    return storeCache ? { cache: "force-cache" } : { cache: "no-store" };
  }
}

function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

/**
 * @param {string} url - API endpoint or resource URL.
 * @param {object} options - Fetch options like method, headers, body.
 * @param {boolean} storeCache - Whether to cache the response or not.
 * @returns {Promise<any>} - Resolves with parsed data or throws an error.
 */
export default async function request(url, options = {}, storeCache = false) {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const defaultOptions = getDefaultOptions(storeCache);

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  // Stringify body if it's a plain object (but not FormData)
  if (
    mergedOptions.body &&
    typeof mergedOptions.body === "object" &&
    !(mergedOptions.body instanceof FormData)
  ) {
    mergedOptions.body = JSON.stringify(mergedOptions.body);
  }

  try {
    const response = await fetch(url, mergedOptions);

    // if (!response.ok) {
    //   let message = `HTTP error! status: ${response.status}`;
    //   try {
    //     const errorData = await response.json();
    //     message = errorData.message || JSON.stringify(errorData);
    //   } catch (_) {
    //     // Ignore JSON parse error
    //   }
    //   throw new Error(message);
    // }

    return await parseJSON(response);
  } catch (error) {
    console.error(`Fetch error [${url}]:`, error);
    throw error;
  }
}
