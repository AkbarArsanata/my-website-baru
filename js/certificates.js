// js/certificates.js
import { certificatesData } from './certificatesData.js';

// =============================================
// GLOBAL VARIABLES AND CONFIGURATION
// =============================================
let pdfjsLib = null;
let currentCategory = "all";
let showAll = false;
let isMobile = window.innerWidth <= 768;
const baseUrl = window.location.origin;

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Load external script dynamically
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}

/**
 * Helper function to convert category IDs to display labels
 */
function categoryToLabel(category) {
    const categoryLabels = {
        "machine-learning-ai": "AI/ML",
        "data": "Data",
        "devops": "DevOps", // PERUBAHAN DI SINI: Sesuaikan label jika perlu, tapi key tetap lowercase
        "software-development": "Software Development", // PERUBAHAN DI SINI
        "competition": "Competition", // Tambahkan jika ada tab 'competition' di HTML
        "all": "ALL" // Tambahkan jika ada tab 'all'
    };
    return categoryLabels[category] || category;
}

/**
 * Load PDF.js library with fallback
 */
async function loadPDFJS() {
    if (window.pdfjsLib) {
        pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        console.log('PDF.js already loaded');
        return;
    }

    try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js');
        pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        console.log('PDF.js loaded');
    } catch (error) {
        console.error('Failed to load PDF.js', error);
        throw error;
    }
}

