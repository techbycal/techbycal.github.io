
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const themeToggle = document.getElementById('theme-toggle');
    const cursorTrail = document.getElementById('cursor-trail');
    const projectCards = document.querySelectorAll('.project-card');
    const projectDetails = document.getElementById('project-details');
    const closeBtn = document.querySelector('.close-btn');

    // Rotating 3D Rocket
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('rocket-background').appendChild(renderer.domElement);

    const geometry = new THREE.ConeGeometry(1, 4, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: true });
    const rocket = new THREE.Mesh(geometry, material);
    scene.add(rocket);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        rocket.rotation.x += 0.01;
        rocket.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();

    // Cursor trail
    function createTrail(e) {
        const trail = document.createElement('div');
        trail.className = 'trail';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        cursorTrail.appendChild(trail);

        setTimeout(() => {
            trail.style.opacity = '0';
        }, 100);

        setTimeout(() => {
            cursorTrail.removeChild(trail);
        }, 600);
    }

    document.addEventListener('mousemove', createTrail);

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Expandable project cards
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const project = card.dataset.project;
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('p').textContent;
            
            document.getElementById('detail-title').textContent = title;
            document.getElementById('detail-description').textContent = description;
            document.getElementById('detail-image').src = `/path/to/${project}-image.jpg`; // Replace with actual image path
            
            projectDetails.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => {
        projectDetails.classList.remove('active');
    });

    // Theme switcher
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });

    // Sticky header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
