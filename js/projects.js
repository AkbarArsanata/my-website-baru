import { projects, techIcons } from './projectsData.js';

// Configuration
const INITIAL_COUNT = 3;
const LOAD_MORE_COUNT = 3;
const IMAGE_LOAD_DELAY = 150;
const SCROLL_REVEAL_DELAY = 100;
let currentFilter = 'all';
let shownCount = INITIAL_COUNT;
let currentProjectIndex = 0;
let filteredProjects = [];
let isAnimating = false;
let retryCount = 0;

// DOM Elements
const DOM = {
  projectsGrid: document.getElementById('projects-grid'),
  filterBtns: document.querySelectorAll('.filter-btn'),
  loadMoreBtn: document.getElementById('loadMore'),
  projectModal: document.getElementById('projectModal'),
  modalBody: document.querySelector('.modal-body'),
  closeModalBtn: document.querySelector('.close-modal'),
  prevBtn: document.querySelector('.modal-nav-btn.prev'),
  nextBtn: document.querySelector('.modal-nav-btn.next'),
  noResults: document.getElementById('noResults'),
  loadingAnimation: document.getElementById('loadingAnimation'),
  scrollToTop: document.getElementById('scrollToTop'),
  showLessBtn: document.getElementById('showLess')
};

function logDOMStatus() {
  console.log('[DEBUG] DOM Status:', {
    projectsGrid: !!DOM.projectsGrid,
    filterBtns: DOM.filterBtns.length,
    loadMoreBtn: !!DOM.loadMoreBtn,
    projectModal: !!DOM.projectModal,
    modalBody: !!DOM.modalBody,
    closeModalBtn: !!DOM.closeModalBtn,
    prevBtn: !!DOM.prevBtn,
    nextBtn: !!DOM.nextBtn,
    noResults: !!DOM.noResults,
    loadingAnimation: !!DOM.loadingAnimation,
    scrollToTop: !!DOM.scrollToTop,
    showLessBtn: !!DOM.showLessBtn
  });
}

// Initialize
export function initProjects() {
  // Re-initialize DOM elements in case they were loaded dynamically
  DOM.projectsGrid = document.getElementById('projects-grid');
  DOM.filterBtns = document.querySelectorAll('.filter-btn');
  DOM.loadMoreBtn = document.getElementById('loadMore');
  DOM.projectModal = document.getElementById('projectModal');
  DOM.modalBody = document.querySelector('.modal-body');
  DOM.closeModalBtn = document.querySelector('.close-modal');
  DOM.prevBtn = document.querySelector('.modal-nav-btn.prev');
  DOM.nextBtn = document.querySelector('.modal-nav-btn.next');
  DOM.noResults = document.getElementById('noResults');
  DOM.loadingAnimation = document.getElementById('loadingAnimation');
  DOM.scrollToTop = document.getElementById('scrollToTop');
  DOM.showLessBtn = document.getElementById('showLess');

  logDOMStatus();

  // Check if essential elements exist
  if (!DOM.projectsGrid || DOM.filterBtns.length === 0) {
    retryCount++;
    console.warn(`[DEBUG] Essential DOM elements not found, retrying... (${retryCount})`);
    if (retryCount < 10) {
      setTimeout(initProjects, 200);
    } else {
      console.error('[DEBUG] Failed to initialize projects after multiple retries.');
    }
    return;
  }

  retryCount = 0;
  console.log('[DEBUG] Initializing projects...');

  // Initial setup
  setupEventListeners();
  // setupIntersectionObserver(); // Jika ada, aktifkan kembali
  renderProjects();
  updateFilterCounts();

  // Show loading animation initially
  showLoadingAnimation(true);
  setTimeout(() => showLoadingAnimation(false), 1500);

  // setupParallaxShapes(); // Jika ada, aktifkan kembali
  // setupCard3DTilt(); // Jika ada, aktifkan kembali
}

