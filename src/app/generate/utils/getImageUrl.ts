import { SITE_URL } from "@/lib/constants";

export function getImageUrl(image: string, isPdf: boolean = false) {
  if (!image) return `${SITE_URL}/assets/images/image-default.jpg`;

  if (image.startsWith("assets/images/products/")) {
    return `${SITE_URL}/${image}`;
  }

  if (isPdf) {
    return `/api/proxy?url=${encodeURIComponent(image)}`;
  }

  return image;
}
