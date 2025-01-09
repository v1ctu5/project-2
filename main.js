// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

// Observe all sections
document.querySelectorAll('section').forEach((section) => {
    observer.observe(section);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Add offset for fixed header
            const headerOffset = 60;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
});

// Add loading animation for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.animation = 'fadeInUp 0.8s ease-out';
    });
});

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li a');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close menu when clicking a link
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Add touch events for better mobile interaction
document.querySelectorAll('.category-card, .service-card').forEach(card => {
    card.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    card.addEventListener('touchend', function() {
        this.style.transform = 'translateY(-5px)';
    });
});

// Add pull-to-refresh prevention
document.body.style.overscrollBehavior = 'none'; 

// Add image error handling
document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
        console.error(`Failed to load image: ${img.src}`);
        // Optionally set a fallback image
        this.src = 'images/placeholder.jpg';
    };
}); 

// Enhanced image error handling
document.querySelectorAll('.category-card img').forEach(img => {
    img.addEventListener('error', function() {
        console.error(`Failed to load image: ${this.src}`);
        console.log('Image path attempted:', this.src);
        console.log('Current page URL:', window.location.href);
        
        // Set a colored background as fallback
        this.style.backgroundColor = '#f0f0f0';
        this.style.padding = '2rem';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        
        // Add an icon or text as fallback
        this.insertAdjacentHTML('afterend', '<i class="fas fa-image" style="font-size: 3rem; color: #999;"></i>');
    });
}); 

// Add placeholder image generator
function generatePlaceholder(width, height, text) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
    
    // Text
    ctx.fillStyle = '#666666';
    ctx.font = '16px Poppins';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width/2, height/2);
    
    return canvas.toDataURL();
}

// Update image error handling
document.querySelectorAll('.category-card img').forEach(img => {
    img.addEventListener('error', function() {
        const placeholderText = this.alt || 'Image';
        this.src = generatePlaceholder(300, 200, placeholderText);
    });
}); 

// Add image preloader
function preloadImages() {
    const imageUrls = [
        'images/vegetables.jpg',
        'images/fruits.jpg',
        'images/meat.jpg',
        'images/groceries.jpg',
        'images/bakery.jpg',
        'images/medicine.jpg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
        img.onload = () => console.log(`Preloaded: ${url}`);
        img.onerror = () => console.error(`Failed to preload: ${url}`);
    });
}

// Call preloader when DOM is ready
document.addEventListener('DOMContentLoaded', preloadImages); 

// Add image path debugging tool
const ImageDebugger = {
    init() {
        this.debugImages();
        this.addDebugPanel();
    },

    debugImages() {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => {
                this.logImageError(img);
            });
        });
    },

    logImageError(img) {
        console.group('Image Load Error');
        console.log('Image element:', img);
        console.log('Source:', img.src);
        console.log('Absolute path:', new URL(img.src, window.location.href).href);
        console.log('Alt text:', img.alt);
        console.log('Dimensions:', `${img.width}x${img.height}`);
        console.groupEnd();
        
        // Add visual indicator
        img.classList.add('image-load-error');
        img.style.border = '2px dashed red';
    },

    addDebugPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div id="image-debug-panel" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 9999;
                display: none;
            ">
                <h4>Image Debug Info</h4>
                <div id="debug-content"></div>
            </div>
        `;
        document.body.appendChild(panel);
    }
};

// Initialize debugger
ImageDebugger.init(); 

// Add specific handler for category images
function handleImageError(img) {
    console.error(`Failed to load image: ${img.src}`);
    
    // Try different path variations
    const imageName = img.src.split('/').pop();
    const attempts = [
        `./images/${imageName}`,
        `../images/${imageName}`,
        `/images/${imageName}`,
        `images/${imageName}`
    ];
    
    console.log('Current image path:', img.src);
    console.log('Attempting alternate paths:', attempts);
    
    // Try each path
    const tryNextPath = (paths) => {
        if (paths.length === 0) {
            // If all paths fail, use placeholder
            img.src = generatePlaceholder(300, 200, img.alt);
            return;
        }
        
        const newPath = paths[0];
        console.log('Trying path:', newPath);
        
        const testImg = new Image();
        testImg.onload = () => {
            img.src = newPath;
            console.log('Success with path:', newPath);
        };
        testImg.onerror = () => {
            tryNextPath(paths.slice(1));
        };
        testImg.src = newPath;
    };
    
    tryNextPath(attempts);
} 