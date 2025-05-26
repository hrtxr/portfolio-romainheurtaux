function toggleMenu() {
    var menu = document.getElementById('menu');
    menu.classList.toggle('show');
}

const progressBar = document.querySelector('.progress-bar');
const progressBarContainer = document.querySelector('.progress-bar-container');

const studies = document.querySelectorAll('.studies');
const numStudies = studies.length;

let progress = 0;
let isLocked = false;
let hasTriggered = false;
let hasCompleted = false;

function isScrollAtMiddle() {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    return scrollY + windowHeight / 2 >= docHeight / 2 - 50 && scrollY + windowHeight / 2 <= docHeight / 2 + 50;
}

function lockScroll() {
    document.body.style.overflow = 'hidden';
}
function unlockScroll() {
    document.body.style.overflow = '';
}

function resetProgressBar() {
    progress = 0;
    progressBar.style.height = '0%';
    isLocked = false;
    hasTriggered = false;
}

function updateSelected() {
    const progress = parseFloat(progressBar.style.height) || 0;
    let index = Math.floor((progress / 100) * numStudies);

    if (progress === 100) {
        index = numStudies - 1;
    }

    studies.forEach(study => study.classList.remove('selected'));

    studies[index].classList.add('selected');
}

function isAtScrollContainer() {
    const scrollContainer = document.getElementById('scrollcontainer');
    const rect = scrollContainer.getBoundingClientRect();
    const offset = -375; // Ajuste cette valeur pour décaler la détection
    return rect.top <= window.innerHeight / 2 + offset && rect.bottom >= window.innerHeight / 2 + offset;
}

window.addEventListener('DOMContentLoaded', () => {
    if (window.scrollY + window.innerHeight / 2 > document.documentElement.scrollHeight / 2 + 50) {
        hasCompleted = true;
        progress = 100;
        progressBar.style.height = '100%';
        unlockScroll();
    } else {
        hasCompleted = false;
        resetProgressBar();
    }
});

window.addEventListener('scroll', () => {
    
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    if (scrollY + windowHeight >= docHeight - 1) {
        console.log("At the bottom of the page");
        progress = 100;
        progressBar.style.height = '100%';
        hasCompleted = true;
        isLocked = false;
        unlockScroll();
        updateSelected();
    }

    if (isScrollAtMiddle()) {
        console.log("At the middle of the page");
        if (!hasTriggered || hasCompleted) {
            hasTriggered = true;
            isLocked = true;
            hasCompleted = false; 
            lockScroll();
        }
    } else if (!hasCompleted && hasTriggered && !isScrollAtMiddle()) {
        console.log("Reaching the progress bar while scrolling up");
        isLocked = false;
        hasTriggered = false;
        unlockScroll();
    }

    // Vérifie si l'utilisateur remonte et atteint la barre de progression
    if (!hasCompleted && scrollY + windowHeight / 2 < docHeight / 2 + 50 && scrollY + windowHeight / 2 > docHeight / 2 - 50) {
        if (!isLocked) {
            isLocked = true;
            lockScroll();
        }
    }

    // Vérifie si le scroll est au niveau du scrollcontainer
    if (isAtScrollContainer()) {
        if (!isLocked) {
            isLocked = true;
            lockScroll(); // Verrouille le scroll
        }
    } else if (isLocked) {
        unlockScroll(); // Déverrouille le scroll si on n'est plus dans la zone
        isLocked = false;
    }

    updateSelected();
});

// Remplit la barre avec la molette
window.addEventListener('wheel', (e) => {
    
    if (!isLocked) return;
    e.preventDefault();

    progress += e.deltaY * 0.025;
    if (progress < 0) progress = 0;
    if (progress > 100) progress = 100;

    progressBar.style.height = progress + '%';
    
    updateSelected();

    if (progress >= 100) {
        isLocked = false;
        unlockScroll();
        hasCompleted = true;
    }
    
    if (progress === 0) {
        isLocked = false;
        unlockScroll();  
        hasTriggered = false;
    }      
}, { passive: false });