import {LonelyVampire} from "./lonelyVampire";
require('../../css/main.css');

let lonelyVampire : LonelyVampire;

window.onload = () => {
    lonelyVampire  = new LonelyVampire();
    lonelyVampire.init();
    lonelyVampire.resize();
};

window.onresize = function() {
    lonelyVampire.resize();
};
