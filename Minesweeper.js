var grid;

//Our cell object
function Cell(row,col,count)
{
    this.row = row;
    this.col = col;
    this.display = false;
    this.mine = false;
    this.count = count;
    this.td;
}
//Get a list of all adjacent cells to our cell. THis is a helper, and was very useful.
Cell.prototype.getAdjCells= function() {
    var adj = [];
    var lastRow = GArray.length - 1;
    var lastCol = GArray[0].length - 1;
    if (this.row > 0 && this.col > 0) adj.push(GArray[this.row - 1][this.col - 1]);
    if (this.row > 0) adj.push(GArray[this.row - 1][this.col]);
    if (this.row > 0 && this.col < lastCol) adj.push(GArray[this.row - 1][this.col + 1]);
    if (this.col < lastCol) adj.push(GArray[this.row][this.col + 1]);
    if (this.row < lastRow && this.col < lastCol) adj.push(GArray[this.row + 1][this.col + 1]);
    if (this.row < lastRow) adj.push(GArray[this.row + 1][this.col]);
    if (this.row < lastRow && this.col > 0) adj.push(GArray[this.row + 1][this.col - 1]);
    if (this.col > 0) adj.push(GArray[this.row][this.col - 1]);       
    return adj;
}
//Using the row and col values construct the ID required to access the button. Return 1 if not displayed, and 0 otherwise
Cell.prototype.Show = function()
{
    if(this.display == true)
    {
        if (this.mine == true)
        {
            this.td.style.background = "red"
            
            return 1
        }
        this.td.style.background = "white"
        this.td.innerHTML = this.count;
        return 1
    }
    return 0;
}
//Sets the button and the table data to the same spot. Connects the two.
Cell.prototype.Bind = function()
{
    this.td =  document.getElementById("grid").rows[this.row].cells[this.col];
}
var on;
var maxRow;
var maxCol;
var num_mines;
var GArray;
//Create a new game. New array of cells. 
function NewGame()
{
    on = true;
    maxRow = document.getElementById("rowR").value;
    maxCol = document.getElementById("colR").value;
    GArray = new Array(maxRow);
    for(var i = 0; i<maxRow; i++)
    {
        GArray[i] = new Array(maxCol);
    }
    for(var i = 0; i<maxRow; i++)
    {
        for(var j = 0; j<maxCol; j++)
        {
          GArray[i][j] = (new Cell(i,j,0))
        }
    }
    NewGrid();
    for(var i = 0; i<3;i++){

    
    if(document.getElementsByName("diff")[i].checked)
    {
        num_mines = document.getElementsByName("diff")[i].value
    }
}
    
    var mines = 0;
    while(mines<num_mines)
    {
        var tmp = RandomCell();
        if(tmp.mine == false)
        {
            tmp.mine = true;
            mines++;
        }
    }
    BindGrid();
    CountClose();

}

//Create the table of buttons
function NewGrid()
{
   
   grid.innerHTML = "";
 
   for(var i = 0; i<maxRow; i++)
   {
       row = grid.insertRow(i);
       row.style.height = (document.getElementById("GameGrid").clientHeight/maxRow)*0.9 + "px";
      
       
       for(var j = 0; j<maxCol; j++)
       {
           cell = row.insertCell(j);
           cell.style.width = (document.getElementById("GameGrid").clientWidth/maxCol)*0.9 + "px"
           cell.onclick = function(e){
               if(e.shiftKey)
               {
                   Check(this,1);}
                else{
                    Check(this,0);}
                }
       }
   } 
}



//Iterate through cell array showing everything 
function ShowGrid()
{
    for(var i = 0; i<maxRow; i++)
    {
        for(var j = 0; j<maxCol;j++)
        {
            GArray[i][j].Show();
            //if (GArray[i][j].display == true)
            //{
                //document.getElementById("grid").rows[i].cells[j].style.background = "blue"
            //}
        }
    }
    
}
//Iterate through cell array binding everything 
function BindGrid()
{
    for(var i = 0; i<maxRow; i++)
    {
        for(var j = 0; j<maxCol;j++)
        {
            GArray[i][j].Bind();
        }
    }
}
//Return cell object randomly chosen from within the area
function RandomCell()
{
    var r = Math.ceil(Math.random()*maxRow)-1;
    var c = Math.ceil(Math.random()*maxCol)-1;
    return GArray[r][c];
}
//Count Mines adjacent
function CountClose()
{
    for(var r = 0; r<maxRow; r++)
    {
        for(var c = 0; c<maxCol;c++)
        {
            var adj = GArray[r][c].getAdjCells();
            adj.forEach(function(cell){if(cell.mine) GArray[r][c].count++})
        }
    }
}

//Check the cell and those around it.Recursive
function Check(tCell,shift)
{
    if(!on) return;
    
    var r = tCell.parentElement.rowIndex
    var c = tCell.cellIndex;
    if(GArray[r][c].display == true)
    {
        return;
    }
    GArray[r][c].display = true;
    if(GArray[r][c].mine == true)
    {
        if(shift !=1)
        {
            on = false;
        }
        ShowGrid();
        return;
    }
    if(shift == 1)
    {
        on = false;
    }

    if(GArray[r][c].count === 0)
    {
        var adj = GArray[r][c].getAdjCells();
        adj.forEach(function(cell){if(!cell.display) Check(cell.td)})
    }
    ShowGrid();
    return;

    
   
    
}
//Occurs on load. Set our grid variable because we use it a lot. Set an event to our new game button
function Load()
{
    grid = document.getElementById("grid"); 
    document.getElementById("NG").addEventListener("click",function(){NewGame()})
   
}
window.onload = Load;