const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const validateImageFile = (file, maxSizeMB = 10) => {
  if (!file) return "No file selected.";
  if (!IMAGE_TYPES.includes(file.type)) {
    return "Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.";
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `File size exceeds maximum limit of ${maxSizeMB}MB.`;
  }
  return null;
};

export const createImagePreview = (file) =>
  file ? URL.createObjectURL(file) : "";

export const getImageUrl = (image) =>
  typeof image === "string" ? image : image?.url || "";

export const getAvatarUrl = (user) =>
  getImageUrl(user?.avatar) || user?.profilePicture || "";
