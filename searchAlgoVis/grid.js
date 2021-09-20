var walls = new Map();
var vertices = [];
var lastStart;
var lastEnd; 
var startCord = [0,0];
var endCord = [23,29];
var curAlgoType;
var curAlgo;
var rowMax = 24;
var colMax = 32;
function clickableGrid( rows, cols, callback ){
    var i=0;
    var grid = document.createElement('table');
    grid.className = 'grid';
    for (var r=0;r<rows;++r)
    {
        var tr = grid.appendChild(document.createElement('tr'));
        vertices[r] = [];
        for (var c=0;c<cols;++c)
        {
            var cell = tr.appendChild(document.createElement('td'));
            if(r==0 && c==0)
            {
                cell.className = "start";
                lastStart = cell;
            }
            if(r==23 && c==29)
            {
                cell.className = "end";
                lastEnd = cell;
            }
            var ver = new Vertex(r,c,cell);
            vertices[r][c] = ver;

            cell.addEventListener('click',(function(el,r,c,i){
                return function(){
                    callback(el,r,c,i);
                }
            })(cell,r,c,i),false);
        }
    }
    return grid;
}

var grid = clickableGrid(rowMax,colMax,function(el,row,col,i){
    var startCheck = document.getElementById("start");
    var endCheck = document.getElementById("end");
    if(startCheck.checked)
        setStartClass(el, row, col);
    else if(endCheck.checked)
        setEndClass(el, row, col);
    else
    {
        el.className="clicked";
        vertices[row][col].isWall = true;
        el.innerHTML="";
        vertices[row][col].weight = 0;
        if(walls.has(el))
        {
            el.className="";
            vertices[row][col].isWall = false;
            walls.delete(el);
        }
        else
            walls.set(el, [row,col]);
    }
    
});
function setStartClass(el, row, col)
{
    vertices[row][col].isStart = true;
    el.className = "start";
    startCord = [row, col];
    if(lastStart != el)
    {
        lastStart.className = "";
        lastStart = el;
    }
}

function setEndClass(el, row, col)
{
    vertices[row][col].isEnd = true;
    el.className = "end";
    endCord = [row, col];
    if(lastEnd != el)
    {
        lastEnd.className = "";
        lastEnd = el;
    }
}
function updateTravBar(algo)
{
    var menu = document.getElementById("travDrop");
    menu.innerHTML = algo;
}
function updateSearchBar(algo)
{
    var menu = document.getElementById("searchDrop");
    menu.innerHTML = algo;
}

window.clear = function()
{
    startCord = [0,0];
    endCord = [23,29];
    for(var r = 0; r < rowMax; r++)
    {
        for(var c = 0; c < colMax; c++)
        {
            if(r==0 && c==0)
            {
                lastStart = vertices[r][c].el;
                vertices[r][c].el.className = "start";
            }
            else if(r==23 && c==29)
            {
                lastEnd = vertices[r][c].el;
                vertices[r][c].el.className = "end";
            }
            else
            {
                vertices[r][c].visited = false; 
                vertices[r][c].el.className = " ";
            }
        }
    }
}

window.startCell = function()
{
    var endCheck = document.getElementById("end");
    endCheck.checked = false;
}

window.endCell = function()
{
    var startCheck = document.getElementById("start")
    startCheck.checked = false; 
}
window.startTraverse = function()
{
    if(curAlgoType == "trav")
    {
        if(curAlgo == "bfs")
            bfs(vertices, vertices[startCord[0]][startCord[1]]);
        else if(curAlgo == "dfs")
        {
            unVisitVertices(vertices);
            dfs(vertices, vertices[startCord[0]][startCord[1]]);
        }
    }

    else if(curAlgoType == "search")
    {
        if(curAlgo == "dijk")
            dijkstra(vertices, vertices[startCord[0]][startCord[1]], vertices[endCord[0]][endCord[1]]);
        else if(curAlgo == "aStar")
            aStar(vertices[startCord[0]][startCord[1]], vertices[endCord[0]][endCord[1]]);
    }
}
window.dfsMaze = function()
{
    makeAllWalls(vertices);
    dfsMazeGeneration(vertices);
}
window.a_bMaze = function()
{
    makeAllWalls(vertices);
    aldous_broder(vertices);
}
window.vertical = function()
{
    vert(vertices);
}
window.horizontal = function()
{
    horz(vertices);
}
window.bfsBut = function() 
{
    updateTravBar("bfs");
    updateSearchBar("Search Algorithim");
    curAlgoType = "trav";
    curAlgo = "bfs";
    enableStart()
}
window.dfsBut = function() 
{
    updateTravBar("dfs");
    updateSearchBar("Search Algorithim");
    curAlgoType = "trav";
    curAlgo = "dfs";
    enableStart()
}
window.dijkBut = function() 
{
    updateSearchBar("Dijkstra's");
    updateTravBar("Traversal Algorithim");
    curAlgoType = "search";
    curAlgo = "dijk";
    enableStart()
}
window.aStarBut = function() 
{
    updateSearchBar("A*");
    updateTravBar("Traversal Algorithim");
    curAlgoType = "search";
    curAlgo = "aStar";
    enableStart()
}
window.addWeight = function()
{
    for(var r = 0; r < rowMax; r++)
    {
        for(var c = 0; c < colMax; c++)
        {
          if(vertices[r][c].isWall == false)
            {
                var weight = Math.ceil(Math.random() * 5);
                vertices[r][c].weight = weight;
                vertices[r][c].el.innerHTML = weight;
            }
        }
    }
}

function enableStart()
{
    var start = document.getElementById("startBut");
    start.disabled = false;
}


document.onload = fillAdj(vertices);

document.body.appendChild(grid);