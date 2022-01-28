# Render Recipes
This project is a web application that allows users to browse recipes from around the world. 


Recipes are provided by the following API: 
    https://www.themealdb.com/api.php

## Users can do the following:
- Filter through recipes by category, main ingredient, and region
- Search by name/keyword for a recipe
- Generate a random recipe
- Add ingredients from multiple recipes to a shopping list
- Print the selected ingredients from the shopping list

## In the future, we hope that users can do the following: 
- Favorite a recipe and access all favorited recipes
- Access the instructional video for each recipe
- Hover over a category/main ingredient/region to see a description

## Instructions to Install and Run the Project
* First, you'll need to install JSON Server globally on your machine. In your terminal run the following: 
```console
$ npm install -g json-server
```
* Since we're using our local computer as the server, you'll run the database file (db.json) using the following command: 
```console
$ json-server --watch db.json
```
* Once the server is up, open the HTML file in your browser using (mac users)
```console
$ open index.html
```
or (windows users)
```console
$ explorer.exe index.html
```
* Enjoy!