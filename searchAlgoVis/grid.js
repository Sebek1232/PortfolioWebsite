var walls = new Map();
var vertices = [];
var isStart = false;
var isEnd = false;
var lastStart;
var lastEnd;
var startCord = [];
var endCord = [];
var curAlgoType;
var curAlgo;
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

var grid = clickableGrid(20,20,function(el,row,col,i){
    
    setStartClass(el, row, col);
    setEndClass(el, row, col);
    
    if(isStart == false && isEnd == false)
    {
        el.className='clicked';
        vertices[row][col].isWall = true;
    }

    if(walls.has(el))
    {
        el.className="";
        vertices[row][col].isWall = false;
        walls.delete(el);
    }
    else
        walls.set(el, [row,col]);
});
function setStartClass(el, row, col)
{
    
    if(lastStart == el && isStart)
    {
        vertices[row][col].isStart = false;
        lastStart.className = "";
        startCord = [];
    }

    else if(isStart)
    {
        vertices[row][col].isStart = true;
        el.className= "start";
        lastStart = el;
        startCord = [row, col];
    }
    
}

function setEndClass(el, row, col)
{
    
    if(lastEnd == el && isEnd)
    {
        vertices[row][col].isEnd = false;
        lastEnd.className = "";
        endCord = [];
    }

    else if(isEnd)
    {
        vertices[row][col].isEnd = true;
        el.className= "end";
        lastEnd = el;
        endCord = [row, col];
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
    for(var r = 0; r < rowMax; r++)
    {
        for(var c = 0; c < colMax; c++)
        {
            startCord = [];
            endCord = [];
            lastEnd = undefined;
            lastStart = undefined;
            vertices[r][c].visited = false; 
            vertices[r][c].el.className = " ";
        }
    }
}

window.startCell = function()
{
    isStart = !isStart;
}

window.endCell = function()
{
    isEnd = !isEnd;
}
window.traverse = function()
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
window.bfsBut = function() 
{
    updateTravBar("bfs");
    curAlgoType = "trav";
    curAlgo = "bfs";
}
window.dfsBut = function() 
{
    updateTravBar("dfs");
    curAlgoType = "trav";
    curAlgo = "dfs";
}
window.dijkBut = function() 
{
    updateSearchBar("Dijkstra's");
    curAlgoType = "search";
    curAlgo = "dijk";
}
window.aStarBut = function() 
{
    updateSearchBar("A*");
    curAlgoType = "search";
    curAlgo = "aStar";
}
window.addWeight = function()
{
    for(var r = 0; r < rowMax; r++)
    {
        for(var c = 0; c < colMax; c++)
        {
            if(r%2 == 0 && c%2 == 0)
            {
                vertices[r][c].el.innerHTML = "$$$";
            }
            else 
            {
                var weight = Math.ceil(Math.random() * 5);
                vertices[r][c].weight = weight;
                vertices[r][c].el.innerHTML = weight;
            }
        }
    }
}



document.onload = fillAdj(vertices);

document.body.appendChild(grid);