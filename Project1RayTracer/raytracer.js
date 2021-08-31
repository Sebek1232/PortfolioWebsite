var scene = getDataArray();
var maxDepth = 5;
var background_color = [190/255, 210/255, 215/255];
var ambientToggle = true;
var diffuseToggle = true;
var specularToggle = true;
var reflectionToggle = true;
var bias = 0.001;
var depth = 1;
var lightPos;
var camPos;

class Ray {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }
}

class Intersection {
    constructor(distance, point) {
        this.distance = distance;
        this.point = point;
    }
}

class Hit {
    constructor(intersection, object) {
        this.intersection = intersection;
        this.object = object;
    }
}

/*
    Intersect objects
*/
function raySphereIntersection(ray, sphere) {
    var center = sphere.center;
    var radius = sphere.radius;

    // Compute intersection

    // If there is a intersection, return a new Intersection object with the distance and intersection point:
    // E.g., return new Intersection(t, point);
    var a = dot(ray.direction, ray.direction);
    var b = dot(mult(ray.direction, 2), sub(ray.origin, center));
    var c = dot(sub(ray.origin, center), sub(ray.origin, center)) - (radius * radius);

    var discr = b * b - 4 * a * c;
    var t1 = (-b - Math.sqrt(discr)) / (2 * a);
    var t2 = (-b + Math.sqrt(discr)) / (2 * a);
    var t;

    if (t1 < t2) t = t1;
    if(t < bias)
    {
        t = t2;
        if(t < bias) return null;
    }

    if(discr < 0) return null;
    else
    {
        var point = add(ray.origin, mult(ray.direction, t));
        return new Intersection(t, point);
    }

    // If no intersection, return null
}

function rayPlaneIntersection(ray, plane) {

    // Compute intersection
    var center = plane.center;
    var normal = plane.normal;

    // If there is a intersection, return a dictionary with the distance and intersection point:
    // E.g., return new Intersection(t, point);
    var den = dot(normal, ray.direction);
    if(den == 0) return null;
    var t = dot(sub(center, ray.origin), normal) / den;
    if(t < bias) return null; 
    var point = add(ray.origin, mult(ray.direction, t));
    return new Intersection(t, point);

}

function intersectObjects(ray, depth) {


    // Loop through all objects, compute their intersection (based on object type and calling the previous two functions)
    // Return a new Hit object, with the closest intersection and closest object
    var closestDist = Infinity;
    var closestInter = null;
    var closestObject = null;
    for(var i = 0; i < scene.objects.length; i++)
    {
        var object = scene.objects[i];
        if(object.type == "sphere")
        {
            var intersection = raySphereIntersection(ray, object);
            if(intersection != null && intersection.distance < closestDist)
            {
                closestDist = intersection.distance;
                closestInter = intersection;
                closestObject = object;
            }
            
        }
        if(object.type == "plane")
        {
            var intersection = rayPlaneIntersection(ray, object);
            if(intersection != null && intersection.distance < closestDist)
            {
                closestDist = intersection.distance;
                closestInter = intersection;
                closestObject = object;
            }
        }
    }
    if(closestInter == null)
        return null;

    return new Hit(closestInter, closestObject);

}

function sphereNormal(sphere, pos) {
    // Return sphere normal
    return normalize(sub(pos, sphere.center));
}

