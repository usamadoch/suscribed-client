import { getFullImageUrl } from "./utils";

// --- 1. Schema Definition ---

export const IMAGE_FAMILIES = {
    AVATAR: 'avatar',
    BANNER: 'banner',
    POST: 'post',
    THUMB: 'thumb',
} as const;

export type ImageFamily = typeof IMAGE_FAMILIES[keyof typeof IMAGE_FAMILIES];

// Define slots for each family directly as a mapped type for better inference
export const SLOT_CONFIG = {
    [IMAGE_FAMILIES.AVATAR]: {
        navbar: { width: 40, height: 40, label: 'Navbar Avatar' },
        dropdown: { width: 40, height: 40, label: 'Dropdown Avatar' },
        comment: { width: 40, height: 40, label: 'Comment Avatar' },
        profile: { width: 128, height: 128, label: 'Small Profile Avatar' },
        feed: { width: 48, height: 48, label: 'Feed Avatar' },
        sidebar: { width: 40, height: 40, label: 'Sidebar Avatar' }, // Added for 22px/24px usage
    },
    [IMAGE_FAMILIES.BANNER]: {
        creatorPage: { width: 1920, height: 384, label: 'Creator Page Banner' },
        profileHeader: { width: 900, height: 180, label: 'Profile Header' },
    },
    [IMAGE_FAMILIES.POST]: {
        composerPreview: { width: 300, height: 300, label: 'Composer Preview' },
        grid: { width: 400, height: 400, label: 'Grid Thumbnail' },
        feed: { width: 1200, height: 1200, label: 'Feed Main Image', crop: 'limit' },
        modal: { width: 1200, height: 1200, label: 'Modal Full View', crop: 'limit' },
    },
    [IMAGE_FAMILIES.THUMB]: {
        searchResult: { width: 120, height: 120, label: 'Search Result' },
        notification: { width: 80, height: 80, label: 'Notification' },
    }
} as const;

export type SlotFamily = keyof typeof SLOT_CONFIG;
export type SlotName<F extends SlotFamily> = keyof typeof SLOT_CONFIG[F] & string;

// Union type for all possible slots string literal "family.slot"
export type ImageSlot = {
    [F in SlotFamily]: {
        [S in SlotName<F>]: `${F}.${S & string}`
    }[SlotName<F>]
}[SlotFamily];

export interface SlotDimension {
    width: number;
    height: number;
    label: string;
    crop?: 'fill' | 'limit' | 'fit' | 'scale';
}

// --- 2. Configuration & Defaults ---

// These are Public IDs or Full URLs for Cloudinary defaults.
// They act as the "Setup" the user requested.
export const CLOUDINARY_DEFAULTS = {
    [IMAGE_FAMILIES.AVATAR]: 'https://ui-avatars.com/api/?name=User&background=random',
    [IMAGE_FAMILIES.BANNER]: 'https://picsum.photos/1920/320',
    [IMAGE_FAMILIES.POST]: 'https://picsum.photos/800/800',
    fallback: 'https://picsum.photos/400/400',
};


// --- 3. Transformation Logic ---

interface TransformationOptions {
    dpr?: number; // default 2
    format?: 'auto' | 'webp' | 'avif'; // default auto
    quality?: 'auto' | number; // default auto
}

export const getSlotDimensions = <F extends SlotFamily>(family: F, slot: SlotName<F>): SlotDimension => {
    // @ts-ignore - TS union complexity
    const config = SLOT_CONFIG[family][slot];
    if (!config) {
        console.warn(`[ImageSystem] invalid slot: ${family}.${String(slot)}`);
        return { width: 0, height: 0, label: 'Invalid' };
    }
    return config as unknown as SlotDimension;
};

