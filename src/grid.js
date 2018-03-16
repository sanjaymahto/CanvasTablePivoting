
// A base class is defined using the new reserved 'class' keyword
module.exports = class Grid {

    // This function will contain all code related to Grid...
    createGrid(csv) {

        //Flag to deny the access to changeHeader or ChangeData if Table is Pivoted
        this.flag = 0;

        //Defining an array to save the state
        let previousStateArray = [];
        // let csvData = `CITY,ZONE,PRODUCT,WEBVISIT,DOWNLOAD
        // BLR,KOR,FC,92,96,
        // BLR,KOR,FB,98,97,
        // BLR,INDR,FC,192,196,
        // BLR,INDR,FB,78,98,
        // KOL,SL,FC,122,135,
        // KOL,SL,FB,123,112`;

        let csvData = csv;

        //Logic to convert CSV to JSON Format....
        this.CSVToArray = function (strData, strDelimiter) {
            // Check to see if the delimiter is defined. If not,
            // then default to comma.
            strDelimiter = (strDelimiter || ",");
            // Create a regular expression to parse the CSV values.
            var objPattern = new RegExp((
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
            // Create an array to hold our data. Give the array
            // a default empty first row.
            var arrData = [[]];
            // Create an array to hold our individual pattern
            // matching groups.
            var arrMatches = null;
            // Keep looping over the regular expression matches
            // until we can no longer find a match.
            while (arrMatches = objPattern.exec(strData)) {
                // Get the delimiter that was found.
                var strMatchedDelimiter = arrMatches[1];
                // Check to see if the given delimiter has a length
                // (is not the start of string) and if it matches
                // field delimiter. If id does not, then we know
                // that this delimiter is a row delimiter.
                if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                    // Since we have reached a new row of data,
                    // add an empty row to our data array.
                    arrData.push([]);
                }
                // Now that we have our delimiter out of the way,
                // let's check to see which kind of value we
                // captured (quoted or unquoted).
                if (arrMatches[2]) {
                    // We found a quoted value. When we capture
                    // this value, unescape any double quotes.
                    var strMatchedValue = arrMatches[2].replace(
                        new RegExp("\"\"", "g"), "\"");
                } else {
                    // We found a non-quoted value.
                    var strMatchedValue = arrMatches[3];
                }
                // Now that we have our value string, let's add
                // it to the data array.
                arrData[arrData.length - 1].push(strMatchedValue);
            }
            // Return the parsed data.
            return (arrData);
        }

        this.CSV2JSON = function (csvData) {
            var array = this.CSVToArray(csvData);
            var objArray = [];
            for (var i = 1; i < array.length; i++) {
                objArray[i - 1] = {};
                for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                    var key = array[0][k];
                    objArray[i - 1][key] = array[i][k]
                }
            }

            var json = JSON.stringify(objArray);
            var str = json.replace(/},/g, "},\r\n");

            return str;
        }
        //End of logic to convert CSV to JSON Format...

        this.data = JSON.parse(this.CSV2JSON(csvData)); //Contains JSON converted Data from CSV

        // console.log("JSON converted Data from CSV: ",this.data);

        // Obtaining a reference to the canvas element.
        var canvas = document.getElementById("canvasTable");

        // Obtaining a 2D context from the canvas element.
        var context = canvas.getContext("2d");

        //to control the transparency of the table
        context.globalAlpha = 0.8;

        //Logic to create a table
        let bw = (Object.keys(this.data[0]).length) * 200; //Calculating Border Width
        let bh = (this.data.length + 1) * 40; // Calculating Border Height
        var p = 10; //margin

        //Function to draw table from JSON data...
        this.drawBoard = function () {

            //To clear the canvas before drawing or redrawing the Table
            context.clearRect(0, 0, canvas.width, canvas.height);

            // console.log("Border Width before Pivoting: ",bw);
            // console.log("Border Height before pivoting: ",bh);

            //Drawing rows outline on the table...
            for (var x = 0; x <= bw; x += 200) {
                context.moveTo(0.5 + x + p, p);
                context.lineTo(0.5 + x + p, bh + p);
            }

            //Drawing column outline on the table...
            for (var x = 0; x <= bh; x += 40) {
                context.moveTo(p, 0.5 + x + p);
                context.lineTo(bw + p, 0.5 + x + p);
            }

            var linearGradient2 = context.createLinearGradient(125, 0, 225, 0);
            linearGradient2.addColorStop(0, 'rgb(255, 0,   0)');
            linearGradient2.addColorStop(0.5, 'rgb(  0, 0, 255)');
            linearGradient2.addColorStop(1, 'rgb(  0, 0,   0)');

            context.lineJoin = "round";

            context.strokeStyle = linearGradient2;
            context.stroke();

            // //Setting properties for the border lines in the table drawn
            // context.strokeStyle = "black";
            // context.stroke();

            let count; // Setting variable for counting the rows 

            let keys = Object.keys(this.data[0]); // finding keys in each JSON object

            // console.log("Total keys in each JSON object: ",keys);

            //To print the values of the Table Excluding Header...
            for (let y = 80, count = 0; y <= bh; y += 40) {

                for (let x = 0, keyCount = 0; x < bw; x += 200) {
                    context.font = "normal 16px Verdana";
                    context.fillStyle = 'black';
                    context.fillText((this.data[count])[keys[keyCount]], 0.5 + x + p + 5, y);
                    ++keyCount;
                }
                ++count;
            }

            //To Print the Header... 
            for (let x = 0, keyCount = 0; x < bw; x += 200) {
                context.font = "bold 16px Verdana";
                context.fillStyle = 'black';
                context.fillText(keys[keyCount], 0.5 + x + p + 5, p + 25);
                ++keyCount;
            }

            //To clear extra rows and table in the column in canvas when table restructures.
            context.clearRect(11, bh + 11, canvas.width, canvas.height)
            context.clearRect(bw + 11, 9.5, canvas.width, canvas.height)

        }
        this.drawBoard(); //Function call to draw the canvas on screen.

        //To change the Property of Header
        this.changeHeader = function (font = "normal", pixel = "16px", family = "tahoma", color = "black", align = "left") {

            if (this.flag == 0) {

                //Finding keys in each JSON
                let keys = Object.keys(this.data[0]);

                for (let x = 0, keyCount = 0; x < bw; x += 200) {
                    context.textAlign = `${align}`;
                    context.font = `${font} ${pixel} ${family}`;
                    context.fillStyle = `${color}`;
                    context.clearRect(0.5 + x + p + 5, p, 200, 40);
                    context.fillText(keys[keyCount], 0.5 + x + p + 5, p + 25);
                    ++keyCount;
                }

                //Drawing rows on the table...
                for (var x = 0; x <= bw; x += 200) {
                    context.moveTo(0.5 + x + p, p);
                    context.lineTo(0.5 + x + p, bh + p);
                }

                //Drawing column on the table...
                for (var x = 0; x <= bh; x += 40) {
                    context.moveTo(p, 0.5 + x + p);
                    context.lineTo(bw + p, 0.5 + x + p);
                }
                context.strokeStyle = "black";
                context.stroke();

            }
            else {
                return "Table has been pivoted"
            }
        }

        //to change the Property of data values of Table...
        this.changeData = function (font = "normal", pixel = "16px", family = "tahoma", color = "black", align = "left") {

            if (this.flag == 0) {
                let count;
                let keys = Object.keys(this.data[0]);
                console.log(keys);
                for (let y = 40, count = 0; y < bh; y += 40) {

                    for (let x = 0, keyCount = 0; x < bw; x += 200) {
                        context.textAlign = `${align}`
                        context.font = `${font} ${pixel} ${family}`;
                        context.fillStyle = `${color}`;
                        context.clearRect(0.5 + x + p + 5, y, 200, 40); // clears a text field 200 x 40, above baseline
                        context.fillText((this.data[count])[keys[keyCount]], 0.5 + x + p + 5, y + 40);
                        ++keyCount;

                    }
                    ++count;
                }

                //Drawing rows on the table...
                for (var x = 0; x <= bw; x += 200) {
                    context.moveTo(0.5 + x + p, p);
                    context.lineTo(0.5 + x + p, bh + p);
                }

                //Drawing column on the table...
                for (var x = 0; x <= bh; x += 40) {
                    context.moveTo(p, 0.5 + x + p);
                    context.lineTo(bw + p, 0.5 + x + p);
                }
                context.strokeStyle = "black";
                context.stroke();

            }
            else {
                return "Table has been Pivoted!"
            }
        }


        //Logic to pivot the table or Flat the values of the table...
        this.pivotTable = function () {

            //Setting flag to stop Changing the property of Header and Data Values...
            this.flag = 1;

            if (arguments.length < 3) {
                return "please pass all the arguments";
            }
            else {
                let passedValues = arguments; // Passing the arguments array to the passedValues variable

                let pivotingField = []; // Defining an Array to filter the Unique fields in the selected column to pivot

                let pivotingOtherField = []; //Defining an array to filter the Unique elements in the primary key column to pivot

                for (var i = 0; i < this.data.length; i++) {
                    pivotingField.push((this.data[i])[arguments[0]])
                }
                let list = pivotingField.filter((x, i, pivotingField) => pivotingField.indexOf(x) == i); // Array containing Unique Elements of the column Provided.

                list = list.sort(); // Sorting the pivoting column field

                //Logic for Creating grid for pivoting Table:

                let keys = Object.keys(this.data[0]); //Getting the keys of JSON object.

                //Logic to find the Border Width
                var bw = ((keys.length - (arguments.length - 1)) * 200) + (((arguments.length - 2)) * (list.length) * 200); // Logic for calculating the Border width.

                //logic for finding unique element in the Primary key Column
                for (var i = 0; i < this.data.length; i++) {
                    pivotingOtherField.push((this.data[i])[arguments[(arguments.length - 1)]]);
                }

                let list1 = pivotingOtherField.filter((x, i, pivotingOtherField) => pivotingOtherField.indexOf(x) == i); //Array Containing Unique Elements of the Primary key Provided

                // Logic for calculating the Border Height.
                var bh = (list1.length + 2) * 40;

                var p = 10; //Margin 

                //fucntion to draw pivoted table on Canvas
                this.drawPivotBoard = function () {

                    context.clearRect(10.5, 10, canvas.width, canvas.height)

                    //Drawing rows on the table...
                    for (var x = 0; x <= bw; x += 200) {

                        context.moveTo(0.5 + x + p, p);
                        context.lineTo(0.5 + x + p, bh + p);

                    }

                    //Drawing column on the table...
                    for (var x = 0; x <= bh; x += 40) {

                        context.moveTo(p, 0.5 + x + p);
                        context.lineTo(bw + p, 0.5 + x + p);

                    }
                    context.strokeStyle = "black";
                    context.stroke();

                    // let keys1 = Object.keys(this.data[0]);

                    //logic for rowSpan
                    for (let z1 = 0; z1 < ((keys.length - 1) - (passedValues.length - 2)); z1++) {
                        if (z1 == 0) {
                            var a = 11, b = 50, c = 199, d = 3;
                        }
                        context.clearRect(a, b, c, d)
                        a += 200;
                    }

                    //logic for columnSpan
                    for (let x1 = 0; x1 < passedValues.length - 2; x1++) {
                        var a;
                        if (x1 == 0) {
                            a = (((keys.length - 1) - (passedValues.length - 2)) * 200) + 200 + 10.5, b = 10.5, c = 3, d = 39.5;
                        }
                        for (let y1 = 0; y1 < list.length; y1++) {
                            if (y1 == list.length - 1) {
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
                    let headerKeys = keys; //Storing the Keys of the objects in headerKeys Variable

                    //Logic to remove the choosen column to be pivoted 
                    for (var i1 = headerKeys.length - 1; i1--;) {
                        if (headerKeys[i1] === passedValues[0]) headerKeys.splice(i1, 1);
                    }

                    for (var i1 = 1; i1 < passedValues.length - 1; i1++) {
                        console.log(passedValues[i1]);
                        let index1 = headerKeys.indexOf(passedValues[i1]);
                        headerKeys.splice(index1, 1);
                    }

                    for (var i1 = 1; i1 < passedValues.length - 1; i1++) {
                        headerKeys.push(passedValues[i1]);
                    }
                    console.log(headerKeys);

                    //Logic to print the data into the table for the pivoting table...
                    let pivotTableData = [];

                    for (let h2 = 0; h2 < list1.length; h2++) {
                        let tempDataArray = [];
                        for (let h1 = 0; h1 < this.data.length; h1++) {

                            if ((this.data[h1])[passedValues[passedValues.length - 1]] == list1[h2]) {
                                // delete this.data[h1][passedValues[0]];
                                tempDataArray.push(this.data[h1]);
                            }
                        }
                        tempDataArray = tempDataArray.sort(function (a, b) {
                            // console.log(a[passedValues[0]]);
                            // console.log(b[passedValues[0]]);
                            var nameA = a[passedValues[0]].toLowerCase(), nameB = b[passedValues[0]].toLowerCase()
                            if (nameA < nameB) //sort string ascending
                                return -1
                            if (nameA > nameB)
                                return 1
                            return 0
                        });

                        let temparray = tempDataArray;
                        for (let h3 = 0; h3 < temparray.length; h3++) {
                            let keyarr = [];
                            for (let h4 = 0; h4 < passedValues.length - 1; h4++) {
                                keyarr.push(temparray[h3][passedValues[h4]]);
                                delete temparray[h3][passedValues[h4]];
                            }
                            // console.log(keyarr);
                            for (let h5 = 1; h5 < keyarr.length; h5++) {
                                for (let h4 = 1; h4 < passedValues.length - 1; h4++) {
                                    temparray[h3][passedValues[h4]] = keyarr[h5];
                                }
                            }
                        }

                        pivotTableData.push(temparray);

                    }
                    console.log("aggregated data: ", pivotTableData);

                    //Logic to print the data to the Canvas...

                    //To print the value of the Table Excluding Header...

                    var DataArray = [];
                    for (let p1 = 0; p1 < pivotTableData.length; p1++) {

                        var tempObj = {};
                        for (let p2 = 0; p2 < pivotTableData[p1].length; p2++) {
                            // console.log(pivotTableData[p1][p2]);
                            var arr = Object.keys(pivotTableData[p1][p2]).map(function (key) { return pivotTableData[p1][p2][key]; });
                            var arrkeys = Object.keys(pivotTableData[p1][p2]);
                            console.log("array: ", arr);
                            for (var count = 0; count < arr.length;) {
                                if (count < (headerKeys.length - (passedValues.length - 2))) {
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
                                    console.log(((arr)[count]));
                                    ++count;

                                }
                            }

                        }
                        DataArray.push(tempObj);
                    }
                    // console.log("Pivot Table Data Array: ", DataArray);

                    //To print the data into the pivot table...

                    for (let y = 120, max = 0, count = 0; y <= bh; y += 40) {

                        for (let x = 0, keyCount = 0; x < bw; x += 200) {

                            context.font = "normal 16px tahoma";
                            context.fillStyle = 'black';

                            if (keyCount < (headerKeys.length - (passedValues.length - 2))) {
                                context.fillText((DataArray[count])[keys[keyCount]], 0.5 + x + 15, y);
                                ++keyCount;
                            }
                            else {

                                max = list.length;
                                for (let pd = 0; pd < max; pd++) {
                                    if (((DataArray[count])[keys[keyCount]][pd]) == undefined || ((DataArray[count])[keys[keyCount]][pd]) == null || ((DataArray[count])[keys[keyCount]][pd]) == "") {
                                        context.fillText("", 0.5 + x + 15, y);
                                    }
                                    else {
                                        context.fillText(((DataArray[count])[keys[keyCount]][pd]), 0.5 + x + 15, y);
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
                        if (keyCount < (headerKeys.length - (passedValues.length - 2))) {
                            context.fillText(headerKeys[keyCount], 0.5 + x + 70, 60);
                            ++keyCount;
                        }
                        else {
                            if (keyCount == headerKeys.length) {
                                break;
                            }
                            else {
                                if (list.length == 1) {

                                    // console.log(Math.ceil(list.length / 2));
                                    context.fillText(headerKeys[keyCount], 0.5 + ((Math.ceil(list.length / 2)) * 200 + (x - 160.5)) + 15, 10 + 25);
                                    ++keyCount
                                    x = (Math.ceil(list.length / 2)) * 200 + (x - 160.5);
                                    // console.log(keyCount);
                                }
                                else {

                                    // console.log(Math.ceil(list.length / 2));
                                    context.fillText(headerKeys[keyCount], 0.5 + ((Math.ceil(list.length / 2)) * 200 + (x - 160.5)) + 15, 10 + 25);
                                    ++keyCount
                                    x = (Math.ceil(list.length / 2)) * 200 + x;
                                    // console.log(keyCount);
                                }
                            }
                        }
                    }

                    //to print the second line of header...
                    for (let x = 0, keyCount = 0; x <= bw; x += 200) {
                        context.font = "bold 19px Verdana";
                        context.fillStyle = 'black';
                        if (keyCount < (headerKeys.length - (passedValues.length - 2))) {

                            ++keyCount;
                        }
                        else {
                            if (keyCount == keys.length) {
                                break;
                            }
                            else {
                                var tempArr = list;
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
                this.drawPivotBoard();
            }
            return true;
        }

        //Logic to span the column or row
        this.columnSpan = function (column, spanRange) {

            if (this.flag == 0 && spanRange > 1 && column <= Object.keys(this.data[0]).length) {
                //Function to draw table from JSON data...
                this.drawBoard = function () {
                    var span = spanRange;
                    bw = (Object.keys(this.data[0]).length) * 200 + 200 * (span - 1); //Calculating Border Width

                    let bh = (this.data.length + 1) * 40; // Calculating Border Height
                    var p = 10; //margin
                    console.log(canvas.width);
                    console.log(canvas.height);
                    //To clear the canvas before drawing or redrawing the Table
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    //Drawing rows outline on the table...
                    for (var x = 0; x <= bw; x += 200) {
                        context.moveTo(0.5 + x + p, p);
                        context.lineTo(0.5 + x + p, bh + p);
                    }


                    //Drawing column outline on the table...
                    for (var x = 0; x <= bh; x += 40) {
                        context.moveTo(p, 0.5 + x + p);
                        context.lineTo(bw + p, 0.5 + x + p);
                    }
                    //Setting properties for the border lines in the table drawn
                    context.strokeStyle = "black";
                    context.stroke();


                    //logic for columnSpan

                    for (let y1 = 0; y1 < (span - 1); y1++) {
                        var a, b, c, d;
                        if (y1 == 0) {
                            a = column * 200 + p + .5;
                            b = 11;
                            c = .5;
                            d = bh - 1;
                        }
                        context.clearRect(a, b, c, d)
                        a += 200;
                    }


                    let count; // Setting variable for counting the rows 

                    let keys = Object.keys(this.data[0]); // finding keys in each JSON object

                    // console.log("Total keys in each JSON object: ",keys);

                    //To print the values of the Table Excluding Header...
                    for (let y = 80, count = 0; y <= bh; y += 40) {

                        for (let x = 0, keyCount = 0; x < bw; x += 200) {
                            context.font = "normal 16px Verdana";
                            context.fillStyle = 'black';
                            if (keyCount == (column - 1)) {
                                context.fillText((this.data[count])[keys[keyCount]], 0.5 + x + p + 5, y);
                                ++keyCount;
                                x += ((spanRange) * 200)
                            }
                            context.fillText((this.data[count])[keys[keyCount]], 0.5 + x + p + 5, y);
                            ++keyCount;
                        }
                        ++count;
                    }

                    //To Print the Header... 
                    for (let x = 0, keyCount = 0; x < bw; x += 200) {
                        context.font = "bold 16px Verdana";
                        context.fillStyle = 'black';
                        if (keyCount == (column - 1)) {
                            context.fillText(keys[keyCount], 0.5 + x + p + 5, p + 25);
                            ++keyCount;
                            x += ((spanRange - 1) * 200)
                        }
                        else {
                            context.fillText(keys[keyCount], 0.5 + x + p + 5, p + 25);
                            ++keyCount;
                        }
                    }

                    console.log("bh bw:", bh, bw)
                    //To clear extra rows and table in the column in canvas when table restructures.
                    context.clearRect(10, bh + 11, canvas.width, canvas.height)
                    context.clearRect(bw + 11, 9.5, canvas.width, canvas.height)

                }
                this.drawBoard(); //Function call to draw the canvas on screen.

            }
        }

        //Logic to span the Column or row
        this.rowsSpan = function (row, spanRange) {
            if (this.flag == 0 && spanRange > 1 && row <= this.data.length) {
                //Function to draw table from JSON data...
                this.drawBoard = function () {
                    var span = spanRange;
                    bh = (this.data.length + 1) * 40 + 40 * (span - 1); // Calculating Border Height
                    bw = (Object.keys(this.data[0]).length) * 200; //Calculating Border Width
                    var p = 10; //margin
                    console.log(canvas.width);
                    console.log(canvas.height);
                    //To clear the canvas before drawing or redrawing the Table
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    //Drawing rows outline on the table...
                    for (var x = 0; x <= bw; x += 200) {
                        context.moveTo(0.5 + x + p, p);
                        context.lineTo(0.5 + x + p, bh + p);
                    }

                    //Drawing column outline on the table...
                    for (var x = 0; x <= bh; x += 40) {
                        context.moveTo(p, 0.5 + x + p);
                        context.lineTo(bw + p, 0.5 + x + p);
                    }
                    //Setting properties for the border lines in the table drawn
                    context.strokeStyle = "black";
                    context.stroke();


                    //logic for columnSpan

                    for (let y1 = 0; y1 < (span - 1); y1++) {
                        var a, b, c, d;
                        for (let y2 = 0; y2 <= bw; y2 += 200) {

                            if (y1 == 0) {
                                a = 11;
                                b = (row + 1) * 40 + p;
                                c = y2 - 1;
                                d = .5;
                            }
                            context.clearRect(a, b, c, d)

                        }
                        b += 40;
                    }


                    let count; // Setting variable for counting the rows 

                    let keys = Object.keys(this.data[0]); // finding keys in each JSON object

                    // console.log("Total keys in each JSON object: ",keys);

                    //To print the values of the Table Excluding Header...
                    for (let y = 80, count = 0; y <= bh; y += 40) {

                        for (let x = 0, keyCount = 0; x < bw; x += 200) {
                            context.font = "normal 16px Verdana";
                            context.fillStyle = 'black';
                            if (count == (row - 1)) {
                                context.fillText((this.data[count])[keys[keyCount]], 0.5 + x + p + 5, y + 40 * ((spanRange - 1) / 2));
                            }
                            else {
                                context.fillText((this.data[count])[keys[keyCount]], 0.5 + x + p + 5, y);
                            }
                            ++keyCount;
                        }

                        if (count == (row - 1)) {
                            y += ((spanRange - 1) * 40)
                        }

                        ++count;
                    }

                    //To Print the Header... 
                    for (let x = 0, keyCount = 0; x < bw; x += 200) {
                        context.font = "bold 16px Verdana";
                        context.fillStyle = 'black';
                        context.fillText(keys[keyCount], 0.5 + x + p + 5, p + 25);
                        ++keyCount;

                    }

                    console.log("bh bw:", bh, bw)
                    //To clear extra rows and table in the column in canvas when table restructures.
                    context.clearRect(10, bh + 11, canvas.width, canvas.height)
                    context.clearRect(bw + 11, 9.5, canvas.width, canvas.height)

                }
                this.drawBoard(); //Function call to draw the canvas on screen.

            }
        }

        //Logic to Merge Row
        this.mergeRow = function (column, startRow, endRow) {

            //to get the previous states...
            let stateArray = JSON.parse(sessionStorage.getItem("previousState"));
            console.log("Previous State array: ", stateArray);

            let stateFlag = 0;

            if (stateArray != null) {
                for (let stateIndex = 0; stateIndex < stateArray.length; stateIndex++) {

                    if (stateArray[stateIndex]["column"] == column) {

                        if (startRow >= stateArray[stateIndex]["startRow"] && startRow <= stateArray[stateIndex]["endRow"]) {
                            stateFlag = 2;
                            alert("Invalid argument passed!")
                            break;
                        }
                        else {
                            if (endRow >= stateArray[stateIndex]["startRow"] && endRow <= stateArray[stateIndex]["endRow"]) {
                                stateFlag = 2;
                                alert("Invalid argument passed!")
                                break;
                            }
                        }
                    }
                }

                if (stateFlag == 0) {
                    stateFlag = 1;
                }
            }
            else {
                stateFlag = 1;
            }

            if (this.flag == 0 && stateFlag == 1 && column <= this.data.length && endRow > startRow && startRow != endRow) {

                //Function to restore the Canavas... 
                context.restore();

                //Function to draw table from JSON data...
                this.drawBoard = function () {

                    console.log("Canvas Width: ", canvas.width);
                    console.log("Canvas Height: ", canvas.height);

                    //logic for rowSpan

                    for (let y2 = 0, count = 0; y2 <= bh; y2 += 40) {
                        var a, b, c, d;

                        if (count == (endRow - startRow)) {
                            break;
                        }
                        if (y2 == 0) {
                            a = (column - 1) * 200 + 11;
                            b = (startRow + 1) * 40 + p;
                            c = 199;
                            d = 1;
                        }
                        context.clearRect(a, b, c, d)
                        b += 40;
                        ++count;
                    }

                    let count; // Setting variable for counting the rows 

                    let keys = Object.keys(this.data[0]); // finding keys in each JSON object

                    // console.log("Total keys in each JSON object: ",keys);

                    // //To print the values of the Table Excluding Header...
                    for (let y = 80, count = 0; y <= bh; y += 40) {

                        for (let x = 0, keyCount = 0; x < bw; x += 200) {
                            context.font = "normal 16px Verdana";
                            context.fillStyle = 'black';
                            if ((keyCount + 1) == column && count < endRow && count + 1 > startRow) {

                                context.clearRect((column - 1) * 200 + 11, (startRow) * 40 + 11, 199, (39 + (endRow - startRow) * 40));
                                context.fillText((this.data[startRow - 1])[keys[keyCount]], 0.5 + x + p + 5, (startRow + 1) * 40 + 40 * ((endRow - startRow) / 2));

                            }
                            // else {
                            //     context.fillText((this.data[count])[keys[keyCount]], 0.5 + x + p + 5, y);
                            // }
                            ++keyCount;
                        }
                        ++count;
                    }

                    console.log("bh bw:", bh, bw)
                    //To clear extra rows and table in the column in canvas when table restructures.
                    context.clearRect(10, bh + 11, canvas.width, canvas.height)
                    context.clearRect(bw + 11, 9.5, canvas.width, canvas.height)

                    context.save();

                    let state = {
                        "column": column,
                        "startRow": startRow,
                        "endRow": endRow
                    }

                    previousStateArray.push(state);

                    sessionStorage.setItem("previousState", JSON.stringify(previousStateArray));

                }
                this.drawBoard(); //Function call to draw the canvas on screen.

            }

        }

        //Logic to merge the column
        this.mergeColumn = function (row, startColumn, endColumn) {

            if (this.flag == 0 && row <= this.data.length + 1 && endColumn > startColumn && startColumn != endColumn) {
                //Function to draw table from JSON data...
                this.drawBoard = function () {

                    console.log("Canvas Width: ", canvas.width);
                    console.log("Canvas Height: ", canvas.height);

                    //To clear the canvas before drawing or redrawing the Table
                    context.clearRect(0, 0, canvas.width, canvas.height);

                    //Drawing rows outline on the table...
                    for (var x = 0; x <= bw; x += 200) {
                        context.moveTo(0.5 + x + p, p);
                        context.lineTo(0.5 + x + p, bh + p);
                    }

                    //Drawing column outline on the table...
                    for (var x = 0; x <= bh; x += 40) {
                        context.moveTo(p, 0.5 + x + p);
                        context.lineTo(bw + p, 0.5 + x + p);
                    }

                    //Setting properties for the border lines in the table drawn
                    context.strokeStyle = "black";
                    context.stroke();

                    //logic for rowSpan
                    for (let y2 = 0, count = 0; y2 <= bw; y2 += 200) {
                        var a, b, c, d;

                        if (count == (endColumn - startColumn)) {

                            break;
                        }
                        if (y2 == 0) {
                            a = (startColumn) * 200 + p;
                            b = (row - 1) * 40 + 11;
                            c = 2;
                            d = 39;
                        }
                        context.clearRect(a, b, c, d)
                        a += 200;
                        ++count;
                    }

                    let count; // Setting variable for counting the rows 

                    let keys = Object.keys(this.data[0]); // finding keys in each JSON object

                    // console.log("Total keys in each JSON object: ",keys);

                    //To Print the Header... 
                    for (let x = 0, keyCount = 0; x < bw; x += 200) {
                        context.font = "bold 16px Verdana";
                        context.fillStyle = 'black';
                        if (row == 1) {
                            if (keyCount + 1 >= startColumn && keyCount < endColumn) {
                                context.clearRect((row - 1) * 40 + 11, (startColumn) * 200 + 11, (endColumn) * 199, 39);
                                context.fillText(keys[startColumn - 1], (startColumn * 200 + (Math.floor((endColumn - startColumn) / 2)) * 200) - 100, 40 - 5);
                            }
                            else {
                                context.fillText(keys[keyCount], 0.5 + x + p + 5, p + 25);
                            }
                        }
                        else {
                            context.fillText(keys[keyCount], 0.5 + x + p + 5, p + 25);
                        }
                        ++keyCount;

                    }


                    //To print the values of the Table Excluding Header...
                    for (let y = 80, count = 0; y <= bh; y += 40) {

                        for (let x = 0, keyCount = 0; x < bw; x += 200) {
                            context.font = "normal 16px Verdana";
                            context.fillStyle = 'black';
                            if (count + 2 == row) {
                                if (keyCount + 1 >= startColumn && keyCount < endColumn) {
                                    context.clearRect((row - 1) * 40 + 11, (startColumn) * 200 + 11, (endColumn) * 199, 39);
                                    context.fillText(this.data[row - 2][keys[startColumn - 1]], (startColumn * 200 + (Math.floor((endColumn - startColumn) / 2)) * 200) - 100, y - 5);
                                }
                                else {
                                    context.fillText((this.data[count])[keys[keyCount]], 0.5 + x + p + 5, y);
                                }
                            }
                            else {
                                context.fillText((this.data[count])[keys[keyCount]], 0.5 + x + p + 5, y);
                            }
                            ++keyCount;
                        }
                        ++count;
                    }



                    console.log("bh bw:", bh, bw)
                    //To clear extra rows and table in the column in canvas when table restructures.
                    context.clearRect(10, bh + 11, canvas.width, canvas.height)
                    context.clearRect(bw + 11, 9.5, canvas.width, canvas.height)

                    context.save();

                }
                this.drawBoard(); //Function call to draw the canvas on screen.

            }

        }

        return true;
    }

};