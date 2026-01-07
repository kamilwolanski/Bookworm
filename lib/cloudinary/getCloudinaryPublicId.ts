export function getCloudinaryPublicId(fullUrl: string) {
  const [, afterUpload] = fullUrl.split("/upload/");
  return afterUpload;
}
