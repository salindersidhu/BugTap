# Bug Tap

[![Contributors](https://img.shields.io/github/contributors/salindersidhu/BugTap?style=for-the-badge)](https://github.com/salindersidhu/BugTap/graphs/contributors) [![Visitors](https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2Fsalindersidhu%2FBugTap&countColor=%23263759)](https://visitorbadge.io/status?path=https%3A%2F%2Fgithub.com%2Fsalindersidhu%2FBugTap) [![License: Apache](https://img.shields.io/badge/license-APACHE-brightgreen.svg?style=for-the-badge)](/LICENSE.md)

## Overview

A single player game featuring a table with six food items placed around the center. Bugs will spawn randomly from the top and bottom of the table, heading straight towards the nearest food. Upon reaching food, bugs will immediately eat it before proceeding to the next available one. The goal of this game is to tap or click the bugs before they eat all of the food within 60 seconds. The game ends upon the expiration of the timer or the bugs eaten all of the food on the table. Built using source technologies.

<p float="left">
    <img src="https://seeklogo.com/images/T/typescript-logo-B29A3F462D-seeklogo.com.png" height="150" width="150">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/1024px-Unofficial_JavaScript_logo_2.svg.png" height="150" width="150">
</p>

## Prerequisite Software

| Software | Version  |
| :------- | :------- |
| Git      | 2.20.1+  |
| Node     | 10.15.0+ |

## Getting Started

1. Run the following command to install all the required packages:

```bash
npm install
```

## Running

1. Run the development server:

```bash
npm run dev
```

## Project Structure

    .
    ├── src
    │    ├── engine                 # Game engine
    │    │    ├── index.ts
    │    │    └── ...
    │    ├── game                   # Game source
    │    │    ├── index.ts
    │    │    └── ...
    │    ├── index.ts
    │    └── ...
    ├── assets                      # Game assets
    │    └── ...
    ├── public
    │    ├── favicon.ico            # Favicon
    │    ├── template.html
    │    └── ...
    ├── tsconfig.json               # TypeScript config
    ├── webpack.config.js           # Webpack config
    └── ...

## Acknowledgements

- **Original Assignment**:
  - University of Toronto: CSC309 Programming on the Web, Summer 2015
- **Graphics**:
  - Bug sprite from [E-String](http://e-string.com/articles/create-simple-game-using-sprite-kit/)
  - Food sprites from [Free Vector](http://all-free-download.com/free-vector/download/vivid_food_icon_design_vector_535039.html)
  - Media button images from [Vector.me](http://vector.me/browse/695406/icon_set_player)
  - Favicon generated from [Font Awesome Favicon Generator](http://paulferrett.com/fontawesome-favicon/)
  - Tablecloth texture created by **Patrick Hoesly** from [Flickr](http://www.everystockphoto.com/photo.php?imageId=5778707) under [Create Commons Attribution License](http://creativecommons.org/licenses/by/4.0/)
- **Sound Effects**:
  - Coin (Retro video game SFX) created by **cabled_mess** from [Freesound](https://freesound.org/people/cabled_mess/sounds/350874/) under [Create Commons 0 License](https://creativecommons.org/publicdomain/zero/1.0/)
  - Chewing, Breadstick, Single created by **InspectorJ** from [Freesound](https://freesound.org/people/InspectorJ/sounds/429591/) under [Create Commons Attribution License](https://creativecommons.org/licenses/by/3.0/)
