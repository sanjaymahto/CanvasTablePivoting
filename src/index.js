// var gridTable = require('./grid.js');
import gridTable from './grid.js'

((window) => {
    "use strict";

    //Function to create a Grid.
    function myGrid() {

        let _gridObject = {};

        var gridObj;
        //Function to create a Grid.
        _gridObject.create = function (csv) {
             gridObj = new gridTable(); //Constructor for creating new Grid 
            mobx.observable(gridObj);
            mobx.observable(gridObj.createGrid(`CITY,ZONE,PRODUCT,WEBVISIT,DOWNLOAD
            BLR,KOR,FC,92,96,
            BLR,KOR,FB,98,97,
            BLR,KOR,FM,67,56,
            BLR,INDR,FC,192,196,
            BLR,INDR,FB,78,98,
            BLR,INDR,FM,12,43,
            KOL,SL,FC,122,135,
            KOL,SL,FB,123,112
            KOL,SL,FM,55,78`));
            mobx.observable(gridObj.pivotTable("PRODUCT","DOWNLOAD","WEBVISIT","ZONE"));
            return gridObj;
        };

         //SPY in mobx
         mobx.spy(function (spyReport) {
            if (spyReport.type) {
                console.log(spyReport.type + ': ', spyReport);
            }
        });
        
        return _gridObject;
    }

    // We need that our library is globally accesible, then we save in the window
    if (typeof (window.Grid) === 'undefined') {
        window.Grid = myGrid();
    }

})(window); // We send the window variable withing our function