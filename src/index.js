var gridTable = require('./grid.js');

( (window) => {
    "use strict";

    //Function to create a Grid.
    function myGrid() {

        let _gridObject = {};

        //Function to create a Grid.
        _gridObject.create = function (csv) {
                let gridObj = new gridTable(); //Constructor for creating new Grid 
                return gridObj;
        };
        return _gridObject;
    }

    // We need that our library is globally accesible, then we save in the window
    if (typeof (window.Grid) === 'undefined') {
        window.Grid = myGrid();
    }

})(window); // We send the window variable withing our function