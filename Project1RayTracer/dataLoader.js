function getDataArray(){
    return{
        "camera": {
            "position": [0,-5,5],
            "fov": 75,
            "direction": [0,0,0]
        },
        "objects": [
            {
                "center": [0,0,0],
                "normal": [0,-1,0],
                "color": [255,255,255],
                "specularExponent": 1,
                "specularK": 0,
                "ambientK": 0.001,
                "diffuseK": 0.001,
                "reflectiveK": 0.5,
                "type": "plane"
            },
            {
                "center": [0,-1.25,0],
                "radius": 1.25,
                "color": [255,0,0],
                "specularExponent": 500,
                "specularK": 0.001,
                "ambientK": 0.001,
                "diffuseK": 0.001,
                "reflectiveK": 0.25,
                "type": "sphere"
            },
            {
                "center": [0,-2.75,0],
                "radius": 0.25,
                "color": [255,0,0],
                "specularExponent": 500,
                "specularK": 0.001,
                "ambientK": 0.001,
                "diffuseK": 0.001,
                "reflectiveK": 0.25,
                "type": "sphere"
            },
            {
                "center": [2.5,-1.25,0],
                "radius": 1.25,
                "color": [0,255,0],
                "specularExponent": 500,
                "specularK": 0.001,
                "ambientK": 0.001,
                "diffuseK": 0.001,
                "reflectiveK": 0.25,
                "type": "sphere"
            },
            {
                "center": [2.5,-2.75,0],
                "radius": 0.25,
                "color": [0,255,0],
                "specularExponent": 500,
                "specularK": 0.001,
                "ambientK": 0.001,
                "diffuseK": 0.001,
                "reflectiveK": 0.25,
                "type": "sphere"
            },
            {
                "center": [-2.5,-0.75,0],
                "radius": 0.75,
                "color": [255,255,0],
                "specularExponent": 500,
                "specularK": 0.001,
                "ambientK": 0.001,
                "diffuseK": 0.001,
                "reflectiveK": 0.25,
                "type": "sphere"
            },
            {
                "center": [-2.5,-1.75,0],
                "radius": 0.25,
                "color": [255,255,0],
                "specularExponent": 500,
                "specularK": 0.001,
                "ambientK": 0.001,
                "diffuseK": 0.001,
                "reflectiveK": 0.25,
                "type": "sphere"
            }
        ],
        "lights": [
            {
                "position": [-2,-5,0]
            },
            {
                "position": [0,-5,-2]
            }
        ]
    }
}