// Utility functions
function validateDOM(elements) {
  return Object.values(elements).every(el => el !== null);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function showLoadingAnimation(show) {
  if (!DOM.loadingAnimation || !DOM.projectsGrid) return;

  if (show) {
    DOM.loadingAnimation.style.display = 'flex';
    DOM.projectsGrid.style.opacity = '0';
  } else {
    DOM.loadingAnimation.style.display = 'none';
    DOM.projectsGrid.style.opacity = '1';
  }
}

// Tech icons mapping
const categoryLabels = {
  "end-to-end": "End-to-End Solutions",
  "data-ai-labs": "Data & AI Labs",
  "ui-showcase": "UI Showcase",
  "mobile-hybrid": "Mobile & Hybrid Apps"
};

// Core functions
function getFilteredProjects() {
  const filtered = projects.filter(project => {
    const matchesFilter = currentFilter === 'all' || project.category === currentFilter;
    return matchesFilter;
  });
  console.log(`[DEBUG] Filtered projects for filter "${currentFilter}":`, filtered);
  return filtered;
}

function updateFilterCounts() {
  DOM.filterBtns.forEach(btn => {
    const filter = btn.dataset.filter;
    const count = filter === 'all'
      ? projects.length
      : projects.filter(p => p.category === filter).length;

    const counter = btn.querySelector('.filter-counter');
    if (counter) {
      counter.textContent = `(${count})`;
    }
  });
}

function loadImagesSequentially(elements) {
  elements.forEach((img, index) => {
    setTimeout(() => {
      const src = img.dataset.src;
      if (src) {
        img.src = src;
        img.onload = () => {
          img.classList.add('loaded');
          if (img.parentElement) {
            img.parentElement.style.background = 'none';
          }
        };
        img.removeAttribute('data-src');
      }
    }, IMAGE_LOAD_DELAY * index);
  });
}

function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = `project-card ${project.featured ? 'featured' : ''}`;
  card.dataset.id = project.id;
  card.dataset.category = project.category;

  card.innerHTML = `
    <div class="project-media">
      <div class="image-placeholder" style="background: linear-gradient(135deg, #0ea5e9, #38bdf8);"></div>
      <img data-src="${project.image}" alt="${project.title}" loading="lazy" class="project-image">
      ${project.featured ? `<span class="project-badge">Featured</span>` : ''}
      <div class="project-overlay">
        <div class="view-project">
        </div>
      </div>
      <div class="project-shine"></div>
    </div>
    <div class="project-info">
      <h3>${project.title}</h3>
      <span class="project-team-badge" title="Team Size">
        <i class="fas fa-users"></i>
        <span class="team-label">Team</span>
        <span class="team-value">${project.teamSize || "1 person"}</span>
      </span>
      <p class="project-description">${project.description}</p>
      <div class="project-meta">
        <span class="project-language-badge" title="Project language: ${project.language}">
          ${project.language === 'English'
      ? `<span class="lang-flag" aria-label="English"><img src="https://cdn.jsdelivr.net/gh/hjnilsson/country-flags/svg/gb.svg" alt="English" /></span>`
      : `<span class="lang-flag" aria-label="Indonesia"><img src="https://cdn.jsdelivr.net/gh/hjnilsson/country-flags/svg/id.svg" alt="Indonesia" /></span>`
    }
          <span class="lang-label">Available in</span>
          <span class="lang-value">${project.language}</span>
        </span>
      </div>
      <div class="project-tags">
        ${project.tags.map(tag => `
          <span class="project-tag" title="${tag}">
            <i class="${techIcons[tag] || 'fas fa-code'}"></i>
            <span class="tag-text">${tag}</span>
          </span>
        `).join('')}
      </div>
      <div class="project-links">
        <a href="${project.demo}" class="project-btn demo" target="_blank" rel="noopener">
          <i class="fas fa-external-link-alt"></i> View Project
        </a>
      </div>
    </div>
  `;

  card.addEventListener('click', (e) => {
    if (!e.target.closest('.project-btn')) {
      console.log('[DEBUG] Card clicked for project:', project.id);
      openProjectModal(project);
    }
  });

  return card;
}

