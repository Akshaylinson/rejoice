document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      if(this.getAttribute('href') === '#') return;
      
      const target = document.querySelector(this.getAttribute('href'));
      if(target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        mobileMenu.classList.add('hidden');
      }
    });
  });
  
  // Add shadow to navbar on scroll
  window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if(window.scrollY > 50) {
      nav.classList.add('shadow-xl');
    } else {
      nav.classList.remove('shadow-xl');
    }
  });
  
  // Form submission
  const contactForm = document.querySelector('form');
  if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your message! We will get back to you soon.');
      this.reset();
    });
  }
  
  // Trip planner form submission
  const tripPlannerForm = document.getElementById('tripPlannerForm');
  const tripPlannerResult = document.getElementById('tripPlannerResult');
  
  if(tripPlannerForm && tripPlannerResult) {
    tripPlannerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const dest = document.getElementById('planner-destination').value;
      const from = document.getElementById('planner-from').value;
      const to = document.getElementById('planner-to').value;
      const travelers = document.getElementById('planner-travelers').value;
      const type = document.getElementById('planner-type').value;
      
      if(!dest || !from || !to || !travelers || !type) {
        tripPlannerResult.textContent = "Please fill in all fields to plan your trip.";
        tripPlannerResult.classList.remove('hidden', 'bg-green-50', 'text-green-700');
        tripPlannerResult.classList.add('bg-red-50', 'text-red-700', 'border-red-200');
        return;
      }
      
      tripPlannerResult.innerHTML = `<strong class="text-lg">Trip Planned!</strong><br>
        <span class="font-semibold">Destination:</span> ${dest}<br>
        <span class="font-semibold">Dates:</span> ${from} to ${to}<br>
        <span class="font-semibold">Travelers:</span> ${travelers}<br>
        <span class="font-semibold">Type:</span> ${type}<br>
        <span class="block mt-2">Our team will contact you soon with a personalized itinerary.</span>`;
      
      tripPlannerResult.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'border-red-200');
      tripPlannerResult.classList.add('bg-green-50', 'text-green-700', 'border-green-200');
      
      this.reset();
    });
  }
  
  // Blog flip cards
  document.querySelectorAll('.blog-flip-card').forEach(card => {
    card.addEventListener('click', function () {
      this.classList.toggle('flipped');
    });
  });
  
  // Filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const packageCards = document.querySelectorAll('.package-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filter = button.dataset.filter;
      
      // Filter cards
      packageCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
  
  // View More functionality
  const viewMoreBtn = document.getElementById('view-more-btn');
  let showingAll = false;
  const hiddenCards = document.querySelectorAll('.package-card.hidden');
  
  if (viewMoreBtn && hiddenCards.length > 0) {
    viewMoreBtn.addEventListener('click', () => {
      if (showingAll) {
        // Hide additional cards
        hiddenCards.forEach(card => {
          card.classList.add('hidden');
        });
        viewMoreBtn.innerHTML = 'View More Packages <i class="fas fa-chevron-down ml-2 transition-transform duration-300"></i>';
        showingAll = false;
        
        // Scroll to packages section
        document.getElementById('packages').scrollIntoView({ behavior: 'smooth' });
      } else {
        // Show all cards
        hiddenCards.forEach(card => {
          card.classList.remove('hidden');
          card.style.display = 'block';
        });
        viewMoreBtn.innerHTML = 'Show Less <i class="fas fa-chevron-up ml-2 transition-transform duration-300"></i>';
        showingAll = true;
      }
    });
  } else if (viewMoreBtn) {
    viewMoreBtn.style.display = 'none';
  }
  
  // Booking modal functionality with HubSpot integration
  const modal = document.getElementById('booking-modal');
  const bookNowButtons = document.querySelectorAll('.book-now-btn');
  const closeModalBtn = document.getElementById('close-modal');
  
  function showModal(packageName, packageRating, packageDuration) {
    document.getElementById('modal-package-title').textContent = packageName;
    document.getElementById('modal-rating').textContent = packageRating;
    document.getElementById('modal-duration').textContent = packageDuration;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Load HubSpot form if not already loaded
    if (!document.querySelector('#hubspot-form-container iframe')) {
      // Check if HubSpot forms script is loaded
      if (window.hbspt) {
        loadHubSpotForm(packageName);
      } else {
        // If not loaded yet, wait for it
        const checkHubSpot = setInterval(() => {
          if (window.hbspt) {
            clearInterval(checkHubSpot);
            loadHubSpotForm(packageName);
          }
        }, 100);
      }
    } else {
      // Form already exists, just update the package field if needed
      updateHubSpotPackageField(packageName);
    }
  }
  
  function loadHubSpotForm(packageName) {
    window.hbspt.forms.create({
      region: 'na2',
      portalId: '243445389',
      formId: 'a82dcc66-14f2-42b6-9142-174c3f2fe59a',
      target: '#hubspot-form-container',
      onFormReady: function($form) {
        // Set the package name in the form
        updateHubSpotPackageField(packageName);
      }
    });
  }
  
  function updateHubSpotPackageField(packageName) {
    // Try to find the package field and set its value
    const packageInput = document.querySelector('input[name="package"]');
    if (packageInput) {
      packageInput.value = packageName;
    } else {
      // If not found immediately, try again after a short delay
      setTimeout(() => {
        const retryInput = document.querySelector('input[name="package"]');
        if (retryInput) {
          retryInput.value = packageName;
        }
      }, 500);
    }
  }
  
  function hideModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
  
  bookNowButtons.forEach(button => {
    button.addEventListener('click', function() {
      const card = this.closest('.package-card');
      const title = card.querySelector('h3').textContent;
      const rating = card.querySelector('.fa-star + span').textContent;
      const duration = card.querySelector('.fa-clock + span').textContent;
      
      showModal(title, rating, duration);
    });
  });
  
  closeModalBtn.addEventListener('click', hideModal);
  
  // Close modal when clicking outside
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      hideModal();
    }
  });
  
  // Gallery Filter Functionality
  const galleryFilterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      galleryFilterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filter = button.dataset.filter;
      
      // Filter items
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
  
  // Mobile Gallery Scroll Indicator
  const mobileGallery = document.querySelector('.gallery-scroll');
  const dots = document.querySelectorAll('.flex.justify-center.mt-4 span');
  
  if (mobileGallery && dots.length > 0) {
    mobileGallery.addEventListener('scroll', function() {
      const scrollPercentage = this.scrollLeft / (this.scrollWidth - this.clientWidth);
      const activeDot = Math.round(scrollPercentage * (dots.length - 1));
      
      dots.forEach((dot, index) => {
        if (index === activeDot) {
          dot.classList.remove('bg-gray-300');
          dot.classList.add('bg-accent');
        } else {
          dot.classList.remove('bg-accent');
          dot.classList.add('bg-gray-300');
        }
      });
    });
  }
  
  // Testimonials Carousel
  const carousel = document.querySelector('.testimonial-carousel');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  const items = document.querySelectorAll('.carousel-item');
  const dotContainer = document.querySelector('.dot-container');
  let currentIndex = 0;
  let testimonialsPerView = window.innerWidth >= 768 ? 3 : 1;
  const totalItems = items.length;
  
  // Create dots
  const totalDots = Math.ceil(totalItems / testimonialsPerView);
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('div');
    dot.className = 'w-3 h-3 rounded-full bg-white bg-opacity-30 cursor-pointer transition-all';
    dot.addEventListener('click', () => {
      currentIndex = i;
      updateCarousel();
    });
    dotContainer.appendChild(dot);
  }
  const dotsElements = document.querySelectorAll('.dot-container div');
  
  function updateCarousel() {
    const offset = -currentIndex * (100 / testimonialsPerView);
    carousel.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    dotsElements.forEach((dot, index) => {
      dot.classList.toggle('bg-opacity-30', index !== currentIndex);
      dot.classList.toggle('bg-opacity-100', index === currentIndex);
      dot.classList.toggle('w-3', index !== currentIndex);
      dot.classList.toggle('w-6', index === currentIndex);
    });
    
    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= totalDots - 1;
  }
  
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalDots - 1) {
      currentIndex++;
      updateCarousel();
    }
  });
  
  // Handle window resize
  function handleResize() {
    const newPerView = window.innerWidth >= 768 ? 3 : 1;
    if (newPerView !== testimonialsPerView) {
      testimonialsPerView = newPerView;
      
      // Recreate dots for new layout
      dotContainer.innerHTML = '';
      const newTotalDots = Math.ceil(totalItems / testimonialsPerView);
      for (let i = 0; i < newTotalDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'w-3 h-3 rounded-full bg-white bg-opacity-30 cursor-pointer transition-all';
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        dotContainer.appendChild(dot);
      }
      
      currentIndex = 0;
      updateCarousel();
    }
  }
  
  window.addEventListener('resize', handleResize);
  
  // Initialize
  updateCarousel();
  
  // Auto-rotate every 8 seconds
  let autoRotate = setInterval(() => {
    if (currentIndex < totalDots - 1) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  }, 8000);
  
  // Pause on hover
  carousel.addEventListener('mouseenter', () => clearInterval(autoRotate));
  carousel.addEventListener('mouseleave', () => {
    autoRotate = setInterval(() => {
      if (currentIndex < totalDots - 1) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateCarousel();
    }, 8000);
  });
});