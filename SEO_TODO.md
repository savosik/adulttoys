# SEO-First Implementation TODO List

This document provides a comprehensive roadmap for transforming the e-commerce platform into an SEO-first website, optimized for Google and Yandex.

## 1. Technical Foundation & URLs
- [x] **Implement Slugs for Products & Categories**
    - [x] Add `slug` column to `products` and `categories` tables.
    - [x] Update models to use `getRouteKeyName()` and automatically generate slugs from names.
    - [x] Migrate existing data to have unique slugs.
    - [x] Update routes in `web.php` to use `{product:slug}` and `{category:slug}`.
    - [x] **SEO Path Upgrade**: Moved categories from `?category=id` to `/category/slug`.
- [ ] **Canonical Tags**
    - Add logic to `app.blade.php` or a shared Inertia prop to include `<link rel="canonical" href="...">` for every page to prevent duplicate content issues.
- [ ] **SSL & HTTPS Redirection**
    - Ensure all traffic is forced to HTTPS (standard but critical).
- [ ] **WWW vs Non-WWW**
    - Decide on a preferred domain and set up 301 redirects.

## 2. On-Page SEO & Metadata
- [x] **Dynamic Meta Tags System**
    - [x] Add `meta_title` and `meta_description` fields to `Product`, `Category`, and `Faq` models.
    - [x] Create a helper or service to generate default meta tags if specific ones are missing.
- [x] **OpenGraph & Twitter Cards**
    - [x] Implement OG tags (title, description, image, url) in `app.blade.php`.
    - [x] Ensure product images are used as OG images on product detail pages.
- [ ] **Semantic HTML Audit**
    - Ensure only one `<h1>` per page (Product Title on detail page, Category Name on catalog).
    - Use `<header>`, `<footer>`, `<nav>`, and `<main>` consistently.
    - Check heading hierarchy (H1 -> H2 -> H3).
- [ ] **Image Optimization**
    - Add `alt` text attribute to `ProductImage` model and UI.
    - Implement responsive images using `srcset` or modern formats (WebP/AVIF).
    - Ensure images are lazy-loaded except for the LCP element.

## 3. Structured Data (Schema.org)
- [x] **Product Schema**
    - [x] Add JSON-LD to `ProductDetail.jsx` including: name, image, description, SKU, brand, and `offers` (price, currency, availability).
- [x] **Review & Rating Schema**
    - [x] Include `aggregateRating` and individual `review` snippets in the Product schema.
- [x] **BreadcrumbList Schema**
    - [x] Implement breadcrumbs UI and corresponding JSON-LD to help search engines understand site hierarchy.
- [x] **Organization & Local Business Schema**
    - [x] Add site-wide JSON-LD for the company info, especially important for Yandex commercial factors.

## 4. Content & Interlinking
- [x] **Sitemap Generation**
    - [x] Create a dynamic `sitemap.xml` including all products and categories.
- [x] **Robots.txt**
    - [x] Create a `public/robots.txt` file with proper directives and a link to the sitemap.
- [x] **Internal Linking Strategy**
    - [x] Add "Related Products" section on product pages.
    - [x] Ensure breadcrumbs are clickable and follow a logical path.
    - [ ] Link to categories from the home page (Sidebar already exists).
- [x] **FAQ Content**
    - [x] Enhance the `About` page with a robust FAQ section (Added Delivery and Payment logic).

## 5. E-commerce Specifics (Yandex Focus)
- [x] **Commercial Factors**
    - [x] Ensure physical address, phone number, and working hours are in the footer.
    - [x] Clear "Delivery" and "Payment" information pages/sections.
- [x] **Assortment Signals**
    - [x] Ensure category pages show a good number of products and have pagination (handled by `CatalogController`).
- [x] **Social Media Links**
    - [x] Add links to verified social media profiles in the footer.

## 6. Performance & Core Web Vitals
- [x] **Optimize LCP (Largest Contentful Paint)**
    - [x] Preload the main product image on detail pages.
    - [x] Minimize render-blocking CSS/JS with Vite build optimizations.
- [x] **Lazy Loading & Image Optimization**
    - [x] Implemented lazy loading for all images except LCP element (first product image).
    - [x] Added explicit width/height attributes to images to reduce CLS.
    - [x] Set fetchpriority="high" for above-the-fold images.
- [x] **Code Splitting & Minification**
    - [x] Configured Vite with terser minification (removes console.logs in production).
    - [x] Implemented manual chunk splitting for vendor libraries (React, Inertia, Swiper).
    - [x] Enabled CSS code splitting for better caching.
- [ ] **Improve FID/INP**
    - Audit heavy React components.
    - Ensure event listeners are efficient.
- [ ] **Reduce CLS (Cumulative Layout Shift)**
    - Set explicit width/height for images and icons.
    - Reserve space for dynamic content (like reviews).

## 7. Analytics & Monitoring
- [ ] **Google Search Console & Yandex Webmaster**
    - Verify site ownership.
    - Submit sitemap.
- [ ] **SEO Monitoring**
    - Implement a tool or script to check for 404 errors and broken links.
- [ ] **Performance Tracking**
    - Set up Lighthouse CI or similar to track performance metrics over time.

## 8. SEO "Tricks" & Advanced Tactics (The "Cheatsheet")
- [ ] **CTR Hijacking with "Power Words"**
    - Use numbers, brackets, and high-conversion words in Meta Titles (e.g., "Best {Product} [2026 Price] - Buy Now").
    - Add Emoji to Meta Descriptions (check Yandex/Google support per region) to stand out in SERP.
- [ ] **Internal PageRank Sculpting**
    - Identify "Money Pages" (high-margin products) and link to them aggressively from the Footer and Home Page.
    - Use descriptive anchor text instead of "Read more".
- [ ] **"Phantom" Category Pages**
    - Create dynamic landing pages for specific search queries that aren't in your main menu (e.g., "Smartphones under 500 BYN", "Red Electronics").
- [ ] **Review Keyword Injection**
    - Prompt users to include specific product attributes in their reviews (e.g., "How does the *battery life* of this *laptop* feel?").
- [ ] **Snippet "Stealing" with Microdata**
    - Implement `FAQPage` schema on product pages to occupy more vertical space in search results.
    - Add `PriceRange` to local schema to attract price-sensitive users.
- [ ] **Zero-Volume Keyword Targeting**
    - Research ultra-long-tail queries that SEO tools often miss but users actually type.
- [ ] **Competitor "Broken Link" Building**
    - Find broken links on competitor sites and reach out to the source to suggest your relevant product instead.
- [ ] **Behavioral Signal Boosting (Yandex)**
    - Implement "Add to Compare" or "Save for Later" features to increase "Time on Site" and "Depth of Visit".
    - Use a "Sticky" cart or "Quick View" to reduce bounce rate on mobile.
- [ ] **Image Search Domination**
    - Use descriptive filenames for images (e.g., `iphone-15-pro-max-black.webp` instead of `IMG_123.jpg`).
    - Add images to the XML Sitemap.
