
/* ==============================================================
TEMA Y MENÚ: Alterna el modo claro/oscuro y el menú responsive
=============================================================== */
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('white-mode');
});
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

/* ===============================================
THREE.JS: Configuración básica para el fondo 3D
================================================ */
const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
scene.background = null;
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshBasicMaterial({ color: 0xff6347, wireframe: true });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);
camera.position.z = 5;
function animate3D() {
    requestAnimationFrame(animate3D);
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate3D();

/* ================================================================
EFECTOS DE SCROLL & PARALLAX: Ajusta el fondo de la sección HERO
================================================================= */
window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    const hero = document.getElementById('hero');
    const maxScroll = 1600;
    if (scrollPosition <= maxScroll) {
        const zoomPercent = 120 + (scrollPosition * 0.2);
        const brightness = 1 - (scrollPosition / maxScroll) * 0.95;
        hero.style.backgroundSize = `${zoomPercent}% auto`;
        hero.style.filter = `brightness(${brightness})`;
    } else {
        hero.style.backgroundSize = `100% auto`;
        hero.style.filter = `brightness(1)`;
    }
});

/* ====================================================================
SISTEMA DE MASCOTA: Controla el movimiento y animación de la mascota
===================================================================== */
const petFrames = {
    idle: [
        "https://via.placeholder.com/100x100/CCCCCC/000000?text=idle1",
        "https://via.placeholder.com/100x100/BBBBBB/000000?text=idle2"
    ],
    run: [
        "https://via.placeholder.com/100x100/FFCCCC/000000?text=run1",
        "https://via.placeholder.com/100x100/FFAAAA/000000?text=run2",
        "https://via.placeholder.com/100x100/FF8888/000000?text=run3"
    ],
    jump: [
        "https://via.placeholder.com/100x100/CCFFCC/000000?text=jump1",
        "https://via.placeholder.com/100x100/AAFFAA/000000?text=jump2"
    ]
};
const pet = {
    el: document.getElementById('pet'),
    x: 50,
    y: window.innerHeight - 150,
    state: "idle",
    frameIndex: 0,
    frameRate: 150,
    lastFrameTime: 0,
    speed: 5,
    control: false
};
const keysPressed = {};
window.addEventListener('keydown', (e) => { keysPressed[e.key] = true; });
window.addEventListener('keyup', (e) => { keysPressed[e.key] = false; });
pet.el.addEventListener('click', () => { pet.control = !pet.control; });
function updatePet(timestamp) {
    if (pet.control) {
        let moving = false;
        if (keysPressed["ArrowLeft"]) { pet.x -= pet.speed; moving = true; }
        if (keysPressed["ArrowRight"]) { pet.x += pet.speed; moving = true; }
        if (keysPressed["ArrowUp"]) { pet.y -= pet.speed; moving = true; }
        if (keysPressed["ArrowDown"]) { pet.y += pet.speed; moving = true; }
        if (keysPressed[" "]) { pet.state = "jump"; moving = true; }
        else { pet.state = moving ? "run" : "idle"; }
    } else {
        pet.state = "idle";
    }
    // Limitar el movimiento dentro de la ventana
    pet.x = Math.max(0, Math.min(window.innerWidth - pet.el.offsetWidth, pet.x));
    pet.y = Math.max(0, Math.min(window.innerHeight - pet.el.offsetHeight, pet.y));
    pet.el.style.transform = `translate(${pet.x}px, ${pet.y}px)`;
    if (timestamp - pet.lastFrameTime > pet.frameRate) {
        pet.frameIndex = (pet.frameIndex + 1) % petFrames[pet.state].length;
        pet.lastFrameTime = timestamp;
        document.querySelectorAll('.mascota .layer').forEach(layer => {
            layer.src = petFrames[pet.state][pet.frameIndex];
        });
    }
    requestAnimationFrame(updatePet);
}
requestAnimationFrame(updatePet);

/* ===============================================================
INTERSECTION OBSERVER: Anima secciones al entrar en el viewport
================================================================ */
const sections = document.querySelectorAll('section');
const indicators = document.querySelectorAll('.section-indicators .indicator');

const observerOptions = { threshold: 0.6 };
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            
            indicators.forEach(indicator => {
                indicator.classList.remove('active');
                if (indicator.getAttribute('href') === '#' + entry.target.id) {
                    indicator.classList.add('active');
                }
            });
        } else {
            entry.target.classList.remove('show');
        }
    });
}, observerOptions);

sections.forEach(section => {
    section.classList.add('hidden');
    sectionObserver.observe(section);
});

/* ================================================================
BOTÓN "SCROLL TO TOP": Muestra u oculta el botón según el scroll
================================================================= */
const scrollToTopBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => {
    scrollToTopBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
});
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===================================================================
AJUSTE DEL CANVAS AL REDIMENSIONAR: Actualiza la cámara y el render
==================================================================== */
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ===============================================================
AÑOS DE EXPERIENCIA: Calcula la cantidad de años de experiencia
================================================================ */
const startDate = new Date("2016-01-01");
const currentDate = new Date();
let experienceYears = currentDate.getFullYear() - startDate.getFullYear();
if (
    currentDate.getMonth() < startDate.getMonth() ||
    (currentDate.getMonth() === startDate.getMonth() && currentDate.getDate() < startDate.getDate())
) {
    experienceYears--;
}
document.getElementById("experience-years").textContent = experienceYears;