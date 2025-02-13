/* ==============================================================
   1. TEMA Y MENÚ: Alterna el modo claro/oscuro y el menú responsive
================================================================ */
function initThemeAndMenu() {
    const themeToggle = document.getElementById('theme-toggle')
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('white-mode')
        })
    }
    const navToggle = document.getElementById('nav-toggle')
    const navMenu = document.getElementById('nav-menu')
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active')
        })
    }
}

/* ==============================================================
     2. THREE.JS: Configuración básica para el fondo 3D
  ================================================================ */
function initThreeJS() {
    const canvas = document.getElementById('three-canvas')
    if (!canvas) return
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    scene.background = null

    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)
    const material = new THREE.MeshBasicMaterial({
        color: 0xff6347,
        wireframe: true
    })
    const torus = new THREE.Mesh(geometry, material)
    scene.add(torus)

    camera.position.z = 5
    function animate3D() {
        requestAnimationFrame(animate3D)
        torus.rotation.x += 0.01
        torus.rotation.y += 0.01
        renderer.render(scene, camera)
    }
    animate3D()

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    })
}

/* ==============================================================
     3. SISTEMA DE MASCOTA: Controla el movimiento y animación de la mascota
  ================================================================ */
function initMascota() {
    const petFrames = {
        idle: [
            'https://via.placeholder.com/100x100/CCCCCC/000000?text=idle1',
            'https://via.placeholder.com/100x100/BBBBBB/000000?text=idle2'
        ],
        run: [
            'https://via.placeholder.com/100x100/FFCCCC/000000?text=run1',
            'https://via.placeholder.com/100x100/FFAAAA/000000?text=run2',
            'https://via.placeholder.com/100x100/FF8888/000000?text=run3'
        ],
        jump: [
            'https://via.placeholder.com/100x100/CCFFCC/000000?text=jump1',
            'https://via.placeholder.com/100x100/AAFFAA/000000?text=jump2'
        ]
    }

    const pet = {
        el: document.getElementById('pet'),
        x: 50,
        y: window.innerHeight - 150,
        state: 'idle',
        frameIndex: 0,
        frameRate: 150,
        lastFrameTime: 0,
        speed: 5,
        control: false
    }
    if (!pet.el) return
    const keysPressed = {}
    window.addEventListener('keydown', e => {
        keysPressed[e.key] = true
    })
    window.addEventListener('keyup', e => {
        keysPressed[e.key] = false
    })
    pet.el.addEventListener('click', () => {
        pet.control = !pet.control
    })

    function updatePet(timestamp) {
        if (pet.control) {
            let moving = false
            if (keysPressed['ArrowLeft']) {
                pet.x -= pet.speed
                moving = true
            }
            if (keysPressed['ArrowRight']) {
                pet.x += pet.speed
                moving = true
            }
            if (keysPressed['ArrowUp']) {
                pet.y -= pet.speed
                moving = true
            }
            if (keysPressed['ArrowDown']) {
                pet.y += pet.speed
                moving = true
            }
            if (keysPressed[' ']) {
                pet.state = 'jump'
                moving = true
            } else {
                pet.state = moving ? 'run' : 'idle'
            }
        } else {
            pet.state = 'idle'
        }
        // Limitar el movimiento dentro de la ventana
        pet.x = Math.max(0, Math.min(window.innerWidth - pet.el.offsetWidth, pet.x))
        pet.y = Math.max(
            0,
            Math.min(window.innerHeight - pet.el.offsetHeight, pet.y)
        )
        pet.el.style.transform = `translate(${pet.x}px, ${pet.y}px)`

        if (timestamp - pet.lastFrameTime > pet.frameRate) {
            pet.frameIndex = (pet.frameIndex + 1) % petFrames[pet.state].length
            pet.lastFrameTime = timestamp
            document.querySelectorAll('.mascota .layer').forEach(layer => {
                layer.src = petFrames[pet.state][pet.frameIndex]
            })
        }
        requestAnimationFrame(updatePet)
    }
    requestAnimationFrame(updatePet)
}

/* ==============================================================
     4. INTERSECTION OBSERVER: Anima secciones al entrar en el viewport
  ================================================================ */
