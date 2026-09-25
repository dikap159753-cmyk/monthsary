const targetDate = new Date('2033-09-22T16:00:00+08:00');

const musicToggle = document.getElementById('musicToggle');
const audioPlayer = document.getElementById('audioPlayer');

const syncMusicButton = (muted) => {
  if (!musicToggle) return;
  musicToggle.textContent = muted ? '🔊 Sound On' : '🔇 Sound Off';
};

const startMusic = async (muted = false) => {
  if (!audioPlayer) return;
  audioPlayer.muted = muted;
  syncMusicButton(muted);

  try {
    await audioPlayer.play();
  } catch (error) {
    audioPlayer.muted = true;
    syncMusicButton(true);
    console.warn('Audio play was blocked:', error);
  }
};

if (audioPlayer) {
  audioPlayer.muted = true;
  syncMusicButton(true);
}

const invitationGate = document.getElementById('invitationGate');
const openInvitation = document.getElementById('openInvitation');

if (invitationGate && openInvitation) {
  openInvitation.addEventListener('click', () => {
    if (document.body.classList.contains('invitation-opening')) return;

    void startMusic(true);
    document.body.classList.add('invitation-opening');
    openInvitation.classList.add('is-opening');
    invitationGate.classList.add('is-opening');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => {
      invitationGate.hidden = true;
      document.body.classList.remove('invitation-closed', 'invitation-opening');
      document.querySelector('.hero').focus({ preventScroll: true });
      if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.muted = false;
        syncMusicButton(false);
      }
    }, reducedMotion ? 0 : 1200);
  });
}

const updateCountdown = () => {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
};

updateCountdown();
setInterval(updateCountdown, 1000);

const revealImages = document.querySelectorAll('.hero-visual img, .gallery-grid img');

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  revealImages.forEach((image) => {
    image.classList.add('reveal-image');
    imageObserver.observe(image);
  });
} else {
  revealImages.forEach((image) => image.classList.add('is-visible'));
}

const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const galleryLightbox = document.querySelector('.gallery-lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
let activeGalleryIndex = 0;

const showGalleryImage = (index) => {
  activeGalleryIndex = (index + galleryItems.length) % galleryItems.length;
  const sourceImage = galleryItems[activeGalleryIndex].querySelector('img');
  lightboxImage.src = sourceImage.src;
  lightboxImage.alt = sourceImage.alt;
  lightboxCaption.textContent = sourceImage.alt;
};

if (galleryLightbox && galleryItems.length) {
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      showGalleryImage(index);
      galleryLightbox.showModal();
    });
  });

  document.querySelector('.lightbox-close').addEventListener('click', () => {
    galleryLightbox.close();
  });

  document.querySelector('.lightbox-previous').addEventListener('click', () => {
    showGalleryImage(activeGalleryIndex - 1);
  });

  document.querySelector('.lightbox-next').addEventListener('click', () => {
    showGalleryImage(activeGalleryIndex + 1);
  });

  galleryLightbox.addEventListener('click', (event) => {
    if (event.target === galleryLightbox) galleryLightbox.close();
  });

  galleryLightbox.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      galleryLightbox.close();
      return;
    }
    if (event.key === 'ArrowLeft') showGalleryImage(activeGalleryIndex - 1);
    if (event.key === 'ArrowRight') showGalleryImage(activeGalleryIndex + 1);
  });
}

if (musicToggle && audioPlayer) {
  musicToggle.addEventListener('click', () => {
    if (audioPlayer.muted) {
      void startMusic();
      return;
    }

    audioPlayer.muted = true;
    syncMusicButton(true);
  });
}
