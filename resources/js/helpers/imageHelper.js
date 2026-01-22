/**
 * Image Helper Functions for Responsive Images
 * Generates srcset and handles modern image formats
 */

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

    // Remove domain for cleaner URLs (assuming same domain)
    const cleanUrl = imageUrl.replace(/^https?:\/\/[^\/]+/, '');

    // Generate WebP version URL (assuming server can serve WebP)
    const webpUrl = cleanUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    return {
        src: imageUrl,
        srcSet: `${webpUrl} 1x, ${webpUrl} 2x`,
        sizes: options.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
        alt: altText,
        loading: options.loading || 'lazy',
        width: options.width || 400,
        height: options.height || 400,
        className: options.className || '',
        // Modern image formats with fallback
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
