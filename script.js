document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('three-container');
    if (!container || typeof THREE === 'undefined') {
        console.error("THREE.js has not been loaded or the container is missing.");
        return;
    }

    let scene, camera, renderer, composer, logo, ringsGroup;

    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 10;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const renderScene = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0;
        bloomPass.strength = 1.2;
        bloomPass.radius = 0.5;

        composer = new EffectComposer(renderer);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);

        const logoGroup = new THREE.Group();
        const logoMaterial = new THREE.MeshBasicMaterial({ color: 0x00bfff });

        const ringGeometry = new THREE.RingGeometry(1.4, 1.5, 64);
        const ring = new THREE.Mesh(ringGeometry, logoMaterial);
        logoGroup.add(ring);

        const shape = new THREE.Shape();
        shape.moveTo(-0.8, -0.5);
        shape.lineTo(-0.4, 0.5);
        shape.lineTo(0, 0);
        shape.lineTo(0.4, 0.5);
        shape.lineTo(0.8, -0.5);
        shape.lineTo(0.5, -0.5);
        shape.lineTo(0.2, 0);
        shape.lineTo(0, -0.2);
        shape.lineTo(-0.2, 0);
        shape.lineTo(-0.5, -0.5);
        shape.closePath();

        const symbolGeometry = new THREE.ShapeGeometry(shape);
        const symbol = new THREE.Mesh(symbolGeometry, logoMaterial);
        logoGroup.add(symbol);

        logo = logoGroup;
        scene.add(logo);

        ringsGroup = new THREE.Group();
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x00bfff,
            side: THREE.DoubleSide,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });

        for (let i = 0; i < 4; i++) {
            const torusGeo = new THREE.TorusGeometry(3 + i * 0.7, 0.01, 16, 100);
            const torus = new THREE.Mesh(torusGeo, ringMaterial);
            torus.rotation.x = Math.PI / 2;
            torus.rotation.y = Math.random() * Math.PI;
            torus.scale.set(1 + Math.random() * 0.3, 1 + Math.random() * 0.3, 1);
            ringsGroup.add(torus);
        }
        scene.add(ringsGroup);

        const icons = ['<>', '{}', '/>', '!!', '()'];
        const fontLoader = new THREE.FontLoader();
        fontLoader.load('https://cdn.skypack.dev/three@0.128.0/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.5 });
            icons.forEach((icon, i) => {
                const textGeo = new THREE.TextGeometry(icon, { font, size: 0.2, height: 0.02 });
                const textMesh = new THREE.Mesh(textGeo, textMaterial);
                const pivot = new THREE.Object3D();
                const angle = (i / icons.length) * Math.PI * 2;
                const radius = 3 + (i % 2) * 0.7;
                textMesh.position.x = radius;
                pivot.rotation.z = angle;
                pivot.add(textMesh);
                ringsGroup.add(pivot);
            });
        });

        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('scroll', drawConnectingLines, false);
        drawConnectingLines();
    }

    function drawConnectingLines() {
        const svg = document.querySelector('.lines-svg');
        const skillIcons = document.querySelectorAll('.skill-icon');
        const skillsSection = document.getElementById('skills');

        if (!svg || !skillsSection || skillIcons.length === 0) return;

        svg.innerHTML = '';
        const sectionRect = skillsSection.getBoundingClientRect();

        // Target the center of the skills-section, not the viewport
        const endX = sectionRect.width / 2;
        const endY = sectionRect.height / 2;

        skillIcons.forEach(icon => {
            const startRect = icon.getBoundingClientRect();
            // Calculate start position relative to the skills-section
            const startX = startRect.left - sectionRect.left + startRect.width / 2;
            const startY = startRect.top - sectionRect.top + startRect.height / 2;

            // Only draw if the icon is within the visible part of the section
            if(startRect.top < window.innerHeight && startRect.bottom > 0) {
                const controlX = startX;
                const controlY = startY + (endY - startY) * 0.5;

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`);
                svg.appendChild(path);
            }
        });
    }

    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        composer.setSize(container.clientWidth, container.clientHeight);
        drawConnectingLines();
    }

    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.0002;

        if (logo) logo.rotation.y = time * 0.5;

        if (ringsGroup) {
            ringsGroup.rotation.z = time * 0.2;
            ringsGroup.children.forEach((child, index) => {
                if (child.type === 'Mesh') {
                    child.rotation.z += 0.001 * (index * 0.5 + 1);
                } else {
                    child.rotation.z += 0.005;
                }
            });
        }

        composer.render();
    }

    init();
    animate();
});
