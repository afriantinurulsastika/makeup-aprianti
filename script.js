document.addEventListener('DOMContentLoaded', () => {
    // Icons
    lucide.createIcons();

    // Hero Slider
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');

    if (slides.length > 0) {
        // Function to show slide
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                }
            });
        }

        // Auto slide
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);

        // Expose moveSlide to global scope for buttons
        window.moveSlide = function (n) {
            currentSlide = (currentSlide + n + slides.length) % slides.length;
            showSlide(currentSlide);
        };
    }

    // Product Gallery Swipe (Simple version for now, relies on click mostly but setup for future)
    const galleryThumbs = document.querySelectorAll('.thumb');
    const mainImg = document.getElementById('mainImg');

    if (galleryThumbs.length > 0 && mainImg) {
        window.changeImage = function (el) {
            // Replace low res thumb with high res main
            const newSrc = el.src.replace('&w=200', '&w=800');
            mainImg.style.opacity = '0';
            setTimeout(() => {
                mainImg.src = newSrc;
                mainImg.style.opacity = '1';
            }, 200);


            galleryThumbs.forEach(t => t.classList.remove('active'));
            el.classList.add('active');
        }
    }

    // Shop Page Filtering
    const products = document.querySelectorAll('.product-card[data-category]');
    if (products.length > 0) {
        const categoryFilters = document.querySelectorAll('.filter-list li');
        const priceInput = document.querySelector('input[type=range]');
        const colorFilters = document.querySelectorAll('.color-swatch');

        let activeCategory = 'Semua';
        let maxPrice = 500000;
        let activeColor = 'all';

        function filterProducts() {
            products.forEach(card => {
                const cat = card.getAttribute('data-category');
                const price = parseInt(card.getAttribute('data-price'));
                const color = card.getAttribute('data-color');

                let show = true;

                // Category Filter
                if (activeCategory !== 'Semua' && cat !== activeCategory && activeCategory !== 'all') {
                    show = false;
                }

                // Price Filter
                if (price > maxPrice) {
                    show = false;
                }

                // Color Filter
                if (activeColor !== 'all' && color !== activeColor) {
                    // Start 'all' check logic modification for color matching if needed
                    // Simple exact match for now
                    if (color !== activeColor) {
                        // Allow specific colors or defaults
                        show = false;
                    }
                }

                card.style.display = show ? 'block' : 'none';
            });
        }

        // Event Listeners
        categoryFilters.forEach(item => {
            item.addEventListener('click', () => {
                // Parse text content carefully: "Lipstick (8)" -> "lips"? 
                // Currently HTML just says "Lipstick", data-category says "lips". 
                // We need to map or just use text if we aligned them. 
                // Let's assume text mapping for this demo or update HTML to have attributes
                const text = item.querySelector('span').innerText.toLowerCase();
                if (text.includes('semua')) activeCategory = 'Semua';
                else if (text.includes('lipstick')) activeCategory = 'lips';
                else if (text.includes('eyeshadow')) activeCategory = 'eyes';
                else if (text.includes('blush')) activeCategory = 'cheeks';
                else if (text.includes('foundation')) activeCategory = 'face';
                else activeCategory = 'all';

                filterProducts();

                // Active style
                categoryFilters.forEach(i => i.style.color = 'var(--color-text-light)');
                item.style.color = 'var(--color-primary-dark)';
            });
        });

        if (priceInput) {
            priceInput.addEventListener('input', (e) => {
                maxPrice = parseInt(e.target.value);
                // Update display if exists
                filterProducts();
            });
        }

        colorFilters.forEach(swatch => {
            swatch.addEventListener('click', () => {
                colorFilters.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');

                // Get color from attribute
                const color = swatch.getAttribute('data-color');
                activeColor = color || 'all'; // Default to all if null

                // If the first swatch (Pink/Reset) is clicked, maybe we want to reset? 
                // For now, let's assume specific filtering. 
                // If "all" is needed, we'd need an "all" swatch or logic.
                // Current swatches are specific colors.
                // Let's assume the first one is just "pink" based on HTML update.

                filterProducts();
            });
        });
    }
});
