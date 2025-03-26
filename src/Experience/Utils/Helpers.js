import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Helpers {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene; 

        this.setGrid();
    }
    setGrid() {
        this.grid = new THREE.GridHelper(50, 50);
        this.scene.add(this.grid);
    }
}