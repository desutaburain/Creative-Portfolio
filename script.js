document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const hoverElements = document.querySelectorAll('.custom-hover, a, button');

    // Mencegah error di device layar sentuh
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Direct follow untuk dot
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Smooth follow menggunakan animate (Web Animations API) untuk outline
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Efek hover pada elemen interaktif
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
        });
    }

    // --- 2. Sticky Navbar ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // --- 3. 3D Tilt Card Effect ---
    const cards = document.querySelectorAll('.portfolio-card');
    cards.forEach(card => {
        const inner = card.querySelector('.card-inner');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Posisi x cursor di dalam card
            const y = e.clientY - rect.top;  // Posisi y cursor di dalam card

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Kalkulasi derajat rotasi (dibagi angka tertentu untuk menghaluskan efek)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            inner.style.transform = `translateZ(30px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset posisi saat cursor keluar dari card
            inner.style.transform = `translateZ(30px) rotateX(0deg) rotateY(0deg)`;
            inner.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            // Menghapus transisi saat bergerak agar instan & responsif
            inner.style.transition = 'none';
        });
    });

    // --- 4. Portfolio Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Hapus class active dari semua tombol, berikan pada yg diklik
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    card.classList.remove('hide');
                    setTimeout(() => card.style.position = 'relative', 300);
                } else {
                    card.classList.add('hide');
                    setTimeout(() => card.style.position = 'absolute', 300);
                }
            });
        });
    });

    // --- 5. Modal / Lightbox Logic ---
    const modal = document.getElementById('projectModal');
    const modalClose = document.querySelector('.close-modal');
    const modalMedia = document.getElementById('modalMedia');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const type = card.getAttribute('data-type');
            const src = card.getAttribute('data-src');
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');

            // Set Content
            modalTitle.textContent = title;
            modalDesc.textContent = desc;

            if (type === 'image') {
                modalMedia.innerHTML = `<img src="${src}" alt="${title}">`;
            } else if (type === 'video') {
                modalMedia.innerHTML = `<video autoplay loop controls playsinline><source src="${src}" type="video/mp4"></video>`;
            }

            modal.classList.add('active');
        });
    });

    // Fungsi tutup modal
    const closeModal = () => {
        modal.classList.remove('active');
        // Stop video playback dengan menghapus isi container
        setTimeout(() => modalMedia.innerHTML = '', 400);
    };

    modalClose.addEventListener('click', closeModal);
    modal.querySelector('.modal-bg').addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // --- 6. Scroll Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Hanya animasi 1x (opsional)
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // --- 7. Live Clock ---
    const clockElement = document.getElementById('liveClock');
    setInterval(() => {
        const date = new Date();
        clockElement.textContent = date.toLocaleTimeString('en-US', { hour12: false });
    }, 1000);

    // --- Audio Background Logic ---
    const bgMusic = document.getElementById('bgMusic');
    const soundToggle = document.getElementById('soundToggle');
    const soundText = soundToggle ? soundToggle.querySelector('.sound-text') : null;
    let isPlaying = false;

    function playAudio() {
        if (!bgMusic) return;
        bgMusic.play().then(() => {
            if (soundText) soundText.textContent = 'Sound ON';
            if (soundToggle) soundToggle.classList.add('playing');
            isPlaying = true;
        }).catch(err => {
            console.log("Autoplay terhalang oleh browser atau file tidak ditemukan:", err);
        });
    }

    function pauseAudio() {
        if (!bgMusic) return;
        bgMusic.pause();
        if (soundText) soundText.textContent = 'Sound OFF';
        if (soundToggle) soundToggle.classList.remove('playing');
        isPlaying = false;
    }

    function toggleAudio(e) {
        if (e) e.stopPropagation(); // Mencegah event berbenturan dengan klik window
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }

    if (soundToggle) {
        soundToggle.addEventListener('click', toggleAudio);
    }

    // Trik Autoplay saat pengguna pertama kali berinteraksi (klik/ketik) di halaman
    const enableAutoplayOnFirstInteraction = () => {
        if (!isPlaying) {
            playAudio();
        }
        window.removeEventListener('click', enableAutoplayOnFirstInteraction);
        window.removeEventListener('keydown', enableAutoplayOnFirstInteraction);
    };

    window.addEventListener('click', enableAutoplayOnFirstInteraction);
    window.addEventListener('keydown', enableAutoplayOnFirstInteraction);
});
