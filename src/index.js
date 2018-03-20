
import Grid from './grid.js';
import { spy, observable, Reaction } from 'mobx';

((window) => {
    "use strict";

    //Function to create a Grid.
    function myGrid() {

        let _gridObject = {};

        let gridObj;
        //Function to create a Grid.
        _gridObject.create = function (canvasId) {
            gridObj = new Grid(canvasId); //Constructor for creating new Grid 
            return gridObj;
        };

        //SPY in mobx
        spy(function (spyReport) {
            if (spyReport.type) {
                console.log(spyReport.type + ': ', spyReport);
            }
        });

        return _gridObject;
    }

    // We need that our library is globally accesible, then we save in the window
    if (typeof (window.gridObject) === 'undefined') {
        window.gridObject = myGrid();
    }

})(window); // We send the window variable withing our function