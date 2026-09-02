/**
 * Client-side image utility to resize and compress uploaded character images
 * Prevents memory bloat across multi-round classroom events on smartboards.
 */
export async function compressAndResizeImage(
  file: File,
  maxDimension: number = 1200,
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve) => {
    // If not in browser or not an image, fall back to object URL
    if (typeof window === "undefined" || !file.type.startsWith("image/")) {
      resolve(URL.createObjectURL(file));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(URL.createObjectURL(file));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP, fall back to JPEG
        let dataUrl: string;
        try {
          dataUrl = canvas.toDataURL("image/webp", quality);
          if (!dataUrl.startsWith("data:image/webp")) {
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }
        } catch {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(dataUrl);
      };

      img.onerror = () => {
        resolve(URL.createObjectURL(file));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve(URL.createObjectURL(file));
    };

    reader.readAsDataURL(file);
  });
}

export { normalizeHexColor, getAmbientColor } from "./colorUtils";
