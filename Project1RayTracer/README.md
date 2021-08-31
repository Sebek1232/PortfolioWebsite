# CS425 - Computer Graphics I (Spring 2021)
Sebastian Greczek

## Assignment 3: Ray tracing
This program takes in a json file of objects, spheres and planes, also the ligth position and ray traces the objects
the screen. The program renders the objects using the ambient, diffuse, and specular compents, to change the colors 
of the object. It also renders reflections with a depth specified by the slider.

To start the program first upload a json file of objects and light positions. This program was tested using 
scene1.json. 

Once the render button is pressed all of the object will be rendered using all of the components. 
Each component can be toggled off to see the different renderings with or without some of the components.
The slider controls the depth of the reflection ray tracing. The higher the depth the more rays get traced
to render the reflections. It starts at a value of 1. 
