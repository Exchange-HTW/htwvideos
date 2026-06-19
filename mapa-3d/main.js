import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { universities } from './data.js';
import { initAudio, playContinent, getContinent } from './audioManager.js';

// DOM Elements
const container = document.getElementById('canvas-container');
const infoPanel = document.getElementById('info-panel');
const uniName = document.getElementById('uni-name');
const uniDesc = document.getElementById('uni-desc');
const closeBtn = document.getElementById('close-btn');
const tooltip = document.getElementById('tooltip');
const continentIndicator = document.getElementById('continent-indicator');
const continentSpan = document.getElementById('continent-span');

let audioUnlocked = false;

// Iniciar audio en el primer click en cualquier parte de la pantalla
const startAudio = () => {
    if (!audioUnlocked) {
        continentIndicator.classList.remove('hidden');
        initAudio();
        audioUnlocked = true;
        window.removeEventListener('click', startAudio);
        window.removeEventListener('touchstart', startAudio);
    }
};

window.addEventListener('click', startAudio);
window.addEventListener('touchstart', startAudio);

const RADIUS = 5;

// Inicialización de Escena
const scene = new THREE.Scene();

// Añadir espacio de fondo (Estrellas / Polvo espacial estilo tech)
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 2000;
const posArray = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 200;
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starsMaterial = new THREE.PointsMaterial({
    size: 0.15,
    color: 0x4da6ff,
    transparent: true,
    opacity: 0.6
});
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Cámara
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 16;
camera.position.y = 5;

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

// Controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.minDistance = 6;
controls.maxDistance = 25;
controls.rotateSpeed = 0.8;

// Configurar la Tierra (Estilo Wireframe / Holograma)
const earthGroup = new THREE.Group();
scene.add(earthGroup);

// 1. Núcleo oscuro de la tierra
const earthGeometry = new THREE.SphereGeometry(RADIUS, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x030308,
    emissive: 0x051020,
    transparent: true,
    opacity: 0.95
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earthGroup.add(earth);

// 2. Malla de cordenadas (Wireframe sutil)
const gridGeometry = new THREE.SphereGeometry(RADIUS + 0.01, 32, 32);
const gridMaterial = new THREE.MeshBasicMaterial({
    color: 0x1a3a5a,
    wireframe: true,
    transparent: true,
    opacity: 0.15
});
const grid = new THREE.Mesh(gridGeometry, gridMaterial);
earthGroup.add(grid);

// Luces
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x4da6ff, 2);
directionalLight.position.set(15, 10, 10);
scene.add(directionalLight);

const backLight = new THREE.DirectionalLight(0xff3366, 0.8);
backLight.position.set(-15, -10, -10);
scene.add(backLight);

// Conjunto interactivo
const pointsGroup = new THREE.Group();
earthGroup.add(pointsGroup);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Función de conversión
function latLongToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}

// 3. Dibujar Continentes con GeoJSON
fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
    .then(res => res.json())
    .then(data => {
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x4da6ff,
            transparent: true,
            opacity: 0.6
        });

        data.features.forEach(feature => {
            if (!feature.geometry) return;
            const type = feature.geometry.type;
            const coordinates = feature.geometry.coordinates;

            function drawPolygon(polygon) {
                const points = [];
                // El primer array dentro de un polígono es siempre el anillo exterior
                polygon[0].forEach(coord => {
                    const lon = coord[0];
                    const lat = coord[1];
                    const pos = latLongToVector3(lat, lon, RADIUS + 0.02);
                    points.push(pos);
                });
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, lineMaterial);
                earthGroup.add(line);
            }

            if (type === 'Polygon') {
                drawPolygon(coordinates);
            } else if (type === 'MultiPolygon') {
                coordinates.forEach(drawPolygon);
            }
        });
    })
    .catch(err => console.error("Error cargando continentes: ", err));

// Configuración visual de los marcadores
const markerGeometry = new THREE.CylinderGeometry(0.05, 0.01, 0.5, 16);
markerGeometry.translate(0, 0.25, 0); // Ajustar pivot a la base
const markerMaterial = new THREE.MeshStandardMaterial({
    color: 0xff3366,
    emissive: 0xff3366,
    emissiveIntensity: 0.8,
    roughness: 0.2,
    metalness: 0.8
});

