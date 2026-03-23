import { getAllBlogs } from './firebase-service.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Selectors for the 3 distinct layout areas in blog.html
    const featuredList = document.querySelectorAll('.blog-collection-list.is-1.w-dyn-items')[0]; // Featured (large)
    const secondaryList = document.querySelectorAll('.blog-collection-list.is-1.w-dyn-items')[1]; // Secondary featured
    const gridList = document.querySelector('.blog-collection-list.w-dyn-items:not(.is-1)');      // Main grid

    if (!featuredList && !gridList) return;

    // Define HTML templates since the DOM containers start empty
    const featuredTemplate = `
        <div role="listitem" class="blog-collection-item w-dyn-item">
            <div class="blog-item-block is-1">
                <div class="blog-item-thumbnail-block is-1">
                    <img src="" loading="lazy" alt="Blog Item Thumbnail" class="blog-item-thumbnail is-1" style="opacity: 1; transform: none; filter: none;">
                    <a aria-label="blog link" href="#" class="blog-image-overlay w-inline-block"></a>
                    <div class="blog-item-content-block is-1">
                        <div class="blog-item-info-block">
                            <div class="blog-item-category-text">Category</div>
                            <div class="blog-item-info-dot is-1"></div>
                            <div class="blog-item-date-text is-1">Date</div>
                        </div>
                        <a aria-label="Blog Item Title" href="#" class="blog-item-title-block is-1 w-inline-block">
                            <h2 class="blog-item-title is-1">Title</h2>
                        </a>
                        <a href="#" class="blog-link-button w-inline-block">
                            <div class="blog-link-button-text">Read More</div>
                            <div class="blog-link-button-icon w-embed">
                                <svg width="17" height="12" viewbox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.9956 0.984375L15.9197 6.02148L10.9442 10.9842" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1.06338 5.94024L15.0631 6.027" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>`;

    const secondaryTemplate = `
        <div role="listitem" class="blog-collection-item is-2 w-dyn-item">
            <div class="blog-item-block is-2">
                <div class="blog-item-thumbnail-block is-2">
                    <img src="" loading="lazy" alt="Blog Item Thumbnail" class="blog-item-thumbnail is-2" style="opacity: 1; transform: none; filter: none;">
                    <a aria-label="blog link" href="#" class="blog-image-overlay w-inline-block"></a>
                </div>
                <div class="blog-item-content-block is-2">
                    <div class="blog-item-info-block is-2">
                        <div class="blog-item-category-text">Category</div>
                        <div class="blog-item-info-dot is-2"></div>
                        <div class="blog-item-date-text">Date</div>
                    </div>
                    <a aria-label="Blog Item Title" href="#" class="blog-item-title-block is-2 w-inline-block">
                        <h2 class="blog-item-title is-2">Title</h2>
                    </a>
                </div>
            </div>
        </div>`;

    const gridTemplate = `
        <div role="listitem" class="blog-collection-item w-dyn-item">
            <div class="blog-item-block">
                <div class="blog-item-thumbnail-block">
                    <img src="" loading="lazy" alt="Blog Item Thumbnail" class="blog-item-thumbnail" style="opacity: 1; transform: none; filter: none;">
                    <a aria-label="blog link" href="#" class="blog-image-overlay w-inline-block"></a>
                </div>
                <div class="blog-item-content-block">
                    <div class="blog-item-info-block">
                        <div class="blog-item-category-text">Category</div>
                        <div class="blog-item-info-dot"></div>
                        <div class="blog-item-date-text">Date</div>
                    </div>
                    <a aria-label="Blog Item Title" href="#" class="blog-item-title-block w-inline-block">
                        <h2 class="blog-item-title">Title</h2>
                    </a>
                </div>
            </div>
        </div>`;

    if (featuredList) featuredList.innerHTML = '';
    if (secondaryList) secondaryList.innerHTML = '';
    if (gridList) gridList.innerHTML = '';

    const createBlogItem = (template, blog) => {
        const div = document.createElement('div');
        div.innerHTML = template;
        const newItem = div.firstElementChild;

        // Title
        const titleEl = newItem.querySelector('h1, h2, h3, .blog-item-title');
        if (titleEl) titleEl.innerText = blog.title;

        // Links
        const links = newItem.querySelectorAll('a');
        links.forEach(link => {
            if (!link.classList.contains('blog-link-button') && link.getAttribute('href') !== undefined) {
                link.href = `/blog-post/${blog.slug}`;
            } else {
                link.href = `/blog-post/${blog.slug}`;
            }
        });

        // Image
        const imgEl = newItem.querySelector('img');
        if (imgEl && blog.featuredImage) {
            imgEl.src = blog.featuredImage;
            imgEl.srcset = '';
            imgEl.removeAttribute('style');
            imgEl.style.opacity = '1';
            imgEl.style.filter = 'none';
        }

        // Date
        const dateEl = newItem.querySelector('.blog-item-date-text');
        if (dateEl && blog.createdAt) {
            try {
                const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });
                dateEl.innerText = date;
            } catch (e) {
                dateEl.innerText = '';
            }
        }

        // Category
        const catEl = newItem.querySelector('.blog-item-category-text');
        if (catEl) catEl.innerText = blog.category || 'Blog';

        newItem.style.display = 'block';
        return newItem;
    };

    // Show "no blogs" empty state across all containers
    const showEmptyState = () => {
        const emptyHtml = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
                color: #6b7280;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            ">
                <h3 style="font-size: 22px; font-weight: 600; margin-bottom: 8px; color: #374151;">No Blogs Available Yet</h3>
                <p style="font-size: 16px; color: #9ca3af;">Check back soon — our team is working on new articles.</p>
            </div>`;

        if (featuredList) {
            const wrapper = featuredList.closest('.blog-collection-list-block, .w-dyn-list') || featuredList;
            wrapper.innerHTML = emptyHtml;
            // Ensure wrapper spans full width if it's a grid item
            if (wrapper.style) wrapper.style.gridColumn = "1 / -1";
        }
        if (secondaryList) secondaryList.innerHTML = '';
        if (gridList) gridList.innerHTML = '';
    };

    try {
        // Fetch blogs from Firebase Firestore (matches Admin Panel)
        const allBlogs = await getAllBlogs();

        // Only show published blogs
        const blogs = allBlogs.filter(b => b.status === 'published');

        if (blogs.length === 0) {
            showEmptyState();
            return;
        }

        // Distribute blogs across the three layout zones
        // Blog 0 → Featured (large hero card)
        if (blogs[0] && featuredList && featuredTemplate) {
            featuredList.appendChild(createBlogItem(featuredTemplate, blogs[0]));
        }

        // Blog 1 → Secondary featured (side card)
        if (blogs[1] && secondaryList && secondaryTemplate) {
            secondaryList.appendChild(createBlogItem(secondaryTemplate, blogs[1]));
        }

        // Blog 2+ → Main grid
        const gridBlogs = secondaryList ? blogs.slice(2) : blogs.slice(1);
        if (gridList && gridTemplate) {
            gridBlogs.forEach(blog => {
                gridList.appendChild(createBlogItem(gridTemplate, blog));
            });
        }

    } catch (error) {
        console.error('Error loading blogs from Firebase:', error);
        showEmptyState();
    }
});
