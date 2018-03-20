class PivotTable {

    //Logic to pivot the table or Flat the values of the table...
    constructor(data, argument) {

        this.passedValues = argument; // Passing the argument array to the this.passedValues variable

        this.pivotingField = []; // Defining an Array to filter the Unique fields in the selected column to pivot

        this.pivotingPrimaryField = []; //Defining an array to filter the Unique elements in the primary key column to pivot

        for (let i = 0; i < data.length; i++) {
            this.pivotingField.push((data[i])[argument[0]]);
        }

        this.list = this.pivotingField.filter((x, i, pivotingField) => this.pivotingField.indexOf(x) == i); // Array containing Unique Elements of the column Provided.

        this.list = this.list.sort(); // Sorting the pivoting column field

        // console.log("Unique elements in list: ", this.list);

        //Logic for Creating grid for pivoting Table:

        this.keys = Object.keys(data[0]); //Getting the keys of JSON object.

        //Logic to find the Border Width
        this.bw = ((this.keys.length - (argument.length - 1)) * 200) + (((argument.length - 2)) * (this.list.length) * 200); // Logic for calculating the Border width.

        //logic for finding unique element in the Primary key Column
        for (let i = 0; i < data.length; i++) {
            this.pivotingPrimaryField.push((data[i])[argument[(argument.length - 1)]]);
        }

        this.primaryList = this.pivotingPrimaryField.filter((x, i, pivotingPrimaryField) => this.pivotingPrimaryField.indexOf(x) == i); //Array Containing Unique Elements of the Primary key Provided

        // console.log("Unique elements in primary list: ", this.primaryList);
        // Logic for calculating the Border Height.
        this.bh = (this.primaryList.length + 2) * 40;

        this.p = 10; //Margin 

    }

    //fucntion to draw pivoted table on Canvas
    renderPivotTable(context, canvas, data) {

        let bw = this.bw;
        let bh = this.bh;
        const p = this.p;

        //to clear the Canvas the befor pivoting the table
        context.clearRect(10.5, 10, canvas.width, canvas.height)

        //Drawing rows on the table...
        for (let x = 0; x <= bw; x += 200) {
            context.moveTo(0.5 + x + p, p);
            context.lineTo(0.5 + x + p, bh + p);
        }

        //Drawing column on the table...
        for (let y = 0; y <= bh; y += 40) {
            context.moveTo(p, 0.5 + y + p);
            context.lineTo(bw + p, 0.5 + y + p);
        }

        context.strokeStyle = "black";
        context.stroke();

        //logic for rowSpan
        for (let z1 = 0, a = 0, b = 0, c = 0, d = 0; z1 < ((this.keys.length - 1) - (this.passedValues.length - 2)); z1++) {

            if (z1 == 0) {
                a = 11;
                b = 50;
                c = 199;
                d = 3;
            }
            context.clearRect(a, b, c, d)
            a += 200;
        }

        //logic for columnSpan
        for (let x1 = 0, a = 0, b = 0, c = 0, d = 0; x1 < this.passedValues.length - 2; x1++) {
            if (x1 == 0) {
                a = (((this.keys.length - 1) - (this.passedValues.length - 2)) * 200) + 200 + 10.5, b = 10.5, c = 3, d = 39.5;
            }
            for (let y1 = 0; y1 < this.list.length; y1++) {
                if (y1 == this.list.length - 1) {
                    a += 200;
                    break;
                }
                context.clearRect(a, b, c, d)
                a += 200;
            }
        }

        //logic to remove the extra boxes...
        context.clearRect(10.5, bh + 10.5, canvas.width, canvas.height);
        context.clearRect(bw + 11, 9.5, canvas.width, canvas.height);


        //logic to create header...
        //Removing column to pivot element from header
        let headerKeys = this.keys; //Storing the Keys of the objects in headerKeys Variable

        //Logic to remove the choosen column to be pivoted 
        for (let i1 = headerKeys.length - 1; i1--;) {
            if (headerKeys[i1] === this.passedValues[0]) headerKeys.splice(i1, 1);
        }


        for (var i1 = 1; i1 < this.passedValues.length - 1; i1++) {
            let index1 = headerKeys.indexOf(this.passedValues[i1]);
            headerKeys.splice(index1, 1);
        }

        for (var i1 = 1; i1 < this.passedValues.length - 1; i1++) {
            headerKeys.push(this.passedValues[i1]);
        }

        console.log("Header keys after removing Pivoting Column: ", headerKeys);

        //Logic to print the data into the table for the pivoting table...
        let pivotTableData = [];

        for (let h2 = 0; h2 < this.primaryList.length; h2++) {
            let tempDataArray = [];
            for (let h1 = 0; h1 < data.length; h1++) {
                if ((data[h1])[this.passedValues[this.passedValues.length - 1]] == this.primaryList[h2]) {
                    tempDataArray.push(data[h1]);
                }
            }

            tempDataArray = tempDataArray.sort();

            // console.log("TEMP. ARRAY DATA: ",tempDataArray);
    
            let temparray = tempDataArray;

            for (let h3 = 0; h3 < temparray.length; h3++) {
                let keyarr = [];
                for (let h4 = 0; h4 < this.passedValues.length - 1; h4++) {
                    console.log(temparray[h3][this.passedValues[h4]]);
                    keyarr.push(temparray[h3][this.passedValues[h4]]);
                    delete temparray[h3][this.passedValues[h4]];
                }

                console.log("keyarr: ",keyarr);

                for (let h5 = 1; h5 < keyarr.length; h5++) {
                    for (let h4 = 1; h4 < this.passedValues.length - 1; h4++) {
                        temparray[h3][this.passedValues[h4]] = keyarr[h4];
                    }
                }
            }

            pivotTableData.push(temparray);

        }

        // console.log("temp aRRAY dATA: ",pivotTableData);

        //Logic to print the data to the Canvas...

        //To print the value of the Table Excluding Header...

        let DataArray = [];
        for (let p1 = 0; p1 < pivotTableData.length; p1++) {

            var tempObj = {};
            for (let p2 = 0; p2 < pivotTableData[p1].length; p2++) {

                let arr = Object.keys(pivotTableData[p1][p2]).map(function (key) { return pivotTableData[p1][p2][key]; });
                let arrkeys = Object.keys(pivotTableData[p1][p2]);

                for (let count = 0; count < arr.length;) {
                    if (count < (headerKeys.length - (this.passedValues.length - 2))) {
                        tempObj[headerKeys[count]] = (arr)[count];
                        ++count;
                    }
                    else {

                        if (count == headerKeys.length) {
                            break;
                        }
                        if (typeof (tempObj[arrkeys[count]]) != 'object') {
                            tempObj[arrkeys[count]] = [];
                        }
                        tempObj[arrkeys[count]].push((arr)[count]);
                        ++count;
                    }
                }

            }
            DataArray.push(tempObj);
        }

        //To print the data into the pivot table...

        for (let y = 120, max = 0, count = 0; y <= bh; y += 40) {

            for (let x = 0, keyCount = 0; x < bw; x += 200) {

                context.font = "normal 16px tahoma";
                context.fillStyle = 'black';

                if (keyCount < (headerKeys.length - (this.passedValues.length - 2))) {
                    context.fillText((DataArray[count])[this.keys[keyCount]], 0.5 + x + 15, y);
                    ++keyCount;
                }
                else {

                    max = this.list.length;
                    for (let pd = 0; pd < max; pd++) {
                        if (((DataArray[count])[this.keys[keyCount]][pd]) == undefined || ((DataArray[count])[this.keys[keyCount]][pd]) == null || ((DataArray[count])[this.keys[keyCount]][pd]) == "") {
                            context.fillText("", 0.5 + x + 15, y);
                        }
                        else {
                            context.fillText(((DataArray[count])[this.keys[keyCount]][pd]), 0.5 + x + 15, y);
                        }
                        x += 200
                    }
                    x -= 200;
                    ++keyCount;
                }

            }
            ++count;
            if (count == DataArray.length) {
                break;
            }
        }

        //To Print the Header... 
        for (let x = 0, keyCount = 0; x <= bw; x += 200) {
            context.font = "bold 19px Verdana";
            context.fillStyle = 'black';
            if (keyCount < (headerKeys.length - (this.passedValues.length - 2))) {
                context.fillText(headerKeys[keyCount], 0.5 + x + 70, 60);
                ++keyCount;
            }
            else {
                if (keyCount == headerKeys.length) {
                    break;
                }
                else {
                    if (this.list.length == 1) {

                        // console.log(Math.ceil(list.length / 2));
                        context.fillText(headerKeys[keyCount], 0.5 + ((Math.ceil(this.list.length / 2)) * 200 + (x - 160.5)) + 15, 10 + 25);
                        ++keyCount
                        x = (Math.ceil(this.list.length / 2)) * 200 + (x - 160.5);
                        // console.log(keyCount);
                    }
                    else {

                        // console.log(Math.ceil(list.length / 2));
                        context.fillText(headerKeys[keyCount], 0.5 + ((Math.ceil(this.list.length / 2)) * 200 + (x - 160.5)) + 15, 10 + 25);
                        ++keyCount
                        x = (Math.ceil(this.list.length / 2)) * 200 + x;
                        // console.log(keyCount);
                    }
                }
            }
        }

        //to print the second line of header...
        for (let x = 0, keyCount = 0; x <= bw; x += 200) {
            context.font = "bold 19px Verdana";
            context.fillStyle = 'black';
            if (keyCount < (headerKeys.length - (this.passedValues.length - 2))) {

                ++keyCount;
            }
            else {
                if (keyCount == this.keys.length) {
                    break;
                }
                else {
                    var tempArr = this.list;
                    for (var i2 = 0; i2 < tempArr.length; i2++) {
                        context.fillText(tempArr[i2], 0.5 + x + 15, 10 + 25 + 40);
                        x += 200;
                    }
                    x -= 200;
                    ++keyCount;
                }
            }

        }

    }
}

export default PivotTable;