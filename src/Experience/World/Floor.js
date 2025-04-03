import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Floor {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setMesh();
    }
    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(500, 500, 10, 10);
    }
    setTextures() {
        this.textures = {};

        this.textures.color = this.resources.items.forestColorTexture;
        this.textures.color.colorSpace = THREE.SRGBColorSpace;
        this.textures.color.repeat.set(30, 30);
        this.textures.color.wrapS = THREE.RepeatWrapping;
        this.textures.color.wrapT = THREE.RepeatWrapping;

        this.textures.normal = this.resources.items.forestNormalTexture;
        this.textures.normal.repeat.set(30, 30);
        this.textures.normal.wrapS = THREE.RepeatWrapping;
        this.textures.normal.wrapT = THREE.RepeatWrapping;
    }
    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({ 
            map: this.textures.color,
            normalMap: this.textures.normal
        });
    }
    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = Math.PI * -0.5;
        this.mesh.receiveShadow = true;
        this.mesh.position.set(0, 0, 0);
        this.scene.add(this.mesh);
    }
}