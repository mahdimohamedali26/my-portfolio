const container = document.getElementById('three-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00bfff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// 3D Object - Torus Knot
const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16);
const material = new THREE.MeshStandardMaterial({
    color: 0x00bfff,
    metalness: 0.8,
    roughness: 0.2,
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

camera.position.z = 7;

// Mouse interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation
function animate() {
    requestAnimationFrame(animate);

    torusKnot.rotation.x += 0.005;
    torusKnot.rotation.y += 0.005;

    // Mouse follow
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
/* --- Skills Section 3D Icons --- */
function initSkillIcon(containerId, geometry, color) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id ${containerId} not found.`);
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(color, 1, 100);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.6,
        roughness: 0.4,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    camera.position.z = 2.5;

    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Create icons
document.addEventListener('DOMContentLoaded', () => {
    initSkillIcon('html-icon', new THREE.BoxGeometry(1.5, 1.5, 1.5), 0xE44D26); // Red-orange for HTML
    initSkillIcon('css-icon', new THREE.ConeGeometry(1, 2, 32), 0x1572B6);    // Blue for CSS
    initSkillIcon('js-icon', new THREE.SphereGeometry(1, 32, 32), 0xF7DF1E);   // Yellow for JS
    initSkillIcon('python-icon', new THREE.TorusGeometry(1, 0.4, 16, 100), 0x3776AB); // Blue for Python
    initSkillIcon('react-icon', new THREE.TorusKnotGeometry(1, 0.3, 100, 16), 0x61DAFB); // Light blue for React
    initSkillIcon('node-icon', new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32), 0x8CC84B); // Green for Node.js
});
