import * as THREE from 'three';
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import Experience from '../Experience.js';

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources // access through Experience.js
        this.debug = this.experience.debug;

        //Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment');
        }

        // Call functions to add 
        this.setSunLight();
        this.setSkyBox();
        this.setEnvironmentMap();
        this.setEnvironment();
    }
    // Basic setup of directional light then adding to scene
    setSunLight() {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 2.4);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.set(2048, 2048);
        this.sunLight.shadow.camera.near = 0.01;
        this.sunLight.shadow.camera.far = 50;
        this.sunLight.shadow.camera.left = -50;
        this.sunLight.shadow.camera.right = 50;
        this.sunLight.shadow.camera.top = 50;
        this.sunLight.shadow.camera.bottom = -50;
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3, 4, 2.25);
        this.scene.add(this.sunLight);

                // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001);
            
            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLightX')
                .min(- 5)
                .max(5)
                .step(0.001);
            
            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLightY')
                .min(- 5)
                .max(5)
                .step(0.001);
            
            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLightZ')
                .min(- 5)
                .max(5)
                .step(0.001);
        }
    }

    setSkyBox() {
        this.skybox = {};
        this.skybox.intensity = 0;

        this.skybox.texture = this.resources.items.skyBoxTexture;
        if (!this.skybox.texture) {
            console.error("skyboxTexture is missing from resources");
            return;
        }

        this.skybox.texture.colorSpace = THREE.SRGBColorSpace;

        this.scene.background = this.skybox.texture;

        this.skybox.updateMaterial = () => {
            this.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.background = this.skybox.texture;
                    child.material.needsUpdate = true;
                }
            });
        }
        this.skybox.updateMaterial();
    }

    setEnvironmentMap() {
        this.environmentMap = {};
        this.environmentMap.intensity = 0.3;

        console.log('Checking loaded resources', this.resources.items);
        this.environmentMap.texture = this.resources.items.environmentMapTexture;
        if (!this.environmentMap.texture) {
            console.error("environmentMapTexture is missing from resources");
            return;
        }
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;

        this.scene.environment = this.environmentMap.texture;

        this.environmentMap.updateMaterial = () => {
            this.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity = this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            });
        }
        this.environmentMap.updateMaterial();

        if(this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(5)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterial);
        }
    }
    setEnvironment() {
        this.tree = this.resources.items.commonTree;
        this.bush = this.resources.items.bushModel;
        this.flowers = this.resources.items.flowersModel;
        this.grass = this.resources.items.grassModel;
        this.pine = this.resources.items.pineModel;
        this.plant1 = this.resources.items.plantModel1;
        this.plant2 = this.resources.items.plantModel2;
        this.rock1 = this.resources.items.rockMoss1;
        this.rock2 = this.resources.items.rockMoss2;
        this.rock3 = this.resources.items.rockMoss3;
        this.rock4 = this.resources.items.rockMoss4;
        this.stump = this.resources.items.stumpModel;
        this.log = this.resources.items.logModel;

        // Add models to array
        const models = [
        this.tree.scene,
        this.bush.scene,
        this.flowers.scene,
        this.grass.scene,
        this.pine.scene,
        this.plant1.scene,
        this.plant2.scene,
        this.rock1.scene,
        this.rock2.scene,
        this.rock3.scene,
        this.rock4.scene,
        this.stump.scene,
        this.log.scene
        ]
        // Scaling Models
        this.tree.scene.scale.set(2.8, 2.8, 2.8);
        this.pine.scene.scale.set(2.8, 2.8, 2.8);
        this.bush.scene.scale.set(1.5, 1.5, 1.5);
        this.rock1.scene.scale.set(2.8, 2.8, 2.8);
        this.rock2.scene.scale.set(2.8, 2.8, 2.8);
        this.rock3.scene.scale.set(2.8, 2.8, 2.8);
        this.rock4.scene.scale.set(2.8, 2.8, 2.8);
        this.stump.scene.scale.set(1.8, 1.8, 1.8);
        this.log.scene.scale.set(1.8, 1.8, 1.8);

        // Calling separate functions to better control quantity of certain assets in scene
        this.setTrees();
        this.setRocks();
        this.setMisc();
    }
    setTrees() {
        // Define the trees (tree & pine models)
        const treeModels = [
            this.tree.scene,
            this.pine.scene
        ];
    
        // Traverse through each tree model and set castShadow
        treeModels.forEach(model => {
            model.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });
        });
    
        // Spawn trees at random positions
        for (let i = 0; i < 80; i++) {  // You can change the number of trees
            const randomModel = treeModels[Math.floor(Math.random() * treeModels.length)];
            const object = randomModel.clone();
            const x = (Math.random() - 0.2) * 100;  // Random X position
            const z = (Math.random() - 0.5) * 100;  // Random Z position
    
            object.position.set(x, 0, z);  // Set Y to 0 for ground placement
            object.rotation.y = Math.random() * Math.PI * 2;  // Random Y-axis rotation
            this.scene.add(object);  // Add to the scene
        }
    }
    setRocks() {
        // Define the rocks models
        const rockModels = [
            this.rock1.scene,
            this.rock2.scene,
            this.rock3.scene,
            this.rock4.scene
        ];
    
        // Traverse through each rock model and set castShadow
        rockModels.forEach(model => {
            model.traverse(child => {
                if (child.isMesh) {
                    // child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        });

        for (let i = 0; i < 20; i++) {  // Adjust the number of rocks
            const randomModel = rockModels[Math.floor(Math.random() * rockModels.length)];
            const object = randomModel.clone();
            const x = (Math.random() - 0.5) * 100;  // Random X position
            const z = (Math.random() - 0.5) * 100;  // Random Z position
    
            object.position.set(x, 0, z);  // Set Y to 0 for ground placement
            object.rotation.y = Math.random() * Math.PI * 2;  // Random Y-axis rotation
            this.scene.add(object);  // Add to the scene
        }
    }

    setMisc() {
        // Define miscellaneous objects (bushes, flowers, etc.)
        const miscModels = [
            this.bush.scene,
            this.flowers.scene,
            this.grass.scene,
            this.plant1.scene,
            this.plant2.scene,
            this.stump.scene,
            this.log.scene
        ];
    
        // Traverse through each miscellaneous model and set castShadow
        miscModels.forEach(model => {
            model.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });
        });
    
        // Spawn miscellaneous objects at random positions
        for (let i = 0; i < 40; i++) {  // You can change the number of objects
            const randomModel = miscModels[Math.floor(Math.random() * miscModels.length)];
            const object = randomModel.clone();
            const x = (Math.random() - 0.5) * 100;  // Random X position
            const z = (Math.random() - 0.5) * 100;  // Random Z position
    
            object.position.set(x, 0, z);  // Set Y to 0 for ground placement
            object.rotation.y = Math.random() * Math.PI * 2;  // Random Y-axis rotation
            this.scene.add(object);  // Add to the scene
        }
    }
}