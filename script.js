
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const themeToggle = document.getElementById('theme-toggle');
    const cursorTrail = document.getElementById('cursor-trail');
    const projectCards = document.querySelectorAll('.project-card');
    const projectDetails = document.getElementById('project-details');
    const closeBtn = document.querySelector('.close-btn');
    const nebulaContainer = document.getElementById('nebula-container');

    // Three.js code for spinning cone (DO NOT MODIFY)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('cone-container').appendChild(renderer.domElement);
    
    // Set scene background to transparent
    scene.background = null;

    const geometry = new THREE.ConeGeometry(1, 4, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: true, transparent: true, opacity: 0.35 });
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

    // Create nebula cluster buttons
    const projects = [
        { id: 'nexus', title: 'Ave', description: 'Mex-US Supply Chain', url: 'https://avehq.com' },
        { id: 'stardrive', title: 'Emprendedores LatAm', description: 'LatAm Tech Newsletter and Community', url: 'https://latamtech.substack.com/' },
        { id: 'roboassist', title: 'WIP', description: 'Coming soon', url: null },
        { id: 'biosynth', title: 'WIP', description: 'Coming soon', url: null },
        { id: 'quantumleap', title: 'WIP', description: 'Coming soon', url: null },
        { id: 'ecofuel', title: 'WIP', description: 'Coming soon', url: null }
    ];
    
    // Calculate positions for nebula buttons around the hero content
    function positionNebulaButtons() {
        // Clear existing buttons
        nebulaContainer.innerHTML = '';
        
        // Get hero content position
        const heroContent = document.querySelector('.hero-content');
        const rect = heroContent.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Radius based on hero-content size so the buttons hug the text more closely
        const isMobile = window.innerWidth <= 768;
        const baseRadiusX = heroContent.offsetWidth / 2 + (isMobile ? 60 : 120);
        const baseRadiusY = heroContent.offsetHeight / 2 + (isMobile ? 40 : 80);
        const radiusX = Math.min(baseRadiusX, isMobile ? 180 : 300);
        const radiusY = Math.min(baseRadiusY, isMobile ? 150 : 250);
        
        // Place buttons in an oval around the hero content
        projects.forEach((project, index) => {
            const angle = (index / projects.length) * Math.PI * 2;
            
            // Calculate position on the oval
            const x = centerX + radiusX * Math.cos(angle) - 50; // 50 is half the button width
            const y = centerY + radiusY * Math.sin(angle) - 50; // 50 is half the button height
            
            // Create button
            const button = document.createElement('button');
            const variant = index % 2 === 0 ? 'nebula-a' : 'nebula-b';
        button.className = `nebula-button ${variant}`;
            button.style.left = `${x}px`;
            button.style.top = `${y}px`;
            button.dataset.project = project.id;
            
            // Add text that appears on hover
            const span = document.createElement('span');
            span.textContent = project.title;
            button.appendChild(span);
            
            // Add click event
            button.addEventListener('click', () => {
            if(project.url){ window.open(project.url, '_blank'); return; }

                document.getElementById('detail-title').textContent = project.title;
                document.getElementById('detail-description').textContent = project.description;
            const linkEl = document.getElementById('detail-link');
            if (project.url) {
                linkEl.href = project.url;
                linkEl.style.display = 'inline-block';
            } else {
                linkEl.style.display = 'none';
            }
                document.getElementById('detail-image').src = `/path/to/${project.id}-image.jpg`; // Replace with actual image path
                
                projectDetails.classList.add('active');
            });
            
            nebulaContainer.appendChild(button);
        });
    }
    
    // Initial positioning
    positionNebulaButtons();

    // Reposition after full page load and intro animations
    window.addEventListener('load', positionNebulaButtons);
    setTimeout(positionNebulaButtons, 1200);

    closeBtn.addEventListener('click', () => {
        projectDetails.classList.remove('active');
    });

    // Theme toggle functionality
    const body = document.body;

    // Update theme toggle button appearance (handled via CSS variables, no inner text needed)
    const updateThemeIcon = () => {
        themeToggle.textContent = '';
    };

    // Set the correct icon on page load
    updateThemeIcon();

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        updateThemeIcon();

        // A short delay ensures styles are applied before repositioning buttons
        setTimeout(() => {
            positionNebulaButtons();
        }, 100);
    });

    // Reposition nebula buttons on window resize
    window.addEventListener('resize', positionNebulaButtons);
});