/**
 * Initialize magnetic button effects
 */
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.magnetic-btn');

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            if (isMobile) return;

            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const distanceX = x - centerX;
            const distanceY = y - centerY;

            btn.style.transform = `translate(${distanceX * 0.15}px, ${distanceY * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// =============================================
// CORE FUNCTIONALITY
// =============================================

/**
 * Create certificate card element
 */
function createCertificateCard(cert, category) {
    // Handle spaces in file names by encoding the URI
    const encodedPdfUrl = encodeURI(`${baseUrl}/${cert.pdfUrl}`);
    const downloadFileName = `${cert.name.replace(/[/\\?%*:|"<>]/g, '-')}.pdf`;

    // Gunakan badge custom jika ada, jika tidak fallback ke label kategori
    const badgeLabel = cert.badge || categoryToLabel(category);
    const badgeStyle = cert.badgeColor ? `style="background:${cert.badgeColor};box-shadow:0 0 12px ${cert.badgeColor.split(' ')[1] || '#00eaff'}99;"` : "";

    // PERBAIKAN DI SINI: Definisikan issuerInfo
    const issuerInfo = cert.date ? `<p class="certificate-date">${cert.date}</p>` : ''; // Misalnya, gunakan tanggal jika ada
    const durationInfo = cert.duration ? `<p class="certificate-duration"><i class="fas fa-clock"></i> ${cert.duration}</p>` : "";

    const card = document.createElement("div");
    card.className = "certificate-card";
    card.style.display = "block";
    card.innerHTML = `
        <div class="pdf-preview-container">
            <canvas class="pdf-canvas" data-pdf-url="${encodedPdfUrl}"></canvas>
            <div class="pdf-preview-overlay">
                <i class="fas fa-expand"></i>
            </div>
            <div class="certificate-badge" ${badgeStyle}>${badgeLabel}</div>
        </div>
        <div class="certificate-card-content">
            <h4>${cert.name}</h4>
            <div class="certificate-desc" style="color:#b3e5fc;font-size:1rem;margin-bottom:0.7rem;">
                ${cert.desc ? cert.desc : "Sertifikat resmi yang membuktikan keahlian di bidang ini."}
            </div>
            ${durationInfo} <!-- Tambahkan ini untuk menampilkan waktu -->
            ${issuerInfo}
            <div class="certificate-actions">
                <a href="${encodedPdfUrl}" target="_blank" class="view-pdf-btn magnetic-btn" data-pdf-url="${encodedPdfUrl}" 
                   data-title="${cert.name}" data-date="${cert.date || ''}" data-category="${category}">
                    <i class="fas fa-eye"></i> View Certificate
                    <div class="btn-hover-effect"></div>
                </a>
                <a href="${encodedPdfUrl}" class="download-mini-btn magnetic-btn" download="${downloadFileName}">
                    <i class="fas fa-download"></i>
                    <div class="btn-hover-effect"></div>
                </a>
            </div>
        </div>
    `;
    return card;
}

/**
 * Render all PDF previews using pdf.js
 */
async function renderAllPDFPreviews() {
    if (!pdfjsLib) {
        console.warn('PDF.js library not loaded');
        return;
    }

    const canvases = document.querySelectorAll('.pdf-canvas');
    if (!canvases.length) {
        console.warn('No canvases found for PDF preview');
        return;
    }

    for (const canvas of canvases) {
        const pdfUrl = canvas.getAttribute('data-pdf-url');
        if (!pdfUrl) continue;

        console.log('Rendering PDF preview:', pdfUrl); // Tambahkan log ini

        // Show loading state
        let loadingDiv = canvas.parentNode.querySelector('.pdf-loading-state');
        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.className = 'pdf-loading-state';
            loadingDiv.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner-circle"></div>
                    <div class="spinner-circle"></div>
                    <div class="spinner-circle"></div>
                </div>
                <p>Loading preview...</p>
            `;
            canvas.parentNode.insertBefore(loadingDiv, canvas);
        }
        canvas.style.display = 'none';

        try {
            // Always fetch as URL (pastikan path PDF benar dan bisa diakses browser)
            const loadingTask = pdfjsLib.getDocument(pdfUrl);
            const pdfDoc = await loadingTask.promise;
            const page = await pdfDoc.getPage(1);
            const viewport = page.getViewport({ scale: isMobile ? 0.18 : 0.25 });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: canvas.getContext('2d'),
                viewport: viewport
            }).promise;

            loadingDiv.remove();
            canvas.style.display = 'block';
            canvas.style.opacity = '1';

            console.log('PDF rendered successfully:', pdfUrl); // Tambahkan log ini
        } catch (err) {
            console.error('Error rendering PDF preview:', err, pdfUrl); // Log error dan url
            loadingDiv.innerHTML = `
                <div class="error-preview">
                    <i class="fas fa-file-pdf" style="font-size:2.5rem;color:#cbd5e1"></i>
                    <p style="color:#64748b">Preview unavailable</p>
                </div>
            `;
            canvas.style.display = 'none';
        }
    }
}

/**
 * Main render function
 */
async function renderCertificates(category) {
    try {
        const certificateGrid = document.getElementById('certificate-grid');
        if (!certificateGrid) throw new Error('Certificate grid not found');

        // MODIFIKASI: Gabungkan semua sertifikat jika kategori 'all'
        let items;
        if (category === "all") {
            items = [];
            Object.keys(certificatesData).forEach(cat => {
                certificatesData[cat].forEach(cert => {
                    // Tambahkan properti _category untuk melacak kategori asli saat 'all'
                    items.push({ ...cert, _category: cat });
                });
            });
        } else {
            // Pastikan kategori yang dicari ada di certificatesData
            items = certificatesData[category] || [];
        }

        if (!items || !items.length) {
            certificateGrid.innerHTML = `
                <div class="no-certificates">
                    <i class="fas fa-info-circle"></i>
                    <p>No certificates found in this category</p>
                </div>
            `;
            updateCertificateCounter(0);
            updateViewAllButton(0);
            return;
        }

        updateCertificateCounter(items.length);
        certificateGrid.innerHTML = "";

        const itemsToRender = showAll ? [...items] : items.slice(0, 3);

        // Render cards
        itemsToRender.forEach((cert, index) => {
            // Untuk tab ALL, gunakan _category sebagai kategori, jika tidak gunakan kategori saat ini
            const card = createCertificateCard(cert, cert._category || category);
            certificateGrid.appendChild(card);
        });

        // Tunggu DOM update sebelum render PDF
        setTimeout(async () => {
            await renderAllPDFPreviews();
            setupEventListeners();
        }, 100);

        updateViewAllButton(items.length);
        currentCategory = category;
        initMagneticButtons();
    } catch (error) {
        console.error(`Error rendering ${category}`, error);
        const certificateGrid = document.getElementById('certificate-grid');
        if (certificateGrid) {
            certificateGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load certificates. Please try again.</p>
                </div>
            `;
        }
    }
}

// =============================================
// UI UPDATES AND EVENT HANDLERS
// =============================================

/**
 * Update certificate counter UI
 */
function updateCertificateCounter(total) {
    const shownCount = document.getElementById('shown-count');
    const totalCount = document.getElementById('total-count');
    if (shownCount && totalCount) {
        const currentItems = certificatesData[currentCategory] || [];
        const shown = showAll ? total : Math.min(3, total);

        // Animate counter
        animateValue(shownCount, parseInt(shownCount.textContent) || 0, shown, 500);
        animateValue(totalCount, parseInt(totalCount.textContent) || 0, total, 500);
    }
}

/**
 * Animate numeric value changes
 */
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

/**
 * Toggle visibility of "View All" button
 */
function updateViewAllButton(totalItems) {
    const viewAllBtn = document.getElementById("view-all-btn");
    const viewAllContainer = document.querySelector('.view-all-container');
    if (!viewAllBtn || !viewAllContainer) return;

    viewAllBtn.style.display = totalItems > 3 ? "inline-flex" : "none";

    const viewAllText = document.getElementById("view-all-text");
    const viewAllIcon = document.getElementById("view-all-icon");

    if (showAll) {
        viewAllText.textContent = "Show Less";
        viewAllIcon.classList.remove("fa-chevron-down");
        viewAllIcon.classList.add("fa-chevron-up");
        // Tambahkan animasi naik
        viewAllContainer.classList.add("animate-up");
    } else {
        viewAllText.textContent = "View All Certificates";
        viewAllIcon.classList.remove("fa-chevron-up");
        viewAllIcon.classList.add("fa-chevron-down");
        // Hapus animasi naik
        viewAllContainer.classList.remove("animate-up");
    }
}

/**
 * Open PDF modal with specified URL and metadata
 */
function openPDFModal(pdfUrl, title, date, category) {
    const modal = document.getElementById('pdf-modal');
    const viewer = document.getElementById('pdf-viewer');
    const pdfTitle = document.getElementById('pdf-title');
    const pdfDate = document.getElementById('pdf-date');
    const downloadLink = document.getElementById('pdf-download');
    const loadingElement = document.querySelector('.pdf-loading');
    const modalCategory = document.getElementById('modal-category');

    if (!modal || !viewer || !pdfTitle || !pdfDate || !downloadLink) return;

    // Show loading state
    loadingElement.style.display = 'flex';
    viewer.style.display = 'none';

    // Update modal content
    pdfTitle.textContent = title;
    pdfDate.textContent = date;
    modalCategory.textContent = categoryToLabel(category);
    downloadLink.setAttribute('href', pdfUrl);
    downloadLink.setAttribute('download', `${title.replace(/[/\\?%*:|"<>]/g, '-')}.pdf`);

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Load PDF after modal animation
    setTimeout(() => {
        viewer.src = `${pdfUrl}#view=fitH`;
        viewer.onload = () => {
            loadingElement.style.display = 'none';
            viewer.style.display = 'block';
        };
        viewer.onerror = () => {
            loadingElement.innerHTML = `
                <div class="error-preview">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load certificate</p>
                </div>
            `;
        };
    }, 300);
}

/**
 * Close PDF modal
 */
function closePDFModal() {
    const modal = document.getElementById('pdf-modal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    setTimeout(() => {
        const viewer = document.getElementById('pdf-viewer');
        if (viewer) {
            viewer.src = '';
        }
    }, 300);
}

