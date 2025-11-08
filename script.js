import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/UnrealBloomPass.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('three-container');
    if (!container) return;

    let scene, camera, renderer, composer, bloomPass, logo, ringsGroup;

    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 10;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Post-processing for glow effect
        const renderScene = new RenderPass(scene, camera);
        bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0;
        bloomPass.strength = 1.2; // Main glow intensity
        bloomPass.radius = 0.5;

        composer = new EffectComposer(renderer);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);

        // --- Create Central Logo ---
        const logoGroup = new THREE.Group();
        const logoMaterial = new THREE.MeshBasicMaterial({ color: 0x00bfff });

        // Outer Circle
        const ringGeometry = new THREE.RingGeometry(1.4, 1.5, 64);
        const ring = new THREE.Mesh(ringGeometry, logoMaterial);
        logoGroup.add(ring);

        // Inner Symbol (stylized 'M')
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

        // --- Create Orbital Rings ---
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
            torus.scale.x = 1 + Math.random() * 0.3;
            torus.scale.y = 1 + Math.random() * 0.3;
            ringsGroup.add(torus);
        }
        scene.add(ringsGroup);

        // --- Orbital Icons ---
        const icons = ['<>', '{}', '/>', '!!', '()'];
        const fontLoader = new THREE.FontLoader();
        fontLoader.load('https://cdn.skypack.dev/three@0.128.0/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.5 });
            for(let i = 0; i < icons.length; i++) {
                const textGeo = new THREE.TextGeometry(icons[i], {
                    font: font,
                    size: 0.2,
                    height: 0.02,
                });
                const textMesh = new THREE.Mesh(textGeo, textMaterial);
                const pivot = new THREE.Object3D();

                const angle = (i / icons.length) * Math.PI * 2;
                const radius = 3 + (i % 2) * 0.7; // Place on different rings

                textMesh.position.x = radius;
                pivot.rotation.z = angle;
                pivot.add(textMesh);
                ringsGroup.add(pivot);
            }
        });

        window.addEventListener('resize', onWindowResize, false);
        drawConnectingLines();
    }

    function drawConnectingLines() {
        const svg = document.querySelector('.lines-svg');
        const skillIcons = document.querySelectorAll('.skill-icon');
        const threeContainer = document.getElementById('three-container');

        if (!svg || !threeContainer || skillIcons.length === 0) return;

        svg.innerHTML = ''; // Clear previous lines

        const containerRect = document.querySelector('.container').getBoundingClientRect();
        const endRect = threeContainer.getBoundingClientRect();

        const endX = endRect.left - containerRect.left + endRect.width / 2;
        const endY = endRect.top - containerRect.top + endRect.height / 2;

        skillIcons.forEach(icon => {
            const startRect = icon.getBoundingClientRect();
            const startX = startRect.left - containerRect.left + startRect.width / 2;
            const startY = startRect.top - containerRect.top + startRect.height / 2;

            // Control point for the curve
            const controlX = startX;
            const controlY = startY + (endY - startY) * 0.5;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`);
            svg.appendChild(path);
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

        if(logo) {
            logo.rotation.y = time * 0.5;
        }

        if(ringsGroup) {
            ringsGroup.rotation.z = time * 0.2;
            ringsGroup.children.forEach((child, index) => {
                if (child instanceof THREE.Mesh) { // The rings
                    child.rotation.z += 0.001 * (index * 0.5 + 1);
                } else { // The pivots for text
                    child.rotation.z += 0.005;
                }
            });
        }

        composer.render();
    }

    init();
    animate();
});