export const constructSlotImageUrl = <F extends SlotFamily>(
    url: string | null | undefined,
    family: F,
    slot: SlotName<F>,
    options: TransformationOptions = {}
): string => {
    // 1. Resolve Target URL
    let targetUrl = url;

    // Use default if url is missing
    if (!targetUrl) {
        // Determine default based on family
        targetUrl = CLOUDINARY_DEFAULTS[family as keyof typeof CLOUDINARY_DEFAULTS] || CLOUDINARY_DEFAULTS.fallback;
    }

    // Ensure we have a full URL or proper Cloudinary ID handling
    const fullUrl = getFullImageUrl(targetUrl);

    // Safety fallback (shouldn't really happen if defaults are set, but for Typescript return type)
    if (!fullUrl) return '';

    // 2. Lookup Slot Config
    const config = getSlotDimensions(family, slot);

    if (!config || (config.width === 0 && config.height === 0)) {
        console.error(`[ImageSystem] Unknown slot: ${family}.${String(slot)}`);
        return fullUrl;
    }

    const { width, height, crop } = config;
    const dpr = options.dpr || 2.0;

    // 3. Cloudinary Transformation
    // We assume if it's NOT a full URL, it might be a public ID we need to construct
    // OR if it IS a cloudinary URL, we inject params.

    // Check if it's a "clean" Cloudinary Public ID (no slashes, or simple path) vs Full URL
    // Actually getFullImageUrl might preserve 'http' but prefixes API_URL for others.
    // If we have a public ID like 'defaults/avatar', getFullImageUrl might make it 'http://api.../defaults/avatar' which is WRONG for Cloudinary.
    // So we need to detect if it's a Cloudinary asset.

    // Heuristic: If it contains 'cloudinary.com', treat as full URL.
    if (fullUrl.includes('cloudinary.com')) {
        return buildCloudinaryUrl(fullUrl, { width, height, crop, ...options, dpr });
    }

    // If it DOESN'T contain cloudinary.com, but we are in "Cloudinary Mode", 
    // it likely means `url` was a relative path/public ID that got prefixed by getFullImageUrl (bad)
    // OR it was just the public ID.
    // We'll assume for this system: IF it's not an external URL (http/https) meant for others, treat as Cloudinary Public ID.
    // But `getFullImageUrl` forces http prefix.

    // Improved Logic:
    // Retest the original `targetUrl` (before getFullImageUrl)
    if (!targetUrl.startsWith('http') && !targetUrl.startsWith('data:') && !targetUrl.startsWith('blob:')) {
        // It's a relative path -> Treat as Cloudinary Public ID
        // Construct full Cloudinary URL
        // We need the cloud name. Since we don't have it in env here easily without process.env, 
        // we'll assume the provided URLs from backend ARE full Cloudinary URLs usually.
        // BUT for defaults (which are just IDs), we need to construct it.

        // HACK: Use a placeholder base if we don't have one, or assume the user will provide full URLs for defaults.
        // Better: Expect the user to provide full URLs in CLOUDINARY_DEFAULTS, or set a base.
        // The user said "depend on setup". I'll use a clearer setup var.

        return buildCloudinaryPublicIdUrl(targetUrl, { width, height, crop, ...options, dpr });
    }

    // Fallback for external images (e.g. Google Auth) -> Return as is (no resize)
    return fullUrl;
};

// --- Helpers ---

const CLOUDINARY_BASE_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL_BASE || 'https://res.cloudinary.com/demo/image/upload';
// Note: 'demo' is a fallback. User should set NEXT_PUBLIC_CLOUDINARY_URL_BASE in .env
// Example: https://res.cloudinary.com/my-cloud-name/image/upload

const buildCloudinaryPublicIdUrl = (
    publicId: string,
    params: { width: number; height: number; dpr: number; format?: string; quality?: string | number; crop?: string }
) => {
    // Clean leading slash
    const id = publicId.startsWith('/') ? publicId.slice(1) : publicId;

    const transforms = [
        `w_${params.width}`,
        `h_${params.height}`,
        `c_${params.crop || 'fill'}`,
        `dpr_${params.dpr}`,
        `q_${params.quality || 'auto'}`,
        `f_${params.format || 'auto'}`
    ];

    return `${CLOUDINARY_BASE_URL}/${transforms.join(',')}/${id}`;
}

const buildCloudinaryUrl = (
    originalUrl: string,
    params: { width: number; height: number; dpr: number; format?: string; quality?: string | number; crop?: string }
) => {
    if (originalUrl.includes('/upload/w_')) {
        return originalUrl;
    }

    const uploadIndex = originalUrl.indexOf('/upload/');
    if (uploadIndex === -1) return originalUrl;

    const prefix = originalUrl.substring(0, uploadIndex + 8);
    const suffix = originalUrl.substring(uploadIndex + 8);

    const transforms = [
        `w_${params.width}`,
        `h_${params.height}`,
        `c_${params.crop || 'fill'}`,
        `dpr_${params.dpr}`,
        `q_${params.quality || 'auto'}`,
        `f_${params.format || 'auto'}`
    ];

    return `${prefix}${transforms.join(',')}/${suffix}`;
};