/**
 * Setup event listeners after rendering
 */
function setupEventListeners() {
    // View PDF buttons
    document.querySelectorAll('.view-pdf-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const pdfUrl = btn.getAttribute('data-pdf-url');
            if (pdfUrl) {
                window.open(pdfUrl, '_blank');
            }
        });
    });

    // Click on PDF preview
    document.querySelectorAll('.pdf-preview-container').forEach(container => {
        container.addEventListener('click', (e) => {
            if (e.target.closest('.view-pdf-btn') || e.target.closest('.download-mini-btn')) return;
            const pdfUrl = container.querySelector('.pdf-canvas')?.getAttribute('data-pdf-url');
            if (pdfUrl) {
                window.open(pdfUrl, '_blank');
            }
        });
    });

    // Tidak perlu event modal lagi
}

// =============================================
// INITIALIZATION
// =============================================

/**
 * Initialize certificates module
 */
export async function initCertificates() {
    try {
        if (!document.getElementById('certificates')) {
            console.log('Certificates section not found, skipping initialization');
            return;
        }

        // Check if mobile
        isMobile = window.innerWidth <= 768;

        // Load Font Awesome if not already loaded (cek ini di index.html, mungkin sudah ada)
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(link);
        }

        await loadPDFJS();
        await renderCertificates(currentCategory);

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                showAll = false;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderCertificates(btn.dataset.category);
            });
        });

        // View All toggle
        const viewAllBtn = document.getElementById('view-all-btn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                showAll = !showAll;
                await renderCertificates(currentCategory);

                // Scroll ke bagian atas tab setiap kali tombol diklik
                setTimeout(() => {
                    // Scroll ke tab container (bagian tab)
                    const tabSection = document.querySelector('.certificates-tabs');
                    if (tabSection) {
                        tabSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            isMobile = window.innerWidth <= 768;
        });
    } catch (error) {
        console.error('Initialization error', error);
    }
}

// Attach to window for easier access from non-module scripts if necessary
window.initCertificates = initCertificates;

// DOMContentLoaded listener is now handled in index.html to ensure HTML is loaded first.
// document.addEventListener('DOMContentLoaded', initCertificates); // Ini dihapus