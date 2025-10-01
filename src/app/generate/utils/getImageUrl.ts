import { SITE_URL } from "@/lib/constants";

export function getImageUrl(image: string, isPdf: boolean = false) {
  if (!image) return `${SITE_URL}/assets/images/image-default.jpg`;

  const isWebp = image.endsWith(".webp");

  if (image.startsWith("assets/images/")) {
    return isWebp
      ? `${SITE_URL}/api/proxy?url=${encodeURIComponent(`${SITE_URL}/${image}`)}`
      : `${SITE_URL}/${image}`;
  }

  if (isPdf) {
    return isWebp
      ? `${SITE_URL}/api/proxy?url=${encodeURIComponent(image)}`
      : image;
  }

  if (isWebp) {
    return `${SITE_URL}/api/proxy?url=${encodeURIComponent(image)}`;
  }

  return image;
}
