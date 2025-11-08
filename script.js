const container = document.getElementById('three-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Lighting for Hero
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0x00bfff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Hero 3D Object
const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16);
const material = new THREE.MeshStandardMaterial({ color: 0x00bfff, metalness: 0.8, roughness: 0.2 });
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);
camera.position.z = 7;

// Mouse interaction for Hero
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animateHero() {
    requestAnimationFrame(animateHero);
    torusKnot.rotation.x += 0.005;
    torusKnot.rotation.y += 0.005;
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}
animateHero();

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

/* --- Skills Section 3D Icons --- */
function setupScene(container, model) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    scene.add(model);
    camera.position.z = 2.8;

    function animate() {
        requestAnimationFrame(animate);
        model.rotation.y += 0.01;
        model.rotation.x += 0.005;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const skills = {
        'html-icon': { create: createHtmlIcon, color: 0xE44D26 },
        'css-icon': { create: createCssIcon, color: 0x1572B6 },
        'js-icon': { create: createJsIcon, color: 0xF7DF1E },
        'react-icon': { create: createReactIcon, color: 0x61DAFB },
        'node-icon': { create: createNodeIcon, color: 0x8CC84B },
        'python-icon': { create: createPythonIcon, color: 0x3776AB }
    };

    for (const [id, skill] of Object.entries(skills)) {
        const container = document.getElementById(id);
        if (container) {
            const model = skill.create(skill.color);
            setupScene(container, model);
        }
    }
});

function createHtmlIcon(color) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: color, metalness: 0.7, roughness: 0.3 });
    const main = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.2, 0.2), material);
    const tag = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.3), material);
    tag.position.set(-0.5, 0.7, 0);
    tag.rotation.z = Math.PI / 4;
    group.add(main, tag);
    return group;
}

function createCssIcon(color) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: color, metalness: 0.7, roughness: 0.3 });
    for (let i = 0; i < 3; i++) {
        const plane = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 0.1), material);
        plane.position.set(i * 0.2 - 0.2, i * -0.5 + 0.5, 0);
        group.add(plane);
    }
    return group;
}

function createJsIcon(color) {
    const material = new THREE.MeshStandardMaterial({ color: color, metalness: 0.8, roughness: 0.2 });
    return new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 0), material);
}

function createReactIcon(color) {
    const group = new THREE.Group();
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), new THREE.MeshStandardMaterial({ color: color, metalness: 0.7, roughness: 0.3 }));
    group.add(center);
    for (let i = 0; i < 3; i++) {
        const torus = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.05, 16, 100), new THREE.MeshStandardMaterial({ color: color, metalness: 0.7, roughness: 0.3 }));
        torus.rotation.x = Math.PI / 2;
        torus.rotation.y = (Math.PI / 3) * i;
        group.add(torus);
    }
    return group;
}

function createNodeIcon(color) {
    const material = new THREE.MeshStandardMaterial({ color: color, metalness: 0.7, roughness: 0.3 });
    return new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.3, 6), material);
}

function createPythonIcon(color) {
    const group = new THREE.Group();
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x3776AB, metalness: 0.7, roughness: 0.3 });
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xFFD43B, metalness: 0.7, roughness: 0.3 });
    const bluePart = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.2, 16, 100, Math.PI * 1.5), blueMat);
    bluePart.position.y = 0.5;
    const yellowPart = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.2, 16, 100, Math.PI * 1.5), yellowMat);
    yellowPart.position.y = -0.5;
    yellowPart.rotation.z = Math.PI;
    group.add(bluePart, yellowPart);
    return group;
}
