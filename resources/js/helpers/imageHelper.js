/**
 * Image Helper Functions for Responsive Images with Thumbor
 * Generates srcset and handles modern image formats via Thumbor service
 */

// Thumbor configuration
const THUMBOR_BASE_URL = 'https://thumbor.sex-opt.ru/unsafe';

// Default thumbnail sizes
const THUMBNAIL_SIZES = {
    card: { width: 300, height: 450 },      // Product cards in catalog
    gallery: { width: 400, height: 600 },   // Gallery on product detail page
    large: { width: 900, height: 1350 },    // Larger preview
};

/**
 * Generate Thumbor URL for an image with specified dimensions
 * @param {string} imageUrl - Original image URL (must be absolute)
 * @param {number} width - Target width
 * @param {number} height - Target height
 * @param {object} options - Additional options (filters, fitIn, etc.)
 * @returns {string} Thumbor URL
 */
export const getThumborUrl = (imageUrl, width, height, options = {}) => {
    if (!imageUrl) return '';

    // Don't process placeholder images
    if (imageUrl.includes('placehold.co')) {
        return imageUrl;
    }

    // Don't double-process Thumbor URLs
    if (imageUrl.includes('thumbor.sex-opt.ru')) {
        return imageUrl;
    }

    // For relative URLs, we can't use Thumbor (it needs absolute URLs)
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    const {
        fitIn = true,
        filters = ['fill(white)', 'upscale()']
    } = options;

    const sizeStr = fitIn ? `fit-in/${width}x${height}` : `${width}x${height}`;
    const filterStr = filters.length > 0 ? `filters:${filters.join(':')}` : '';

    // Build Thumbor URL: /unsafe/fit-in/WxH/filters:.../original_url
    const parts = [THUMBOR_BASE_URL, sizeStr];
    if (filterStr) parts.push(filterStr);
    parts.push(imageUrl);

    return parts.join('/');
};

/**
 * Get thumbnail URL for an image (for product cards)
 * @param {string} url - Original image URL
 * @param {string} size - Size preset: 'card', 'gallery', 'large'
 * @returns {string} Thumbnail URL via Thumbor
 */
export const getThumbnailUrl = (url, size = 'card') => {
    if (!url) return '';

    const sizeConfig = THUMBNAIL_SIZES[size] || THUMBNAIL_SIZES.card;
    return getThumborUrl(url, sizeConfig.width, sizeConfig.height);
};

/**
 * Generate responsive image attributes
 * @param {string} imageUrl - Base image URL
 * @param {string} altText - Alternative text
 * @param {object} options - Options: sizes, className, etc.
 * @returns {object} Image props object
 */
export const generateResponsiveImageProps = (imageUrl, altText = '', options = {}) => {
    if (!imageUrl) {
        return {
            src: 'https://placehold.co/400x400/e5e7eb/6b7280?text=No+Image',
            alt: altText || 'No image available',
            loading: 'lazy',
            width: 400,
            height: 400,
            className: options.className || ''
        };
    }

    return {
        src: imageUrl,
        sizes: options.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
        alt: altText,
        loading: options.loading || 'lazy',
        width: options.width || 400,
        height: options.height || 400,
        className: options.className || '',
        // Modern image optimization hints
        style: {
            contentVisibility: 'auto',
            containIntrinsicSize: `${options.width || 400}px ${options.height || 400}px`
        }
    };
};

/**
 * Generate picture element sources for multiple formats
 * @param {string} imageUrl - Base image URL
 * @returns {Array} Array of source objects
 */
export const generatePictureSources = (imageUrl) => {
    if (!imageUrl) return [];

    const baseName = imageUrl.substring(0, imageUrl.lastIndexOf('.'));

    return [
        {
            srcSet: `${baseName}.avif`,
            type: 'image/avif'
        },
        {
            srcSet: `${baseName}.webp`,
            type: 'image/webp'
        }
    ];
};

/**
 * Convert image URL to WebP format
 * @param {string} url - Original image URL
 * @returns {string} WebP image URL
 */
export const toWebP = (url) => {
    if (!url) return '';
    return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
};

/**
 * Convert image URL to AVIF format
 * @param {string} url - Original image URL
 * @returns {string} AVIF image URL
 */
export const toAVIF = (url) => {
    if (!url) return '';
    return url.replace(/\.(jpg|jpeg|png)$/i, '.avif');
};

