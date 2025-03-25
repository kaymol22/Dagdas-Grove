import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'; 

import EventEmitter from './EventEmitter.js';

export default class Resources extends EventEmitter {
    constructor(sources) 
    {
        super()
        
        this.sources = sources;

        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    // Set gltf, texture, cubetexture and draco loaders - can use them in startLoading()
    setLoaders() {
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.textureLoader = new THREE.TextureLoader();
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    }
    startLoading() {
        // Load each source and use appropriate loader
        for (const source of this.sources)
        {
            if (source.type == 'gltfModel')
            {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);
                    }
                )
            }
            else if(source.type == 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file);
                    }
                )
            }
            else if(source.type == 'cubeTexture')
            {
                this.loaders.cubeTextureLoader.load(
                    source.path, 
                    (file) =>
                    {
                        this.sourceLoaded(source, file);
                        console.log(source, file);
                    }
                )
            }
        }
    }
    // Call everytime a source is 'loaded'
    sourceLoaded(source, file) {
        this.items[source.name] = file;

        this.loaded++; // Positively increment loaded variable

        // Once all assets are loaded trigger event 
        if (this.loaded == this.toLoad) {
            console.log("Finished loading");
            this.trigger('ready');
        }
    }
}