function renderProjects() {
  filteredProjects = getFilteredProjects();

  if (!DOM.noResults || !DOM.projectsGrid || !DOM.loadMoreBtn) {
    console.error('[DEBUG] renderProjects: Essential DOM elements missing');
    logDOMStatus();
    return;
  }

  if (filteredProjects.length === 0) {
    DOM.noResults.style.display = 'flex';
    DOM.projectsGrid.innerHTML = '';
    DOM.loadMoreBtn.style.display = 'none';
    if (DOM.showLessBtn) DOM.showLessBtn.style.display = 'none';
    console.log('[DEBUG] No projects found for current filter');
    return;
  } else {
    DOM.noResults.style.display = 'none';
  }

  const projectsToShow = filteredProjects.slice(0, shownCount);
  console.log(`[DEBUG] Rendering ${projectsToShow.length} projects (shownCount=${shownCount})`);
  DOM.projectsGrid.innerHTML = '';

  const fragment = document.createDocumentFragment();
  projectsToShow.forEach((project, index) => {
    const card = createProjectCard(project);
    card.style.animationDelay = `${index * SCROLL_REVEAL_DELAY}ms`;
    fragment.appendChild(card);
  });

  DOM.projectsGrid.appendChild(fragment);
  loadImagesSequentially(DOM.projectsGrid.querySelectorAll('.project-image[data-src]'));
  updateLoadMoreButton(filteredProjects.length);

  // Animate cards in
  animateCards();
}

function animateCards() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }, 10);
  });
}

function updateLoadMoreButton(totalProjects) {
  if (!DOM.loadMoreBtn || !DOM.showLessBtn) return;

  if (totalProjects > shownCount) {
    DOM.loadMoreBtn.style.display = 'flex';
    DOM.showLessBtn.style.display = shownCount > INITIAL_COUNT ? 'inline-flex' : 'none';
  } else {
    DOM.loadMoreBtn.style.display = 'none';
    DOM.showLessBtn.style.display = shownCount > INITIAL_COUNT ? 'inline-flex' : 'none';
  }
}

