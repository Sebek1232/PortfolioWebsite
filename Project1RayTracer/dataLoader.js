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
                "color": [224,251,252], 
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
                "color": [32,222,89], //20DE59
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
                "color": [32,222,89], //20DE59
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
                "color": [13,223,238], //0DDFEE
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
                "color": [13,223,238], //0DDFEE
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
                "color": [255,115,21], //FF7315
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
                "color": [255,115,21], //FF7315
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