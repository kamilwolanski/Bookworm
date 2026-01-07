"use client";
import { authorAvatarLoader, getCloudinaryPublicId } from "@/lib/cloudinary";
import Image from "next/image";

export default function AuthorAvatar({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <Image
      loader={authorAvatarLoader}
      src={getCloudinaryPublicId(src)}
      alt={alt}
      width={320}
      height={620}
      className="rounded-md object-cover mx-auto"
    />
  );
}