const markers = []; // Para raycasting

universities.forEach(uni => {
    const pos = latLongToVector3(uni.lat, uni.lon, RADIUS + 0.02);

    // Pin visible
    const marker = new THREE.Mesh(markerGeometry, markerMaterial.clone());
    marker.position.copy(pos);
    marker.lookAt(new THREE.Vector3(0, 0, 0));
    marker.rotateX(-Math.PI / 2);

    // Hitbox invisible (más grande para facilitar el click)
    const hitAreaGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const hitAreaMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitArea = new THREE.Mesh(hitAreaGeo, hitAreaMat);
    hitArea.position.copy(pos);
    hitArea.userData = uni;
    hitArea.userData.markerObj = marker;

    pointsGroup.add(marker);
    pointsGroup.add(hitArea);
    markers.push(hitArea);
});

// Event Listeners Interactividad
closeBtn.addEventListener('click', () => {
    infoPanel.classList.add('hidden');
});

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onClick);
window.addEventListener('resize', onWindowResize);

let hoveredObj = null;

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(markers);

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const hit = intersects[0].object;
        const uni = hit.userData;
        const markerObj = uni.markerObj;

        if (hoveredObj !== markerObj) {
            if (hoveredObj) resetMarkerStyle(hoveredObj);

            hoveredObj = markerObj;
            hoveredObj.scale.set(1.5, 1.5, 1.5);
            hoveredObj.material.emissiveIntensity = 1.5;
            hoveredObj.material.color.setHex(0x00ffcc);
            hoveredObj.material.emissive.setHex(0x00ffcc);
        }

        tooltip.style.opacity = 1;
        tooltip.style.left = event.clientX + 'px';
        tooltip.style.top = (event.clientY - 20) + 'px';
        tooltip.textContent = uni.name;

    } else {
        document.body.style.cursor = 'default';
        tooltip.style.opacity = 0;

        if (hoveredObj) {
            resetMarkerStyle(hoveredObj);
            hoveredObj = null;
        }
    }
}

function resetMarkerStyle(markerObj) {
    markerObj.scale.set(1, 1, 1);
    markerObj.material.emissiveIntensity = 0.8;
    markerObj.material.color.setHex(0xff3366);
    markerObj.material.emissive.setHex(0xff3366);
}

function onClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(markers);

    if (intersects.length > 0) {
        const uni = intersects[0].object.userData;
        uniName.textContent = uni.name;
        uniDesc.innerHTML = uni.desc;
        infoPanel.classList.remove('hidden');

        const markerObj = uni.markerObj;
        markerObj.scale.set(2, 2, 2);
        setTimeout(() => {
            if (hoveredObj === markerObj) markerObj.scale.set(1.5, 1.5, 1.5);
            else resetMarkerStyle(markerObj);
        }, 150);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Auto-rotación inteligente
let isDragging = false;
let autoRotate = true;
let rotTimeout;

controls.addEventListener('start', () => {
    isDragging = true;
    autoRotate = false;
});

controls.addEventListener('end', () => {
    isDragging = false;
    clearTimeout(rotTimeout);
    rotTimeout = setTimeout(() => {
        autoRotate = true;
    }, 3000); // 3 segundos sin tocar = vuelve a girar
});

// Bucle Continuo de Animación
function animate() {
    requestAnimationFrame(animate);

    if (autoRotate) {
        earthGroup.rotation.y += 0.001; // Velocidad de rotación
        stars.rotation.y -= 0.0005; // Fondo en dirección opuesta
    }

    // Audio / Detección Continente
    if (audioUnlocked) {
        const localPos = camera.position.clone();
        earthGroup.worldToLocal(localPos);
        localPos.normalize();

        const phi = Math.acos(localPos.y);
        const theta = Math.atan2(localPos.z, -localPos.x);

        let lat = 90 - (phi * 180 / Math.PI);
        let lon = (theta * 180 / Math.PI) - 180;

        while (lon < -180) lon += 360;
        while (lon > 180) lon -= 360;

        const continent = getContinent(lat, lon);
        continentSpan.textContent = continent;
        playContinent(continent);
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();
