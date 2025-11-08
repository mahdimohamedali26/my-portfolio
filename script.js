document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('three-logo-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00bfff, 1, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Central Logo Shape
    const logoMaterial = new THREE.MeshStandardMaterial({
        color: 0x00bfff,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x00bfff,
        emissiveIntensity: 0.3
    });

    const shape = new THREE.Shape();
    shape.moveTo(-5, -1);
    shape.lineTo(-2, 5);
    shape.lineTo(2, 5);
    shape.lineTo(5, -1);
    shape.lineTo(2, -5);
    shape.lineTo(-2, -5);
    shape.lineTo(-5, -1);

    const extrudeSettings = { depth: 1, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    const logoMesh = new THREE.Mesh(geometry, logoMaterial);
    logoMesh.scale.set(0.5, 0.5, 0.5);
    scene.add(logoMesh);

    // Orbital Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 500;
    const posArray = new Float32Array(particlesCnt * 3);
    for (let i = 0; i < particlesCnt * 3; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 10 + Math.random() * 2;
        posArray[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i * 3 + 2] = radius * Math.cos(phi);
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x00bfff,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8
    });

    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleMesh);

    // Animation
    const clock = new THREE.Clock();
    function animate() {
        const elapsedTime = clock.getElapsedTime();
        logoMesh.rotation.y = elapsedTime * 0.3;
        particleMesh.rotation.y = -elapsedTime * 0.1;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});
