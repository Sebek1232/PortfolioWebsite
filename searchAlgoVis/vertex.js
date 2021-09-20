rowMax = window.rowMax;
colMax = window.colMax;
startCord = window.startCord;
endCord = window.endCord;
class Vertex
{
    constructor(row, col, el)
    {
        this.row = row;
        this.col = col;
        this.el = el; 
        this.adj = [];
        this.weight = 0;
        this.visited = false;
        this.isWall = false;
        this.isStart = false;
        this.isEnd = false;
        this.isCity = false;
        this.notWall = false;
    }
}
function fillAdj(vertices)
{
    for(var r = 0; r < rowMax; r++)
    {
        for(var c = 0; c < colMax; c++)
        {
            if(!vertices[r][c].isWall)
            {
                if(r== 0 && c == 0)
                    vertices[r][c].adj = [vertices[r][c+1], vertices[r+1][c]];
                else if(r == rowMax-1 && c == 0)
                    vertices[r][c].adj = [vertices[r][c+1], vertices[r-1][c]];
                else if(r == 0 && c == colMax-1)
                    vertices[r][c].adj = [vertices[r][c-1], vertices[r+1][c]];
                else if(r == rowMax-1 && c == colMax-1)
                    vertices[r][c].adj = [vertices[r][c-1], vertices[r-1][c]];
                else if(r == 0 && (c != 0 || c != colMax-1)) 
                    vertices[r][c].adj = [vertices[r][c+1], vertices[r][c-1], vertices[r+1][c]];
                else if(r == rowMax-1 && (c != 0 || c != colMax-1))
                    vertices[r][c].adj = [vertices[r][c+1], vertices[r][c-1], vertices[r-1][c]];
                else if(r > 0 && r < rowMax-1 && c == 0)
                    vertices[r][c].adj = [vertices[r+1][c], vertices[r][c+1], vertices[r-1][c]];
                else if((r != 0 || r != colMax-1) && c == colMax-1)
                    vertices[r][c].adj = [vertices[r+1][c], vertices[r][c-1], vertices[r-1][c]];
                else 
                    vertices[r][c].adj = [vertices[r+1][c], vertices[r][c-1], vertices[r-1][c], vertices[r][c+1]];
            }
        }
    }
}

function traverseAllVertices(vertices)
{

    for (var i = 0; i < rowMax; i += 1) 
    {
        for (var j = 0; j < colMax; j += 1) 
        {
            delayed(10, function(i, j) 
            {
                return function() 
                {
                    vertices[i][j].el.className = "visited";
                };
            }(i, j));
        }
    }
}
function bfs(vertices, start)
{
    var queue = [];
    unVisitVertices(vertices);
    queue.push(start);
    while(queue.length != 0)
    {
        var u = queue.shift();
        delayVisit(10, u);
        for(var i = 0; i < u.adj.length; i++)
        {
            if(u.adj[i].visited == false && u.adj[i].isWall == false)
            {
                var row = u.adj[i].row;
                var col = u.adj[i].col;
                vertices[row][col].visited = true;
                queue.push(u.adj[i]);
            }
        }
        u.visited = true;
    }
}

function dfs(vertices, v)
{
    v.visited = true;
    delayVisit(10, v);
    for(var i = 0; i < v.adj.length; i++)
    {
        var next = vertices[v.adj[i].row][v.adj[i].col];
        if(next.visited == false && next.isWall == false)
            dfs(vertices, vertices[v.adj[i].row][v.adj[i].col]);
    }
}

