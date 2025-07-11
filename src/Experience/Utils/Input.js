export default class Input {
    constructor() {
        this.initKeyboardListeners();
    }
    
    initKeyboardListeners() {
        this.keys = {
            forward: false, 
            backward: false, 
            left: false, 
            right: false,
            space: false,
            shift: false,
        };
        window.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        window.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case 87: // w 
                this.keys.forward = true;
                break;
            case 65: // a
                this.keys.left = true;
                break;
            case 83: // s
                this.keys.backward = true;
                break;
            case 68: // d
                this.keys.right = true;
                break;
            case 32: // Space
                this.keys.space = true;
                break;
            case 16: // Shift
                this.keys.shift = true;
                break;
            case 69: // e (shapeshift)
                this.keys.shapeshift = true;
                break;
        }
    }
    onKeyUp(event) {
        switch (event.keyCode) {
            case 87: // w 
                this.keys.forward = false;
                break;
            case 65: // a
                this.keys.left = false;
                break;
            case 83: // s
                this.keys.backward = false;
                break;
            case 68: // d
                this.keys.right = false;
                break;
            case 32: // Space
                this.keys.space = false;
                break;
            case 16: // Shift
                this.keys.shift = false;
                break;
            case 69: // e (shapeshift)
                this.keys.shapeshift = false;
                break;
        }
    }
}