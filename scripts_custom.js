function initThemeAndMenu() {
    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('white-mode')
    })
    document.getElementById('nav-toggle').addEventListener('click', () => {
        document.getElementById('nav-menu').classList.toggle('active')
    })
}

function initThreeJS() {
    const canvas = document.getElementById('three-canvas')
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    scene.background = null
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)
    const material = new THREE.MeshBasicMaterial({ color: 0xff6347, wireframe: true })
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
    const keysPressed = {}
    window.addEventListener('keydown', e => { keysPressed[e.key] = true })
    window.addEventListener('keyup', e => { keysPressed[e.key] = false })
    pet.el.addEventListener('click', () => { pet.control = !pet.control })
    function updatePet(timestamp) {
        let moving = false
        if (pet.control) {
            if (keysPressed['ArrowLeft']) { pet.x -= pet.speed; moving = true }
            if (keysPressed['ArrowRight']) { pet.x += pet.speed; moving = true }
            if (keysPressed['ArrowUp']) { pet.y -= pet.speed; moving = true }
            if (keysPressed['ArrowDown']) { pet.y += pet.speed; moving = true }
            if (keysPressed[' ']) { pet.state = 'jump'; moving = true }
            else { pet.state = moving ? 'run' : 'idle' }
        } else pet.state = 'idle'
        pet.x = Math.max(0, Math.min(window.innerWidth - pet.el.offsetWidth, pet.x))
        pet.y = Math.max(0, Math.min(window.innerHeight - pet.el.offsetHeight, pet.y))
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

function initIntersectionObserver() {
    const sections = document.querySelectorAll('section')
    const indicators = document.querySelectorAll('.section-indicators .indicator')
    
    function updateActiveSection() {
        const scrollPosition = window.scrollY + window.innerHeight / 2
        let activeSection = null
        let minDistance = Infinity
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop
            const sectionBottom = sectionTop + section.offsetHeight
            const sectionCenter = sectionTop + section.offsetHeight / 2
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                const distance = Math.abs(scrollPosition - sectionCenter)
                if (distance < minDistance) {
                    minDistance = distance
                    activeSection = section
                }
            }
        })
        
        indicators.forEach(indicator => {
            indicator.classList.remove('active')
            if (activeSection && indicator.getAttribute('href') === '#' + activeSection.id) {
                indicator.classList.add('active')
            }
        })
    }
    
    const observerOptions = { threshold: [0.1, 0.5, 0.9] }
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle('show', entry.isIntersecting)
        })
        updateActiveSection()
    }, observerOptions)
    
    sections.forEach(section => {
        section.classList.add('hidden')
        sectionObserver.observe(section)
    })
    
    window.addEventListener('scroll', updateActiveSection)
    updateActiveSection()
}

function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop')
    window.addEventListener('scroll', () => {
        scrollToTopBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none'
    })
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    })
}

function initExperienceYears() {
    const startDate = new Date('2016-01-01')
    const currentDate = new Date()
    let experienceYears = currentDate.getFullYear() - startDate.getFullYear()
    if (currentDate.getMonth() < startDate.getMonth() || (currentDate.getMonth() === startDate.getMonth() && currentDate.getDate() < startDate.getDate())) experienceYears--
    document.getElementById('experience-years').textContent = experienceYears
}

function initMultiColor() {
    const root = document.documentElement
    const colores = ['#f39c12', '#DE8D1C', '#DA5818', '#D52413', '#D41233', '#D52413', '#DA5818', '#f39c12']
    let indiceColor = 0
    function cambiarColorAccent() {
        root.style.setProperty('--color-accent', colores[indiceColor])
        indiceColor = (indiceColor + 1) % colores.length
    }
    root.style.setProperty('transition', '--color-accent 1s ease-in-out')
    setInterval(cambiarColorAccent, 10000)
}

function initCarousel() {
    const carousel = document.querySelector('.carousel')
    const cards = document.querySelectorAll('.carousel .card')
    const numbers = document.querySelectorAll('.carousel-number .number')
    function updateIndicators() {
        const carouselRect = carousel.getBoundingClientRect()
        let activeIndex = 0, minDistance = Infinity
        cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect()
            const cardCenter = cardRect.left + cardRect.width / 2
            const carouselCenter = carouselRect.left + carouselRect.width / 2
            const distance = Math.abs(carouselCenter - cardCenter)
            if (distance < minDistance) { minDistance = distance; activeIndex = index }
        })
        numbers.forEach(num => num.classList.remove('active'))
        numbers[activeIndex].classList.add('active')
    }
    updateIndicators()
    carousel.addEventListener('scroll', () => window.requestAnimationFrame(updateIndicators))
    numbers.forEach(num => {
        num.addEventListener('click', function () {
            const index = Number(this.getAttribute('data-index'))
            cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        })
    })
}