function dijkstra(vertices, start, end)
{
    var q = new Set();
    var s = [];
    var dist = [];
    var prev = [];
    var found = false;

    for(var r = 0; r<rowMax; r++)
    {
        dist[r] = [];
        prev[r] = [];
        for(var c = 0; c<colMax; c++)
        {
            dist[r][c] = Infinity;
            prev[r][c] = undefined;
            if(vertices[r][c].isWall == false) 
                q.add(vertices[r][c]);
        }
    }
    dist[start.row][start.col] = 0;
    while(q.size != 0)
    {
            
        var u = getCordOfMinInQ(dist, q)[0];
        delayVisit(10, u);
        q.delete(u);
        if(u == end)
        {
            found = true;
            u = end; 
            if(prev[u.row][u.col] != undefined || u == start)
            {
                while(u != undefined)
                {
                    s.unshift(u);
                    u = prev[u.row][u.col];
                }
            }
            break;
        }
        for(var i = 0; i<u.adj.length; i++)
        {
            if(q.has(u.adj[i]))
            {
                var alt = dist[u.row][u.col] + u.adj[i].weight;
                if(u.adj[i].weight == 0)
                    alt++
                if(alt < dist[u.adj[i].row][u.adj[i].col])
                {
                    dist[u.adj[i].row][u.adj[i].col] = alt;
                    prev[u.adj[i].row][u.adj[i].col] = u;
                } 
            }
        }
    }
    if(found)
        getPath(s);
}


function getCordOfMinInQ(dist, q)
{
    var keyMin = [new Vertex(), Infinity]; 
    q.forEach(key => keyMin = getMin(key, dist, keyMin));
    return keyMin;
}
function getMin(key, dist, keyMin)
{
    if(dist[key.row][key.col] < keyMin[1])
        return [key, dist[key.row][key.col]];
    else
        return keyMin;

}
function getPath(s)
{
    for(var i = 0; i<s.length; i++)
    {
        var u = s[i];
        delayPath(50, u);
    }
}

function aStar(start, end)
{
    var openSet = new Set();
    var cameFrom = new Map(); 
    var gScore = [];
    var fScore = [];
    var path = [];

    for(var r = 0; r<rowMax; r++)
    {
        gScore[r] = [];
        fScore[r] = [];
        for(var c = 0; c<colMax; c++)
        {
            gScore[r][c] = Infinity;
            gScore[r][c] = Infinity;
        }
    }
    fScore[start.row][start.col] = h(start, end);
    gScore[start.row][start.col] = 0;
    openSet.add(start);
    while(openSet.size != 0)
    {
        var u = getCordOfMinInQ(fScore, openSet)[0];
        delayVisit(10, u);
        if( u == end)
        {
            path = makePath(cameFrom, u);
            break;
        }
        openSet.delete(u);
        for(var i = 0; i<u.adj.length; i++)
        {
            if(u.adj[i].isWall == false)
            {
                var tentGscore = gScore[u.row][u.col] + u.adj[i].weight;
                if(tentGscore < gScore[u.adj[i].row][u.adj[i].col])
                {
                    cameFrom.set(u.adj[i], u);
                    gScore[u.adj[i].row][u.adj[i].col] = tentGscore;
                    fScore[u.adj[i].row][u.adj[i].col] = tentGscore + h(u.adj[i], end);
                    if(!openSet.has(u.adj[i]))
                        openSet.add(u.adj[i]);
                }
            } 
        }
    }
    getPath(path);
}

function h(cur, end)
{
    return (Math.abs(cur.row - end.row) + Math.abs(cur.row - end.row));
}
function makePath(cameFrom, u)
{
    var cur = u;
    var path = [cur];
    while(cameFrom.has(cur))
    {
        cur = cameFrom.get(cur);
        path.unshift(cur);
    }
    
    return path;
}


function unVisitVertices(vertices)
{
    
    for (var i = 0; i < rowMax; i += 1) 
    {
        for (var j = 0; j < colMax; j += 1) 
        {
            vertices[i][j].visited = false;
        }
    }
}
function delayVisit(time, u)
{
    delayed(time, function(u) 
        {
            return function() 
            {
                u.el.className = "visited";
            };
        }(u));
}
function delayPath(time, u)
{
    delayed(time, function(u) 
        {
            return function() 
            {
                u.el.className = "path";
            };
        }(u));
}
var delayed = (function() {
    var queue = [];
    
    function processQueue() {
    if (queue.length > 0) {
        setTimeout(function () {
            
        queue.shift().cb();
        processQueue();
        }, queue[0].delay);
    }
    }
    
    return function delayed(delay, cb) {
        queue.push({ delay: delay, cb: cb });
    
        if (queue.length === 1) {
          processQueue();
        }
      };
  }());