var colMax = 20;
var rowMax = 20;
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
           var rand = Math.floor(Math.random() * adj.length);
           for(var i = 0; i<adj.length; i++)
           {
               adj[i].visited = true;
               if(i != rand)
               {
                stack.push(adj[i]);
               }
           }
           stack.push(adj[rand]);
           adj[rand].el.className = "";
           adj[rand].isWall = false;
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
            vertices[r][c].el.className = "clicked"
        }
    }
}