/*
    Shade surface
*/
function shade(ray, hit, depth) {

    var object = hit.object;
    var color = object.color;
    var ambient = object.ambientK;
    var diffuseK = object.diffuseK;
    var specularK = object.specularK;
    var diffuse = 0;
    var specular = 0;
    var normal;
    var colorMult
    
    
    // Compute object normal, based on object type
    // If sphere, use sphereNormal, if not then it's a plane, use object normal
    if(object.type == "sphere")
    {
        normal = sphereNormal(object, hit.intersection.point);
    }
    else 
    {
        normal = normalize(object.normal);
    }

    // Loop through all lights, computing diffuse and specular components *if not in shadow*
    for(var i = 0; i < lightPos.length; i++)
    {
        if(!isInShadow(hit, lightPos[i].position))
        {
            var lightDir = normalize(sub(lightPos[i].position, hit.intersection.point));
            var diff = Math.max(0, dot(normal, lightDir)) * diffuseK;
            var halfDir = normalize(add(lightDir, mult(ray.direction,-1)));
            var specAngle = Math.max(dot(halfDir, normal), 0);
            var spec = Math.pow(specAngle, object.specularExponent) * specularK;

            if(diffuseToggle)
                diffuse += diff;
            if(specularToggle)
                specular += spec;
        }
    }

    if(!ambientToggle)
        ambient = 0;
    
    var colorMult = diffuse + ambient + specular;
    color = mult(color, colorMult);

    // Handle reflection, make sure to call trace incrementing depth
    if(depth > 0 && reflectionToggle)
    {
        var r = reflect(normalize(mult(ray.direction, -1)), normal);
        var refRay = new Ray(hit.intersection.point, r);
        var refColor = trace(refRay, depth-1)
        if(refColor != null)
        {
            refColor = mult(refColor, object.reflectiveK);
            color = add(refColor, color);
        }
    }


    return color;
}


/*
    Trace ray
*/
function trace(ray, depth) {
    var hit = intersectObjects(ray, depth);
    if(hit != null) {
        var color = shade(ray, hit, depth);
        return color;
    }
    return null;
}

function isInShadow(hit, light) {

    // Check if there is an intersection between the hit.intersection.point point and the light
    // If so, return true
    // If not, return false
    var ray = new Ray(hit.intersection.point, sub(light, hit.intersection.point));
    var hit2 = intersectObjects(ray, 0);
    if(hit2 == null)
    {
        return false;
    }
    return true;
}

/*
    Render loop
*/
function render(element) {
    if(scene == null)
        return;
    
    var width = element.clientWidth;
    var height = element.clientHeight;
    element.width = width;
    element.height = height;
    scene.camera.width = width;
    scene.camera.height = height;
    lightPos = scene.lights;
    camPos = scene.camera.position;

    var ctx = element.getContext("2d");
    var data = ctx.getImageData(0, 0, width, height);

    var eye = normalize(sub(scene.camera.direction, scene.camera.position));
    var right = normalize(cross(eye, [0,1,0]));
    var up = normalize(cross(right, eye));
    var fov = ((scene.camera.fov / 2.0) * Math.PI / 180.0);

    var halfWidth = Math.tan(fov);
    var halfHeight = (scene.camera.height / scene.camera.width) * halfWidth;
    var pixelWidth = (halfWidth * 2) / (scene.camera.width - 1);
    var pixelHeight = (halfHeight * 2) / (scene.camera.height - 1);

    for(var x=0; x < width; x++) {
        for(var y=0; y < height; y++) {
            var vx = mult(right, x*pixelWidth - halfWidth);
            var vy = mult(up, y*pixelHeight - halfHeight);
            var direction = normalize(add(add(eye,vx),vy));
            var origin = scene.camera.position;

            var ray = new Ray(origin, direction);
            var color = trace(ray, depth);
            if(color != null) {
                var index = x * 4 + y * width * 4;
                data.data[index + 0] = color[0] * 255;
                data.data[index + 1] = color[1] * 255;
                data.data[index + 2] = color[2] * 255;
                data.data[index + 3] = 255;
            }
        }
    }
    console.log("done");
    ctx.putImageData(data, 0, 0);
}

/*
    Handlers
*/
window.handleFile = function(e) {
    var reader = new FileReader();
    reader.onload = function(evt) {
        var parsed = JSON.parse(evt.target.result);
        scene = parsed;
    }
    reader.readAsText(e.files[0]);
}

window.updateMaxDepth = function() {
    depth = document.querySelector("#maxDepth").value;
    console.log(depth);
    var element = document.querySelector("#canvas");
    render(element);
}