function initIntersectionObserver() {
    const sections = document.querySelectorAll('section')
    const indicators = document.querySelectorAll('.section-indicators .indicator')
    const observerOptions = { threshold: 0.3 }

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show')
                indicators.forEach(indicator => {
                    indicator.classList.remove('active')
                    if (indicator.getAttribute('href') === '#' + entry.target.id) {
                        indicator.classList.add('active')
                    }
                })
            } else {
                entry.target.classList.remove('show')
            }
        })
    }, observerOptions)

    sections.forEach(section => {
        section.classList.add('hidden')
        sectionObserver.observe(section)
    })
}

/* ==============================================================
     5. BOTÓN "SCROLL TO TOP": Muestra u oculta el botón según el scroll
  ================================================================ */
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop')
    if (!scrollToTopBtn) return
    window.addEventListener('scroll', () => {
        scrollToTopBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none'
    })
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    })
}

/* ==============================================================
     6. AÑOS DE EXPERIENCIA: Calcula la cantidad de años de experiencia
  ================================================================ */
function initExperienceYears() {
    const startDate = new Date('2016-01-01')
    const currentDate = new Date()
    let experienceYears = currentDate.getFullYear() - startDate.getFullYear()
    if (
        currentDate.getMonth() < startDate.getMonth() ||
        (currentDate.getMonth() === startDate.getMonth() &&
            currentDate.getDate() < startDate.getDate())
    ) {
        experienceYears--
    }
    const expEl = document.getElementById('experience-years')
    if (expEl) expEl.textContent = experienceYears
}

/* ==============================================================
     7. MULTI-COLOR: Cambia dinámicamente el color de acento
  ================================================================ */
function initMultiColor() {
    const root = document.documentElement
    const colores = [
        '#f39c12',
        '#DE8D1C',
        '#DA5818',
        '#D52413',
        '#D41233',
        '#D52413',
        '#DA5818',
        '#f39c12'
    ]
    let indiceColor = 0
    function cambiarColorAccent() {
        root.style.setProperty('--color-accent', colores[indiceColor])
        indiceColor = (indiceColor + 1) % colores.length
    }
    root.style.setProperty('transition', '--color-accent 1s ease-in-out')
    setInterval(cambiarColorAccent, 10000)
}

/* ==============================================================
     8. CARRUSEL: Muestra la tarjeta activa de experiencia
  ================================================================ */
function initCarousel() {
    const carousel = document.querySelector('.carousel')
    const cards = document.querySelectorAll('.carousel .card')
    const numbers = document.querySelectorAll('.carousel-number .number')

    function updateIndicators() {
        const carouselRect = carousel.getBoundingClientRect()
        let activeIndex = 0
        let minDistance = Infinity
        cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect()
            const cardCenter = cardRect.left + cardRect.width / 2
            const carouselCenter = carouselRect.left + carouselRect.width / 2
            const distance = Math.abs(carouselCenter - cardCenter)
            if (distance < minDistance) {
                minDistance = distance
                activeIndex = index
            }
        })
        numbers.forEach(num => num.classList.remove('active'))
        if (numbers[activeIndex]) {
            numbers[activeIndex].classList.add('active')
        }
    }
    updateIndicators()
    carousel.addEventListener('scroll', () =>
        window.requestAnimationFrame(updateIndicators)
    )
    numbers.forEach(num => {
        num.addEventListener('click', function () {
            const index = Number(this.getAttribute('data-index'))
            const targetCard = cards[index]
            if (targetCard) {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            }
        })
    })
}

/* ==============================================================
     9. EDUCACIÓN: Actualiza la imagen al hacer clic en cada card
  ================================================================ */
function initEducationCards() {
    const eduCards = document.querySelectorAll('.edu-card')
    const displayImg = document.getElementById('edu-image')
    if (!displayImg) return

    eduCards.forEach(card => {
        card.addEventListener('click', () => {
            // Quitar la clase activa de todos los cards
            eduCards.forEach(c => c.classList.remove('active'))
            // Agregar la clase activa al card clickeado
            card.classList.add('active')

            const newImgSrc = card.getAttribute('data-img')
            displayImg.classList.remove('slide-in')
            displayImg.classList.add('slide-out')

            setTimeout(() => {
                displayImg.src = newImgSrc
                displayImg.classList.remove('slide-out')
                displayImg.classList.add('slide-in')
            }, 300)
        })
    })

    // Activar el primer card por defecto y mostrar su imagen
    if (eduCards.length > 0) {
        eduCards[0].classList.add('active')
        displayImg.src = eduCards[0].getAttribute('data-img')
        // Opcional: si deseas aplicar el efecto de entrada desde el inicio
        displayImg.classList.add('slide-in')
    }
}

