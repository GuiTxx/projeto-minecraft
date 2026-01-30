import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


gsap.registerPlugin(ScrollTrigger);

// SCENE SETUP

const cenaAbelha = new THREE.Scene();
const cenaSteve = new THREE.Scene();

// CAMERA SETUP

const cameraAbelha = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
cameraAbelha.position.z = 10;

const cameraSteve = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
cameraSteve.position.z = 10;

//  RENDERIZADORES -> WEBGL

const renderizadorAbelha = new THREE.WebGLRenderer({ alpha: true});
renderizadorAbelha.setSize(window.innerWidth, window.innerHeight);
document.querySelector(".abelha").appendChild(renderizadorAbelha.domElement)

const renderizadorSteve = new THREE.WebGLRenderer({ alpha: true});
renderizadorSteve.setSize(window.innerWidth, window.innerHeight);
document.querySelector(".steve").appendChild(renderizadorSteve.domElement)


// ILUMINAÇÃO
const luzAmbienteAbelha = new THREE.AmbientLight("white", 1);
const luzDirecionalAbelha = new THREE.DirectionalLight("white", 10);
luzDirecionalAbelha.position.x = -3;
luzDirecionalAbelha.position.y = -3;
cenaAbelha.add(luzAmbienteAbelha, luzDirecionalAbelha);

const luzAmbienteSteve = new THREE.AmbientLight("white", 1);
const luzDirecionalSteve = new THREE.DirectionalLight("white", 10);
luzDirecionalSteve.position.x = -3;
luzDirecionalSteve.position.y = -3;
cenaSteve.add(luzAmbienteSteve, luzDirecionalSteve);

// IMPORTAR ABELHA
let abelha;
let mixer;
const loader = new GLTFLoader();
loader.load("assets/animation/bee.glb", (abelhaObjeto) => {
    abelha = abelhaObjeto.scene;
    const abelhaAnimacao = abelhaObjeto.animations[0];

    // MIXER DE VIDEO, CONTROLE DE ANIMAÇÃO
    mixer = new THREE.AnimationMixer(abelha);
    mixer.clipAction(abelhaAnimacao).play();


    cenaAbelha.add(abelha);
    abelha.position.z = -49
    abelha.position.x = 16
    abelha.position.y = -6.6
    abelha.rotation.y = 2.7
    rotacionarAbelha();
})

// IMPORTANDO O STEVE
let steve;
loader.load("assets/animation/steve.glb", (steveObjeto) => {
    steve = steveObjeto.scene;
    cenaSteve.add(steve);
    steve.position.z = -27
    steve.position.y = -18
})

// TRACKING DO MOUSE
const mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function steveOlharCursor() {
    if (!steve) return;
    const alvoY = mouse.x * 0.6;
    steve.rotation.y += (alvoY - steve.rotation.y) * 0.08;
}

function rotacionarAbelha(){
    gsap.to(abelha.position, {
        x: -9,
        z: 0,
        y: 4,
        duration: 3,
        scrollTrigger:{
            trigger: ".divAbelha",
            start: "0% 0%",
            end: "100% 50%",
            scrub: 3,
        }

    })
}


// ANIMAR ABELHA
// VARIA A DEPENDER DO HZ DO MONITOR, ELA PODE SER CHAMADA mais VEZES POR SEGUNDO

function animar(){
    mixer?.update(0.01);
    steveOlharCursor();
    requestAnimationFrame(animar);
    renderizadorAbelha.render(cenaAbelha, cameraAbelha);
    renderizadorSteve.render(cenaSteve, cameraSteve);
}

animar()