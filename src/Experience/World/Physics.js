import * as CANNON from 'cannon-es';

export default class Physics {
    constructor() {

        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.81, 0);

        // Initialise empty array to hold objects that need physics applied
        this.objectsToUpdate = [];

        // Create default physics material
        this.defaultMaterial = new CANNON.Material("default");
        const contactMaterial = new CANNON.ContactMaterial(this.defaultMaterial, this.defaultMaterial, {
            friction: 0.1,
            restitution: 0.7, // Bounciness
        });

        this.world.addContactMaterial(contactMaterial);
    }
    
    addObject(physicsBody, threeMesh) {
        this.objectsToUpdate.push({physicsBody, threeMesh});
        this.world.addBody(physicsBody);
    }

    update(deltaTime) {
        // Update physics world time
        this.world.step(1 / 60, deltaTime, 3);

        // Sync physics bodies with THREE meshes
        for (const object of this.objectsToUpdate) {
            object.threeMesh.position.copy(object.physicsBody.position);
            object.threeMesh.quaternion.copy(object.physicsBody.quaternion);
        }
    }
}