let grid = gridObject.create("canvasTable");

console.log("gridObject: ",grid);

grid.getData(`CITY,ZONE,PRODUCT,WEBVISIT,DOWNLOAD,COUNTRY
BLR,KOR,FC,92,96,IND
BLR,KOR,FB,98,97,IND
BLR,INDR,FC,15,196,IND
BLR,INDR,FB,78,98,IND
KOL,SL,FC,122,135,IND
KOL,SL,FB,55,78,IND`);
