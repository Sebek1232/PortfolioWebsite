# CS425 - Computer Graphics I (Spring 2021)

## Assignment 2: Shadow maps
Sebastian Greczek

This program renders a city from a json file that has coordinates, colors, normals, and indices of the city. 

Start by uploading the json file. After it is uploaded a render of the city will show. 
The rotate camera slider will rotate the camera around the center not affecting shadows or normals.
Zoom slider will zoom towards or away from the center. It will also not affect shadows. 
Rotate light slider will rotate the position of the light. This will cause the shadows and normals
to rendered in different postions.

Checking the shadow map option will display a texture that holds the depth of the render. 
When this is unchecked this map is rendered to a texture that is not rendered to the screen.
When checked it will display it. Rotate light is the only slider that will affect this render 
since it is rendered from the position of the camera. This texture is used to compute the 
shadows in the first render by comparing the depth values of the two different renders. 

First the shadow map is rendered to a texture that holds the depth from the position of the light. 
Then the second render draws to the screen displaying the buildings and color and also the shadows that 
were calculated using the render of the first texture. 