/* ============================================================== 
   10. PROYECTOS Y MODAL: Filtrado, animación y visualización en modal
=============================================================== */
function initProyectos() {
    const filterButtons = document.querySelectorAll("#proyectos .filter-btn");
    const projectCards = Array.from(document.querySelectorAll("#proyectos .project-card"));

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");
            const visibleCards = [];

            projectCards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (filterValue === "all" || category === filterValue) {
                    card.style.display = "block";
                    visibleCards.push(card);
                } else {
                    card.style.display = "none";
                }
            });

            visibleCards.forEach((card, index) => {
                card.style.transition = "transform 0.5s ease, opacity 0.5s ease";
                card.style.transform = "translateX(-50px)";
                card.style.opacity = "0";

                card.offsetHeight;

                setTimeout(() => {
                    card.style.transform = "translateX(0)";
                    card.style.opacity = "1";
                }, index * 100);
            });
        });
    });

    projectCards.forEach(card => {
        card.addEventListener("click", () => {
            if (card.style.display !== "none") {
                const img = card.querySelector(".project-front img");
                if (img) {
                    openModal(img.src, false);
                } else {
                    const video = card.querySelector(".project-front video");
                    if (video) {
                        const source = video.querySelector("source");
                        if (source) {
                            openModal(source.src, true);
                        }
                    }
                }
            }
        });
    });
}

function openModal(src, isVideo) {
    const modal = document.getElementById("modal");
    const modalContentContainer = document.getElementById("modal-content");

    modalContentContainer.innerHTML = "";

    if (isVideo) {
        const videoEl = document.createElement("video");
        videoEl.controls = true;
        videoEl.autoplay = true;
        videoEl.muted = false;
        videoEl.loop = true;
        videoEl.style.width = "100%";
        videoEl.style.height = "auto";
        const sourceEl = document.createElement("source");
        sourceEl.src = src;
        sourceEl.type = "video/mp4";
        videoEl.appendChild(sourceEl);
        modalContentContainer.appendChild(videoEl);
    } else {
        const imgEl = document.createElement("img");
        imgEl.src = src;
        imgEl.alt = "Imagen ampliada";
        modalContentContainer.appendChild(imgEl);
    }
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("modal");
    const modalContentContainer = document.getElementById("modal-content");

    const videoEl = modalContentContainer.querySelector("video");
    if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
    }

    modal.style.display = "none";
    modalContentContainer.innerHTML = "";
}

function initModal() {
    const modal = document.getElementById("modal");
    const closeBtn = document.getElementById("modal-close");

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

/* ============================================================== 
     11. CONTACTO: Captura datos y abre Gmail con el mensaje 
  ================================================================ */
function initContacto() {
    const form = document.querySelector('#contact .contact-form')
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault()
            const nombre = document.getElementById('nombre').value
            const correo = document.getElementById('correo').value
            const mensaje = document.getElementById('mensaje').value
            const asunto = encodeURIComponent("Interesado en tus servicios")
            const cuerpo = encodeURIComponent(`Hola Ronal,

            Mi nombre es ${nombre}.
            Mi email es ${correo}.

            ${mensaje}

            Saludos,`)

            const mailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=alvarado_aries_20@hotmail.com&su=${asunto}&body=${cuerpo}`
            window.open(mailURL, '_blank')
        })
    }
}

/* ==============================================================
     INIT: Inicializa todos los scripts al cargar el DOM
  ================================================================ */
function init() {
    initThemeAndMenu()
    initThreeJS()
    initMascota()
    initIntersectionObserver()
    initScrollToTop()
    initExperienceYears()
    initMultiColor()
    initCarousel()
    initEducationCards()
    initProyectos()
    initModal()
    initContacto()
}
document.addEventListener('DOMContentLoaded', init)