function openProjectModal(project) {
  if (isAnimating || !DOM.projectModal || !DOM.modalBody) return;

  isAnimating = true;
  currentProjectIndex = filteredProjects.findIndex(p => p.id === project.id);

  // Tambahkan tab navigation
  DOM.modalBody.innerHTML = `
    <div class="modal-header">
      <h2>${project.title}</h2>
      <div class="modal-meta">
        <span><i class="far fa-calendar-alt"></i> ${formatDate(project.date)}</span>
        <span><i class="fas fa-layer-group"></i> ${categoryLabels[project.category] || project.category.replace('-', ' ')}</span>
      </div>
    </div>
    <div class="modal-tabs">
      <button class="modal-tab-btn active" data-tab="overview">Overview</button>
      <button class="modal-tab-btn" data-tab="features">Key Features</button>
      <button class="modal-tab-btn" data-tab="tech">Technologies</button>
    </div>
    <div class="modal-content-inner">
      <div class="modal-image-container">
        <img src="${project.image}" alt="${project.title}" class="modal-image">
        <div class="image-zoom">
          <i class="fas fa-search-plus"></i>
        </div>
      </div>
      <div class="modal-details">
        <div class="modal-tab-content" data-tab-content="overview">
          <h3>Project Overview</h3>
          <p class="modal-description">${project.longDescription}</p>
        </div>
        <div class="modal-tab-content" data-tab-content="features" style="display:none;">
          <h3 style="color:#ff1744;">&#128293; Key Features</h3>
          <ul>
            ${project.features ? project.features.map(feature => `
              <li>
                <i class="fas fa-check-circle"></i>
                <span>${feature}</span>
              </li>
            `).join('') : ''}
          </ul>
        </div>
        <div class="modal-tab-content" data-tab-content="tech" style="display:none;">
          <h3>Technologies Used</h3>
          <div class="modal-tags">
            ${project.tags.map(tag => `
              <span class="modal-tag" title="${tag}">
                <i class="${techIcons[tag] || 'fas fa-code'}"></i>
                <span>${tag}</span>
              </span>
            `).join('')}
          </div>
        </div>
        <div class="modal-actions">
          <a href="${project.demo}" class="modal-btn demo" target="_blank" rel="noopener">
            <i class="fas fa-external-link-alt"></i> Launch Demo
          </a>
          ${project.code ? `
            <a href="${project.code}" class="modal-btn code" target="_blank" rel="noopener">
              <i class="fab fa-github"></i> View Code
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  // Carousel support
  let images = project.images || [project.image];
  let currentImg = 0;

  function renderCarousel() {
    const imgContainer = DOM.modalBody.querySelector('.modal-image-container');
    if (!imgContainer) return;

    imgContainer.innerHTML = `
      <div class="modal-image-carousel">
        <img src="${images[currentImg]}" alt="${project.title}" class="modal-image">
        <div class="carousel-controls">
          <button class="carousel-prev" ${currentImg === 0 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>
          <span class="carousel-indicator">${currentImg + 1}/${images.length}</span>
          <button class="carousel-next" ${currentImg === images.length - 1 ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
    `;

    // Carousel events
    const prevBtn = imgContainer.querySelector('.carousel-prev');
    const nextBtn = imgContainer.querySelector('.carousel-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentImg > 0) {
          currentImg--;
          renderCarousel();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentImg < images.length - 1) {
          currentImg++;
          renderCarousel();
        }
      });
    }
  }

  setTimeout(() => {
    if (images.length > 1) renderCarousel();
  }, 50);

  // Add zoom functionality to modal image
  const modalImage = DOM.modalBody.querySelector('.modal-image');
  const zoomIcon = DOM.modalBody.querySelector('.image-zoom');

  if (zoomIcon && modalImage) {
    zoomIcon.addEventListener('click', () => {
      modalImage.classList.toggle('zoomed');
      zoomIcon.innerHTML = modalImage.classList.contains('zoomed')
        ? '<i class="fas fa-search-minus"></i>'
        : '<i class="fas fa-search-plus"></i>';
    });
  }

  DOM.projectModal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Tambahan: scroll ke atas agar modal selalu di tengah viewport
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-initialize modal buttons after content is loaded
  DOM.closeModalBtn = document.querySelector('.close-modal');
  DOM.prevBtn = document.querySelector('.modal-nav-btn.prev');
  DOM.nextBtn = document.querySelector('.modal-nav-btn.next');

  // Debug: log modal buttons
  console.log('[DEBUG] Modal buttons after modal open:', {
    closeModalBtn: !!DOM.closeModalBtn,
    prevBtn: !!DOM.prevBtn,
    nextBtn: !!DOM.nextBtn
  });

  // Pasang ulang event listener
  if (DOM.closeModalBtn) {
    DOM.closeModalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('[DEBUG] Close modal button clicked');
      closeProjectModal();
    });
  }
  if (DOM.prevBtn) {
    DOM.prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('[DEBUG] Modal prev button clicked');
      navigateProjects('prev');
    });
  }
  if (DOM.nextBtn) {
    DOM.nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('[DEBUG] Modal next button clicked');
      navigateProjects('next');
    });
  }

  // Tab switching logic
  const tabBtns = DOM.modalBody.querySelectorAll('.modal-tab-btn');
  const tabContents = DOM.modalBody.querySelectorAll('.modal-tab-content');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const tab = this.dataset.tab;
      tabContents.forEach(content => {
        content.style.display = content.dataset.tabContent === tab ? 'block' : 'none';
      });
    });
  });

  setTimeout(() => {
    isAnimating = false;
  }, 300);
}

