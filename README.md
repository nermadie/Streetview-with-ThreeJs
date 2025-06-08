# Streetview-with-ThreeJs

This project focuses on **implementing 3D models based on WebGL and the Three.js library** on a Local Web Server. The main goal is to **demonstrate how to create and display interactive 3D graphics in a web browser**, specifically applying **realistic lighting effects** and **Street View** functionality.

## Description

This project is an implementation based on the `webgl_lightprobe_cubecamera` example from the official Three.js website. It uses **light probes and cube cameras to collect lighting information from the environment**, helping objects in the 3D scene reflect light more naturally.

A key highlight of the project is its **ability to interact with 3D models** and integrate a **Street View mode**, allowing users to **navigate between different locations** (specifically, areas of Da Nang University of Technology) via on-screen directional arrows.

## Features

*   **High-quality 3D model display**: The system is capable of accurately and smoothly displaying 3D models, with sharp and realistic visuals.
*   **Flexible user interaction**: Allows users to rotate, zoom in/out, and move 3D models. The interface is user-friendly and easy to use.
*   **Realistic lighting and material effects**: Supports various types of materials and lighting to create 3D objects with realistic physical properties and appearance.
*   **Street View mode**: Displays Street View corresponding to the current location and allows navigation to nearby locations via directional arrows on the screen.
*   **Background and material changes**: Users can change the surrounding background image and adjust 3D object material parameters such as roughness, metalness, and exposure.

## Technologies Used

*   **Programming Language**: **JavaScript**
*   **Graphics Library**: **Three.js** - A powerful JavaScript library for creating and displaying 3D graphics on the web, known for its ease of use, flexibility, high performance, and large community.
*   **Graphics API**: **WebGL** - An API that enables rendering 2D and 3D graphics compatible with web browsers.
*   **Development Tool**: **Visual Studio Code (VSCode)** - A powerful IDE for JavaScript application development.
*   **Additional Libraries**:
    *   `lil-gui.module.min.js`: A graphical user interface (GUI) library for Three.js, allowing creation of GUI panels for interaction.
    *   `OrbitControls.js`: A library for controlling the camera (rotation, movement, zoom) using a mouse or touchpad.
    *   `stats.module.js`: A library for displaying performance information (frame rate, triangle count).
    *   `@monogrid/gainmap-js`: A library used for loading and processing HDR JPG images. The project references `gainmap-js` for HDR JPG conversion and decoding.

## Project Structure

The project has the following directory structure:

```
. ├── lightprobe_with_background.html   # Main source file of the 3D program
  ├── dependencies/                     # Contains necessary libraries and modules
  │   ├── main.css                      #
  │   ├── lil-gui.module.min.js         # GUI library for Three.js
  │   ├── OrbitControls.js              # Camera control library
  │   ├── stats.module.js               # Performance stats library
  │   └── three.module.js               # Main Three.js library
  └── background/                       # Contains background image data
      ├── spruit_sunrise_4k.hdr.jpg     # Default background (spring sunrise)
      ├── E1.jpg                        # Background for area E of Da Nang University of Technology (1)
      ├── E2.jpg                        # Background for area E of Da Nang University of Technology (2)
      ├── E3.jpg                        # Background for area E of Da Nang University of Technology (3)
      ├── E4.jpg                        # Background for area E of Da Nang University of Technology (4)
      ├── E5.jpg                        # Background for area E of Da Nang University of Technology (5)
      └── E6.jpg                        # Background for area E of Da Nang University of Technology (6)
```

*(Note: F1.jpg is also referenced in the source code, potentially located in 'textures/equirectangular')*

## Installation and Running Instructions

To run this project on your local machine, you need a **Local Web Server**.

1.  **Download Source Code**: Clone or download this repository to your computer.
2.  **Set up Local Web Server**:
    *   You can use tools like **Live Server** (a VSCode extension), **XAMPP**, **WAMP**, or simply run an HTTP server using Python (`python -m http.server`) from the project's root directory. (Note: Specific information about these server tools is not provided in the sources and you may want to independently verify this information.)
3.  **Open the Application**: Once your web server is running, access the `lightprobe_with_background.html` file through your web browser (e.g., `http://localhost:8000/lightprobe_with_background.html` if you are using a Python server on port 8000).

## Future Development

The project has potential for further development in areas such as:

*   Researching methods to create better backgrounds.
*   Integrating additional scene transition features when moving to nearby points within the frame (beyond the current Street View functionality).
*   Improving the user interface to be more intuitive and user-friendly.
*   Expanding compatibility with more platforms and mobile devices.

## References

*   Three.js – JavaScript 3D library: [https://threejs.org/](https://threejs.org/)
*   WebGL: 2D and 3D graphics for the web - Web APIs | MDN: [https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
*   `gainmap-js` for HDR JPG conversion and decoding: [https://github.com/MONOGRID/gainmap-js](https://github.com/MONOGRID/gainmap-js)