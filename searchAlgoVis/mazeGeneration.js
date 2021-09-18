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
               if(i != rand1 && 1 != rand2)
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