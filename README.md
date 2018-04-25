# Internet of Wine - Localiz' / Wine Cellar Management
[![Build Status](https://travis-ci.org/lerami/meteor-wine-cellar-management.svg?branch=master)](https://travis-ci.org/lerami/meteor-wine-cellar-management)
[![Awesome Badges](https://img.shields.io/badge/badges-awesome-green.svg)](https://github.com/Naereen/badges)

School project: help the winegrower of the Château Luchey-Halde in Bordeaux to manage his wine cellar by offering him an interactive map to add, remove bottles or boxes (bottles containers).

## Getting Started

Clone the project:
```
git clone https://github.com/lerami/meteor-wine-cellar-management.git
```

Run it with meteor:
```
cd meteor-wine-cellar-management
meteor
```

### Prerequisites

You'll need to install [Meteor](https://www.meteor.com/) first if not already installed on your machine.

## API

The project comes up with a [rest API]() to provide access from a remote app (mobile app) to the MongoDB database.

### Routes

(address-of-your-project is by default localhost:3000)

##### Get all the boxes
```
address-of-your-project/api/boxes
```

##### Get a box by its id
```
address-of-your-project/api/boxes/id/:_id
```

##### Get boxes by criterias. It is not obligatory to fill in all the criterias ; just write "null" in the fields you do not want to search by.
```
address-of-your-project/api/boxes/search/color/:color/ref/:ref/year/:year
```
Example : Search all the "Rouge" (red) wines from 2015 (any refs) 
```
address-of-your-project/api/boxes/search/color/Rouge/ref/null/year/2015
```

##### Add an amount (:qty) of bottles to a specific box (:\_id) 
_(NB : note that it ADDS the quantity :qty to the box :\_id ; if the previous quantity of bottles was 100 and you set :qty to 50, after your request the final quantity in the box you'll be 150)_
```
address-of-your-project/api/boxes/add/:_id/:qty
```

##### Remove an amount (:qty) of bottles to a specific box (:\_id)
_(NB : note that it REMOVES the quantity :qty to the box :\_id ; if the previous quantity of bottles was 100 and you set :qty to 50, after your request the final quantity in the box you'll be 50)_
```
address-of-your-project/api/boxes/remove/:_id/:qty
```
