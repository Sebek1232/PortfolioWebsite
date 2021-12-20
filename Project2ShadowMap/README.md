# WebGL Shadow Mapping

A javascript program that uses the WebGL API to render a city skyline.The user can control the direction of the camera, change the perspective, change light direction, and zoom in and out. The shadow mapping technique is used to calculate the shadows. First the scene is rendered from the perspective of the light, the depth texture is extracted, and saved as a texture. Then the scene is rendered from the perspective of the camera and it is compared to the depth texture to determine whether the object is in shadow or light.
