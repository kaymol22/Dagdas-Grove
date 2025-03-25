import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Renderer {
    constructor() 
    {
        this.experience = new Experience(); // Retrieve instance of experience instead of creating new (Singleton)
        // Can then retrieve sizes, scene, canvas + camera from experience class
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;

        this.setInstance();
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.instance.toneMapping = THREE.CineonToneMapping;
        this.instance.toneMappingExposure = 1.75;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
        this.instance.setClearColor('#1d1f2a');
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio); // use already calculated pixelRatio from Sizes.js
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        this.instance.render(this.scene, this. camera.instance);
    }
}