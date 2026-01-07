"use client";

import Image from "next/image";
import {
  cloudinaryBookCoverLoader,
  getCloudinaryPublicId,
} from "@/lib/cloudinary";

export default function BookCoverImage({
  coverUrl,
  width,
  height,
  fill,
  sizes,
  className,
}: {
  coverUrl: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
}) {
  if (fill) {
    return (
      <Image
        loader={cloudinaryBookCoverLoader}
        src={getCloudinaryPublicId(coverUrl)}
        alt="Book cover"
        width={width ?? 320}
        height={height ?? 450}
        fill
        sizes={
          sizes ??
          `
        (max-width: 640px) 140px,
        (max-width: 1024px) 220px,
        320px
      `
        }
        className={className ?? `rounded-md object-cover mx-auto`}
      />
    );
  }
  return (
    <Image
      loader={cloudinaryBookCoverLoader}
      src={getCloudinaryPublicId(coverUrl)}
      alt="Book cover"
      width={width ?? 320}
      height={height ?? 450}
      sizes={
        sizes ??
        `
        (max-width: 640px) 140px,
        (max-width: 1024px) 220px,
        320px
      `
      }
      className={className ?? `rounded-md object-cover mx-auto`}
    />
  );
}
