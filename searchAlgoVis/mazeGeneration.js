rowMax = window.rowMax;
colMax = window.colMax;

function dfsMazeGeneration(vertices)
{
   v = vertices[0][0];
   v.el.className = "";
   var stack = [v];
   while(stack.length != 0)
   {
       var cur = stack.pop();
       var adj = getUnvisted(cur);
       if(adj.length != 0)
       {
           var rand1 = Math.floor(Math.random() * adj.length);
           var rand2 = Math.floor(Math.random() * adj.length);
           for(var i = 0; i<adj.length; i++)
           {
               adj[i].visited = true;
               if(i != rand1 && i != rand2)
               {
                stack.push(adj[i]);
               }
           }
           delayMazeVisit(10, adj[rand1]);
           delayMazeVisit(10, adj[rand2]);
           stack.push(adj[rand1]);
           stack.push(adj[rand2]);
           adj[rand1].isWall = false;
           adj[rand2].isWall = false;
       }
   }
} 

function aldous_broder(vertices)
{
    var randRow = Math.floor(Math.random() * rowMax);
    var randCol = Math.floor(Math.random() * colMax);
    var leftCells = rowMax * colMax - 1;

    var cur = vertices[randRow][randCol];
    cur.visited = true;
    
    while(leftCells > 0)
    {
        randAdj = cur.adj[Math.floor(Math.random() * cur.adj.length)];
        if(randAdj.visited == false)
        {
            let chance = Math.floor(Math.random() * 10)
            if(chance > 2)
            {
                randAdj.isWall = false;
                delayMazeVisit(10, randAdj);
            }
            randAdj.visited = true;
            leftCells--;
        }
        cur = randAdj;
    }
}
function vert(vertices)
{
    for(let c = 0; c < colMax; c++)
    {
        if(c%2 == 0)
            drawVWall(0, rowMax-1, c, vertices);
    }
    
}
function horz(vertices)
{
    for(let r = 0; r < rowMax; r++)
    {
        if(r%2 == 0)
            drawHWall(0, colMax-1, r, vertices);
    }
}
function drawHWall(minC, maxC, r, vertices)
{
    let rand = Math.floor(Math.random() * maxC);
    let rand2 = Math.floor(Math.random() * maxC);
    vertices[r][rand].notWall = true;
    vertices[r][rand2].notWall = true;
    for(let c = minC; c <= maxC; c++)
    {
        let v = vertices[r][c];
        if(v.notWall == false)
        {
            v.isWall = true;
            delayWall(10,v);
        }
    }
}
function drawVWall(minR, maxR, c, vertices)
{
    let rand = Math.floor(Math.random() * maxR);
    let rand2 = Math.floor(Math.random() * maxR);
    vertices[rand][c].notWall = true;
    vertices[rand2][c].notWall = true;
    for(let r = minR; r <= maxR; r++)
    {
        let v = vertices[r][c];
        if(v.notWall == false)
        {
            v.isWall = true;
            delayWall(10,v);
        }
    }
}

function markAdjVisisted(adj)
{
    for(let x in adj)
    {
        x.visited = true;
    }
}
function hasUnvisited(v)
{
    for(var i = 0; i < v.adj.length; i++)
    {
        if(v.adj[i].visited == false)
            return true;
    }
    return false;

}
function getUnvisted(v)
{
    var adj = [];
    for(var i = 0; i < v.adj.length; i++)
    {
        if(v.adj[i].visited == false)
            adj.push(v.adj[i]);
    }
    return adj;
}

function makeAllWalls(vertices)
{
    for(var r = 0; r < rowMax; r++)
    {
        for(var c = 0; c < colMax; c++)
        {
            vertices[r][c].isWall = true; 
            vertices[r][c].visited = false;
            vertices[r][c].el.className = "clicked";
            vertices[r][c].weights = 0;
            vertices[r][c].el.innerHTML = "";

        }
    }
}
function delayMazeVisit(time, u)
{
    delayed(time, function(u) 
        {
            return function() 
            {
                u.el.className = "";
            };
        }(u));
}

function delayWall(time, u)
{
    delayed(time, function(u) 
        {
            return function() 
            {
                u.el.className = "clicked";
            };
        }(u));
}