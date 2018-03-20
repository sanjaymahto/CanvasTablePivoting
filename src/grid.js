import DataLoader from './data-loader.js';
import drawBoard from './table-grid.js';
import PivotTable from './pivot-table.js';
import mergerow from './merge-row.js';
import mergecol from './merge-column.js';
import { observable, Reaction, autorun } from 'mobx';

class Grid {

    //initialising contructor for class Grid
    constructor(canvasId) {

        //Initialising a flag to stop the user form re-pivoting if once pivoted the Table.
        this.pivotFlag = 0;

        //Initialising a flag to stpo the user from pivoting if rowa and columns are merged.
        this.mergeFlag = 0;

        //Initializing data array
        this.data = [];

        //Defining an array to save the state of Row
        this.previousStateArray = [];

        //Defining an array to save the state of Column
        this.previousColumnStateArray = [];

        // Obtaining a reference to the canvas element.
        this.canvas = document.getElementById(canvasId);

        // Obtaining a 2D context from the canvas element.
        this.context = this.canvas.getContext("2d");

        //to control the transparency of the table
        this.context.globalAlpha = 1; // can be change later on by passing the parameter by User.

    }

    //to convert the  CSV Data into JSON
    getData(csv) {

        //Creating new object of Dataloader class
        const jsonData = new DataLoader();

        console.log("JSON data Object: ", jsonData);

        //Contains JSON converted Data from CSV
        observable(this.data = JSON.parse(jsonData.CSV2JSON(csv)));

        //AutoRun in Mobx
        autorun(() => this.render());

    }

    //to render table in Canvas
    render() {

        console.log("JSON converted Data from CSV: ", this.data);

        //pivot flag variable
        this.pivotFlag = 0;

        //merge Flag variable
        this.mergeFlag = 0;

        //Logic to create a table
        const bw = (Object.keys(this.data[0]).length) * 200; //Calculating Border Width
        const bh = (this.data.length + 1) * 40; // Calculating Border Height
        const p = 10; //margin

        //calling drawBoard function.
        drawBoard(this.context, this.canvas, bw, bh, p, this.data)

        //To save the context of Canvas into Stack.
        this.context.save();

        return "Grid Table created";
    }

    //to pivot the table in Canvas
    pivot(...params) {

        if (this.pivotFlag == 0 && this.mergeFlag == 0) {
            if (params.length < 3) {
                return "Please pass all the required Arguments"
            }
            else {

                //Instantiating object for Pivoting table
                let pivot = new PivotTable(this.data, params);

                //calling renderPivotTable function from pivot object
                pivot.renderPivotTable(this.context, this.canvas, this.data);

                //pivot flag variable
                this.pivotFlag = 1;

                return "Grid table Pivoted";
            }
        }
        else {
            return "Sorry! you have already pivoted the Table or have merged the columns or rows. Please Rerender the Original table to Pivot Again."
        }

    }

    //to merge Rows...
    mergeRow(...rowParams) {

        if (this.pivotFlag == 0) {
            if (rowParams.length < 3) {
                return "Please pass all the required Arguments"
            }
            else {

                this.mergeFlag = 1;
                const bw = (Object.keys(this.data[0]).length) * 200; //Calculating Border Width
                const bh = (this.data.length + 1) * 40; // Calculating Border Height
                const p = 10; //margin

                observable(rowParams)

                autorun(() => mergerow(rowParams[0], rowParams[1], rowParams[2], bh, bw, p, this.context, this.canvas, this.data, this.previousStateArray)
                )

            }
        }
        else {
            return "Sorry! you have already pivoted the Table. Please Rerender the Original table to Merge Rows."
        }


    }

    //to merge Columns...
    mergeColumn(...colParams) {

        if (this.pivotFlag == 0) {
            if (colParams.length < 3) {
                return "Please pass all the required Arguments"
            }
            else {

                this.mergeFlag = 1;
                const bw = (Object.keys(this.data[0]).length) * 200; //Calculating Border Width
                const bh = (this.data.length + 1) * 40; // Calculating Border Height
                const p = 10; //margin

                observable(colParams)

                autorun(() => mergecol(colParams[0], colParams[1], colParams[2], bh, bw, p, this.context, this.canvas, this.data, this.previousColumnStateArray)
                )

            }
        }
        else {
            return "Sorry! you have already pivoted the Table. Please Rerender the Original table to Merge Columns."
        }


    }
}

export default Grid;