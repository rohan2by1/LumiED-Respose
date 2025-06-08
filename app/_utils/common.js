export const formatPrice = (price) => {
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
  return formattedPrice.replace("₹", "₹ "); // Add space after currency symbol
};

export function iframeToYouTubeLink(iframeHtml) {
  const match = iframeHtml.match(/src="https:\/\/www\.youtube\.com\/embed\/([^"?&]+)"/);
  if (match && match[1]) {
    return `https://www.youtube.com/watch?v=${match[1]}`;
  }
  return null;
}

export function convertToSec(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;

  const parts = timeStr.split(':').map(Number);

  // Support HH:MM:SS or MM:SS or SS
  while (parts.length < 3) {
    parts.unshift(0); // pad with 0s for missing hours/minutes
  }

  const [hours, minutes, seconds] = parts;
  return (hours * 3600) + (minutes * 60) + seconds;
}