function navigateProjects(direction) {
  if (isAnimating || filteredProjects.length === 0) return;

  const newIndex = direction === 'next'
    ? (currentProjectIndex + 1) % filteredProjects.length
    : (currentProjectIndex - 1 + filteredProjects.length) % filteredProjects.length;

  currentProjectIndex = newIndex;
  console.log(`[DEBUG] Navigating modal to project index: ${newIndex}`);
  openProjectModal(filteredProjects[newIndex]);
}

function closeProjectModal() {
  if (isAnimating || !DOM.projectModal) return;
  isAnimating = true;

  DOM.projectModal.classList.remove('active');
  document.body.style.overflow = '';

  setTimeout(() => {
    isAnimating = false;
  }, 300);
}

// Event Listeners
function setupEventListeners() {
  // Re-initialize DOM elements
  DOM.loadMoreBtn = document.getElementById('loadMore');
  DOM.showLessBtn = document.getElementById('showLess');
  DOM.closeModalBtn = document.querySelector('.close-modal');
  DOM.prevBtn = document.querySelector('.modal-nav-btn.prev');
  DOM.nextBtn = document.querySelector('.modal-nav-btn.next');

  // Debug
  console.log('[DEBUG] Setting up event listeners');

  // Filter buttons
  DOM.filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      DOM.filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.filter;
      shownCount = INITIAL_COUNT;
      console.log('[DEBUG] Filter button clicked:', currentFilter);
      renderProjects();
    });
  });

  // Load more button
  if (DOM.loadMoreBtn) {
    DOM.loadMoreBtn.addEventListener('click', () => {
      shownCount += LOAD_MORE_COUNT;
      console.log('[DEBUG] Load more clicked, shownCount:', shownCount);
      renderProjects();
      DOM.showLessBtn.style.display = 'inline-flex';

      setTimeout(() => {
        const newCards = document.querySelectorAll('.project-card');
        if (newCards.length > 0) {
          newCards[newCards.length - 1].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }
      }, 100);
    });
  }

  // Show Less button
  if (DOM.showLessBtn) {
    DOM.showLessBtn.addEventListener('click', () => {
      // showConfettiLess(); // Jika ada, aktifkan kembali
      console.log('[DEBUG] Show less clicked');
      // animateHideProjects(() => { // Jika ada, aktifkan kembali
      shownCount = INITIAL_COUNT;
      renderProjects();
      setTimeout(() => {
        DOM.projectsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      // });
    });
  }

  // Modal navigation
  if (DOM.prevBtn) {
    DOM.prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('[DEBUG] Modal prev button clicked');
      navigateProjects('prev');
    });
  }

  if (DOM.nextBtn) {
    DOM.nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('[DEBUG] Modal next button clicked');
      navigateProjects('next');
    });
  }

  // Close modal
  if (DOM.closeModalBtn) {
    DOM.closeModalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('[DEBUG] Close modal button clicked');
      closeProjectModal();
    });
  }

  if (DOM.projectModal) {
    DOM.projectModal.addEventListener('click', (e) => {
      if (e.target === DOM.projectModal) {
        console.log('[DEBUG] Modal overlay clicked');
        closeProjectModal();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (DOM.projectModal && DOM.projectModal.classList.contains('active')) {
      if (e.key === 'Escape') {
        console.log('[DEBUG] Escape key pressed');
        closeProjectModal();
      }
      if (e.key === 'ArrowLeft') {
        console.log('[DEBUG] ArrowLeft key pressed');
        navigateProjects('prev');
      }
      if (e.key === 'ArrowRight') {
        console.log('[DEBUG] ArrowRight key pressed');
        navigateProjects('next');
      }
    }
  });

  // Scroll to top button
  if (DOM.scrollToTop) {
    DOM.scrollToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        DOM.scrollToTop.style.opacity = '1';
        DOM.scrollToTop.style.visibility = 'visible';
      } else {
        DOM.scrollToTop.style.opacity = '0';
        DOM.scrollToTop.style.visibility = 'hidden';
      }
    });
  }
}

// Initialize on window load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(initProjects, 300);
  });
  window.initProjects = initProjects;
}