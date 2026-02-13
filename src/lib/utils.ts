import { SocialLink } from "./types";

export const getPlatformFromUrl = (url: string): SocialLink['platform'] => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'twitter';
    if (lowerUrl.includes('instagram.com')) return 'instagram';
    if (lowerUrl.includes('facebook.com')) return 'facebook';
    if (lowerUrl.includes('youtube.com')) return 'youtube';
    if (lowerUrl.includes('linkedin.com')) return 'linkedin';
    if (lowerUrl.includes('pinterest.com')) return 'pinterest';
    if (lowerUrl.includes('tiktok.com')) return 'tiktok';
    return 'website';
};

export const getFullImageUrl = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
        return url;
    }
    // Remove leading slash if present in url to avoid double slash
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    const cleanBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

    return `${cleanBaseUrl}/${cleanUrl}`;
};

/**
 * Optimizes Cloudinary image URLs by injecting transformation parameters.
 * If the URL is not a Cloudinary URL, it returns the original URL.
 * 
 * @param url The original image URL
 * @param width The desired width
 * @param height The desired height
 * @returns The optimized URL
 */
export const optimizeImage = (url: string | undefined, width: number, height: number): string | undefined => {
    if (!url) return undefined;
    if (!url.includes('cloudinary.com')) return url;

    // Check if URL already has transformations (this is a simple check, might need to be more robust)
    // Cloudinary URLs usually have /upload/ followed by version or transformations
    // We want to insert transformations after /upload/

    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;

    const prefix = url.substring(0, uploadIndex + 8); // include /upload/
    const suffix = url.substring(uploadIndex + 8);

    const transformations = `w_${width},h_${height},c_fill,q_auto,f_auto`;

    return `${prefix}${transformations}/${suffix}`;
};


export const generateUsername = (name: string, email: string) => {
    let base = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (base.length < 3) {
        base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    }
    if (base.length < 3) base = "user" + base;
    return base + Math.floor(Math.random() * 1000);
};


export const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
};

export const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
};
