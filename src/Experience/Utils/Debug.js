import GUI from 'lil-gui';

export default class Default {
    constructor() {
        this.active = window.location.hash == "#debug"; // only enable debug when URL followed by '#debug'

        if(this.active)
        {
            this.ui = new GUI();
        }
    }
}