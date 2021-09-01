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
    updateColor();
    updateCenter();
    updateRadius();
    //console.log(scene);
    

    render(element);
    //console.log(scene);
}
function updateColor()
{
    var lTop = document.getElementById("lTopRGB");
    var lBot = document.getElementById("lBotRGB");
    var mTop = document.getElementById("mTopRGB");
    var mBot = document.getElementById("mBotRGB");
    var rTop = document.getElementById("rTopRGB");
    var rBot = document.getElementById("rBotRGB");
    var lTopRGB = [hexToRgb(lTop.value).r, hexToRgb(lTop.value).g, hexToRgb(lTop.value).b];
    var lBotRGB = [hexToRgb(lBot.value).r, hexToRgb(lBot.value).g, hexToRgb(lBot.value).b];
    var mTopRGB = [hexToRgb(mTop.value).r, hexToRgb(mTop.value).g, hexToRgb(mTop.value).b];
    var mBotRGB = [hexToRgb(mBot.value).r, hexToRgb(mBot.value).g, hexToRgb(mBot.value).b];
    var rTopRGB = [hexToRgb(rTop.value).r, hexToRgb(rTop.value).g, hexToRgb(rTop.value).b];
    var rBotRGB = [hexToRgb(rBot.value).r, hexToRgb(rBot.value).g, hexToRgb(rBot.value).b];
    scene.objects[1].color = mBotRGB;
    scene.objects[2].color = mTopRGB;
    scene.objects[3].color = rBotRGB;
    scene.objects[4].color = rTopRGB;
    scene.objects[5].color = lBotRGB;
    scene.objects[6].color = lTopRGB;
}

function updateCenter()
{
    var lTopx = document.getElementById("lTopx");
    var lTopy = document.getElementById("lTopy");
    var lTopz = document.getElementById("lTopz");

    var lBotx = document.getElementById("lBotx");
    var lBoty = document.getElementById("lBoty");
    var lBotz = document.getElementById("lBotz");

    var mTopx = document.getElementById("mTopx");
    var mTopy = document.getElementById("mTopy");
    var mTopz = document.getElementById("mTopz");

    var mBotx = document.getElementById("mBotx");
    var mBoty = document.getElementById("mBoty");
    var mBotz = document.getElementById("mBotz");

    var rTopx = document.getElementById("rTopx");
    var rTopy = document.getElementById("rTopy");
    var rTopz = document.getElementById("rTopz");

    var rBotx = document.getElementById("rBotx");
    var rBoty = document.getElementById("rBoty");
    var rBotz = document.getElementById("rBotz");

    var lTopxyz = [parseFloat(lTopx.value), parseFloat(lTopy.value), parseFloat(lTopz.value)];
    var lBotxyz = [parseFloat(lBotx.value), parseFloat(lBoty.value), parseFloat(lBotz.value)];
    var mTopxyz = [parseFloat(mTopx.value), parseFloat(mTopy.value), parseFloat(mTopz.value)];
    var mBotxyz = [parseFloat(mBotx.value), parseFloat(mBoty.value), parseFloat(mBotz.value)];
    var rTopxyz = [parseFloat(rTopx.value), parseFloat(rTopy.value), parseFloat(rTopz.value)];
    var rBotxyz = [parseFloat(rBotx.value), parseFloat(rBoty.value), parseFloat(rBotz.value)];

    scene.objects[1].center = mBotxyz;
    scene.objects[2].center = mTopxyz;
    scene.objects[3].center = rBotxyz;
    scene.objects[4].center = rTopxyz;
    scene.objects[5].center = lBotxyz;
    scene.objects[6].center = lTopxyz;
}

function updateRadius()
{
    var lTop = document.getElementById("lTopRad");
    var lBot = document.getElementById("lBotRad");
    var mTop = document.getElementById("mTopRad");
    var mBot = document.getElementById("mBotRad");
    var rTop = document.getElementById("rTopRad");
    var rBot = document.getElementById("rBotRad");

    scene.objects[1].radius = parseFloat(mBot.value);
    scene.objects[2].radius = parseFloat(mTop.value);
    scene.objects[3].radius = parseFloat(rBot.value);
    scene.objects[4].radius = parseFloat(rTop.value);
    scene.objects[5].radius = parseFloat(lBot.value);
    scene.objects[6].radius = parseFloat(lTop.value);
}
function init()
{
    var element = document.querySelector("#canvas");
    render(element);

}

window.onload = init();