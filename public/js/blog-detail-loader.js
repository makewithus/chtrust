import { getBlogBySlug } from './firebase-service.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Extract Slug from URL — strip trailing slashes and .html extension if present
    const rawSlug = window.location.pathname.split('/').filter(Boolean).pop() || '';
    const slug = rawSlug.replace(/\.html$/i, '');

    if (!slug) return;

    // Clear hardcoded template content immediately so static placeholder never shows
    const contentContainer = document.querySelector('.blog-details-content.w-richtext');
    if (contentContainer) {
        contentContainer.innerHTML = '<p style="color:#999; text-align:center; padding:40px 0;">Loading...</p>';
    }
    const titleEl = document.querySelector('h1.section-title');
    if (titleEl) titleEl.innerText = '';

    try {
        const blog = await getBlogBySlug(slug);

        if (!blog) throw new Error('Blog not found');

        // 1. Update Title
        if (titleEl) titleEl.innerText = blog.title;
        document.title = blog.title + ' | Charity Blog';

        // 2. Update Metadata
        const readTimeBlock = document.querySelector('.blog-read-time-block');
        if (readTimeBlock) {
            const dateOpts = { year: 'numeric', month: 'long', day: 'numeric' };
            const dateStr = new Date(blog.createdAt).toLocaleDateString('en-US', dateOpts);
            readTimeBlock.innerHTML = `<p class="blog-info-text">${dateStr}</p>`;
        }

        const authorBlock = document.querySelector('.blog-author-block');
        if (authorBlock) {
            const texts = authorBlock.querySelectorAll('.blog-info-text');
            if (texts.length >= 2) {
                texts[1].innerText = blog.author || 'Admin';
            }
        }

        // 3. Update Image (hero image outside richtext block)
        const mainImg = document.querySelector('.blog-details-content-block img');
        if (mainImg && blog.featuredImage) {
            mainImg.src = blog.featuredImage;
            mainImg.srcset = '';
            mainImg.removeAttribute('style');
        }

        // 4. Build and inject blog content
        if (contentContainer) {
            let finalContent = blog.content || '';

            if (blog.featuredImage) {
                const imgHTML = `<figure style="max-width:1320px" class="w-richtext-align-fullwidth w-richtext-figure-type-image"><div><img src="${blog.featuredImage}" loading="lazy" alt=""></div></figure>`;
                if (blog.subHeading) {
                    const subHeadingHTML = `<h2 style="color:#4A6FA5;margin-top:24px;margin-bottom:16px;font-weight:600;">${blog.subHeading}</h2>`;
                    finalContent = imgHTML + subHeadingHTML + (blog.content || '');
                } else {
                    finalContent = imgHTML + (blog.content || '');
                }
            } else if (blog.subHeading) {
                const subHeadingHTML = `<h2 style="color:#4A6FA5;margin-top:24px;margin-bottom:16px;font-weight:600;">${blog.subHeading}</h2>`;
                finalContent = subHeadingHTML + finalContent;
            }

            contentContainer.innerHTML = finalContent;
        }

    } catch (error) {
        console.error('Error loading blog detail:', error);
        if (contentContainer) {
            contentContainer.innerHTML = '<p style="text-align:center; padding:40px 0; color:#666;">Blog not found or failed to load.</p>';
        }
        if (titleEl) titleEl.innerText = 'Blog Not Found';
    }
});