window.toggleAmbient = function() {
    ambientToggle = document.querySelector("#ambient").checked;
    var element = document.querySelector("#canvas");
    render(element);
}

window.toggleDiffuse = function() {
    diffuseToggle = document.querySelector("#diffuse").checked;
    var element = document.querySelector("#canvas");
    render(element);
}

window.toggleSpecular = function() {
    specularToggle = document.querySelector("#specular").checked;
    var element = document.querySelector("#canvas");
    render(element);
}

window.toggleReflection = function() {
    reflectionToggle = document.querySelector("#reflection").checked;
    var element = document.querySelector("#canvas");
    render(element);
}

/*
    Render scene
*/
window.renderScene = function(e) {
    var element = document.querySelector("#canvas");

    //loops through rows    
    for (var i = 1; i < 7; i++)
    {
        scene.objects[i].color = getValueFromTable(i, 0);
        scene.objects[i].center = getValueFromTable(i, 1);
        scene.objects[i].radius  = getValueFromTable(i, 2);
        scene.objects[i].specularExponent = getValueFromTable(i, 3);
        scene.objects[i].specularK = getValueFromTable(i, 4);
        scene.objects[i].ambientK = getValueFromTable(i, 5);
        scene.objects[i].diffuseK = getValueFromTable(i, 6);
        scene.objects[i].reflectiveK = getValueFromTable(i, 7);
    }

    render(element);
    //console.log(scene);
}

function getValueFromTable(i, j)
{
    var table = document.getElementById("objectData");

    var oCells = table.rows.item(i).cells;
    if(j == 0)
    {
        var cellVal = oCells.item(j).innerHTML;
        cellVal = cellVal.substring(cellVal.indexOf(">")+1, cellVal.lastIndexOf("<"));
        var cellArray = new Array();
        cellArray = cellVal.split(",");
        for (var a in cellArray ) 
        {
            cellArray[a] = parseInt(cellArray[a], 10);
        }
        return cellArray; 

    }
    else if(j == 1)
    {
        var cellVal = oCells.item(j).innerHTML;
        cellVal = cellVal.substring(cellVal.indexOf(">")+1, cellVal.lastIndexOf("<"));
        var cellArray = new Array();
        cellArray = cellVal.split(",");
        for (var a in cellArray ) 
        {
            cellArray[a] = parseFloat(cellArray[a]);
        }
        return cellArray; 

    }
    else
    {
        var cellVal = oCells.item(j).innerHTML;
        cellVal = cellVal.substring(cellVal.indexOf(">")+1, cellVal.lastIndexOf("<"));
        cellVal = parseFloat(cellVal);
        return cellVal;
    }
}

function init()
{
    var element = document.querySelector("#canvas");
    render(element);
    var table = document.getElementById("objectData");
    for(var i = 1; i < 7; i++)
    {
        var newRow = table.insertRow(table.length);
        var cell = newRow.insertCell(0);
        cell.innerHTML = "<div contenteditable>" + scene.objects[i].color + "</div>";
        var cell = newRow.insertCell(1);
        cell.innerHTML = "<div contenteditable>" + scene.objects[i].center + "</div>";
        var cell = newRow.insertCell(2);
        cell.innerHTML = "<div contenteditable>" + scene.objects[i].radius + "</div>";
        var cell = newRow.insertCell(3);
        cell.innerHTML = "<div contenteditable>" + scene.objects[i].specularExponent + "</div>";
        var cell = newRow.insertCell(4);
        cell.innerHTML = "<div contenteditable>" + scene.objects[i].specularK + "</div>";
        var cell = newRow.insertCell(5);
        cell.innerHTML = "<div contenteditable>" + scene.objects[i].ambientK + "</div>";
        var cell = newRow.insertCell(6);
        cell.innerHTML = "<div contenteditable>" + scene.objects[i].diffuseK + "</div>";
        var cell = newRow.insertCell(7);
        cell.innerHTML = "<div contenteditable>" + scene.objects[i].reflectiveK + "</div>";
    }

}

window.onload = init();