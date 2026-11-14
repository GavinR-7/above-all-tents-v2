import type { Metadata } from "next";
import { business } from "@/data/site";

/**
 * Metadata for a sub-page.
 *
 * Next replaces `openGraph` wholesale when a page sets it, so a page that only
 * sets title/description/url loses the site name, the type and the share image
 * the root layout provides. Spelling them out here keeps every page's link
 * preview complete. The image is the file-convention one in app/.
 */
export function pageMetadata(
  path: string,
  seo: { title: string; description: string },
): Metadata {
  const image = {
    url: "/opengraph-image.png",
    width: 1200,
    height: 630,
    alt: business.name,
  };
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: path,
      siteName: business.name,
      locale: "en_US",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [image.url],
    },
  };
}
