import EventEmmiter from './EventEmitter.js'

export default class Sizes extends EventEmmiter{
    constructor() {

        super()
        // Setup 
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // Event listener for resizing
        window.addEventListener('resize', () =>
            {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                this.pixelRatio = Math.min(window.devicePixelRatio, 2);
                this.trigger('resize');
            })
    }
}