function initEducationCards() {
    const eduCards = document.querySelectorAll('.edu-card')
    const displayImg = document.getElementById('edu-image')
    eduCards.forEach(card => {
        card.addEventListener('click', () => {
            eduCards.forEach(c => c.classList.remove('active'))
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
    eduCards[0].classList.add('active')
    displayImg.src = eduCards[0].getAttribute('data-img')
    displayImg.classList.add('slide-in')
}

function initProyectos() {
    const filterButtons = document.querySelectorAll("#proyectos .filter-btn")
    const projectCards = Array.from(document.querySelectorAll("#proyectos .project-card"))
    const projectsGrid = document.querySelector("#proyectos .projects-grid")
    const projectsMainCard = document.querySelector(".projects-main-card")

    function updateGridColumns() {
        const visibleCards = projectCards.filter(card => {
            const style = window.getComputedStyle(card)
            return style.display !== "none"
        })
        const numCards = visibleCards.length

        if (projectsGrid && numCards > 0) {
            if (numCards <= 6) {
                projectsGrid.style.gridTemplateRows = "200px"
                projectsGrid.style.gridTemplateColumns = `repeat(${numCards}, 150px)`
                projectsGrid.style.gridAutoFlow = "row"
                visibleCards.forEach((card) => {
                    card.style.order = ""
                })
            } else {
                const numColumns = Math.ceil(numCards / 2)
                projectsGrid.style.gridTemplateRows = "repeat(2, 200px)"
                projectsGrid.style.gridTemplateColumns = `repeat(${numColumns}, 150px)`
                projectsGrid.style.gridAutoFlow = "column"

                visibleCards.forEach((card, index) => {
                    card.style.order = Math.floor(index / 2) + (index % 2) * numColumns
                })
            }
        }
    }

    if (projectsMainCard) {
        projectsMainCard.addEventListener('wheel', (e) => {
            e.preventDefault()
            const scrollAmount = e.deltaY
            projectsGrid.scrollLeft += scrollAmount
        })
    }

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"))
            btn.classList.add("active")
            const filterValue = btn.getAttribute("data-filter")
            const visibleCards = []

            projectCards.forEach(card => {
                card.style.order = ""
                const category = card.getAttribute("data-category")
                if (filterValue === "all" || category === filterValue) {
                    card.style.display = "block"
                    visibleCards.push(card)
                } else {
                    card.style.display = "none"
                }
            })

            setTimeout(() => {
                updateGridColumns()
            }, 100)

            visibleCards.forEach((card, index) => {
                card.style.transition = "transform 0.5s ease, opacity 0.5s ease"
                card.style.transform = "translateX(-50px)"
                card.style.opacity = "0"
                card.offsetHeight
                setTimeout(() => {
                    card.style.transform = "translateX(0)"
                    card.style.opacity = "1"
                }, index * 100)
            })
        })
    })

    projectCards.forEach(card => {
        card.addEventListener("click", () => {
            if (card.style.display !== "none") {
                const img = card.querySelector(".project-front img")
                if (img) openModal(img.src, false)
                else {
                    const video = card.querySelector(".project-front video")
                    if (video) {
                        const source = video.querySelector("source")
                        if (source) openModal(source.src, true)
                    }
                }
            }
        })
    })

    if (projectsGrid) {
        projectsGrid.style.display = "grid"
    }

    updateGridColumns()

    window.addEventListener('resize', () => {
        updateGridColumns()
    })
}

function openModal(src, isVideo) {
    const modal = document.getElementById("modal")
    const modalContentContainer = document.getElementById("modal-content")
    modalContentContainer.innerHTML = ""
    if (isVideo) {
        const videoEl = document.createElement("video")
        videoEl.controls = true
        videoEl.autoplay = true
        videoEl.muted = false
        videoEl.loop = true
        videoEl.style.width = "100%"
        videoEl.style.height = "auto"
        const sourceEl = document.createElement("source")
        sourceEl.src = src
        sourceEl.type = "video/mp4"
        videoEl.appendChild(sourceEl)
        modalContentContainer.appendChild(videoEl)
    } else {
        const imgEl = document.createElement("img")
        imgEl.src = src
        imgEl.alt = "Imagen ampliada"
        modalContentContainer.appendChild(imgEl)
    }
    modal.style.display = "block"
}

function closeModal() {
    const modal = document.getElementById("modal")
    const modalContentContainer = document.getElementById("modal-content")
    const videoEl = modalContentContainer.querySelector("video")
    if (videoEl) {
        videoEl.pause()
        videoEl.currentTime = 0
    }
    modal.style.display = "none"
    modalContentContainer.innerHTML = ""
}

function initModal() {
    const modal = document.getElementById("modal")
    const closeBtn = document.getElementById("modal-close")
    closeBtn.addEventListener("click", closeModal)
    modal.addEventListener("click", e => {
        if (e.target === modal) closeModal()
    })
}

function initContacto() {
    const form = document.querySelector('#contact .contact-form')
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

function initParallax() {
    const parallaxSections = document.querySelectorAll('section[data-parallax], #hero, #proyectos, #experience, #education')
    function parallaxScroll() {
        const scrollY = window.scrollY || window.pageYOffset
        parallaxSections.forEach(section => {
            let bg = section.querySelector('.parallax-bg')
            if (!bg) return
            const speed = section.dataset.parallaxSpeed ? parseFloat(section.dataset.parallaxSpeed) : 0.4
            const offset = section.offsetTop
            const height = section.offsetHeight
            if (scrollY + window.innerHeight > offset && scrollY < offset + height) {
                const y = (scrollY - offset) * speed
                bg.style.transform = `translateY(${y}px)`
                bg.style.opacity = '1'
            } else {
                bg.style.opacity = '0.7'
            }
        })
    }
    window.addEventListener('scroll', parallaxScroll)
    parallaxScroll()
}

function enhanceSectionOverlays() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const overlay = entry.target.querySelector('.section-overlay, .section-overlay-about')
            if (overlay) {
                if (entry.isIntersecting) overlay.classList.add('show')
                else overlay.classList.remove('show')
            }
        })
    }, { threshold: 0.3 })
    document.querySelectorAll('section').forEach(section => observer.observe(section))
}

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
    initParallax()
    enhanceSectionOverlays()
}
document.addEventListener('DOMContentLoaded', init)
