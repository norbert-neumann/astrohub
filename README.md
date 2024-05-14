# AstroHub API Documentation

## Users Endpoints

### Get User Information

- **Endpoint**: `/users/:userId`
- **Method**: GET
- **Parameters**: 
  - `userId` (ID of the user)
- **Description**: Retrieves information about the user with the specified ID.

### Get User's Friends

- **Endpoint**: `/users/:userId/friends`
- **Method**: GET
- **Parameters**: 
  - `userId` (ID of the user)
- **Description**: Retrieves the list of friends of the user with the specified ID.

### Get User's Friend Requests

- **Endpoint**: `/users/:userId/friend-requests`
- **Method**: GET
- **Parameters**: 
  - `userId` (ID of the user)
- **Description**: Retrieves the list of pending friend requests for the user with the specified ID.

### Get User's Favourite Spots

- **Endpoint**: `/users/:userId/favourite-spots`
- **Method**: GET
- **Parameters**: 
  - `userId` (ID of the user)
- **Description**: Retrieves the list of favourite spots of the user with the specified ID.

### Get User's Trips

- **Endpoint**: `/users/:userId/trips`
- **Method**: GET
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `timezone`: Timezone information
- **Description**: Retrieves the list of trips associated with the user with the specified ID.

### Add Friend

- **Endpoint**: `/users/:userId/friends`
- **Method**: POST
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `friendId`: ID of the friend to add
- **Description**: Adds a friend to the user with the specified ID.

### Add Trip

- **Endpoint**: `/users/:userId/trips`
- **Method**: POST
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `tripId`: ID of the trip to add
- **Description**: Adds a trip to the user's list of trips.

### Add Favourite Spot

- **Endpoint**: `/users/:userId/favourite-spots`
- **Method**: POST
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `spotId`: ID of the favourite spot to add
- **Description**: Adds a favourite spot to the user's list of favourite spots.

### Add Friend Request

- **Endpoint**: `/users/:userId/friend-requests`
- **Method**: POST
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `friendId`: ID of the user to send the friend request
- **Description**: Sends a friend request to the user with the specified ID.

### Update Username

- **Endpoint**: `/users/:userId/username`
- **Method**: PATCH
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `newUsername`: New username
- **Description**: Updates the username of the user with the specified ID.

### Update Display Name

- **Endpoint**: `/users/:userId/display-name`
- **Method**: PATCH
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `newDisplayName`: New display name
- **Description**: Updates the display name of the user with the specified ID.

### Delete User

- **Endpoint**: `/users/:userId`
- **Method**: DELETE
- **Parameters**: 
  - `userId` (ID of the user)
- **Description**: Deletes the user with the specified ID.

### Remove Friend

- **Endpoint**: `/users/:userId/friends`
- **Method**: DELETE
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `friendId`: ID of the friend to remove
- **Description**: Removes a friend from the user's list of friends.

### Remove Trip

- **Endpoint**: `/users/:userId/trips`
- **Method**: DELETE
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `tripId`: ID of the trip to remove
- **Description**: Removes a trip from the user's list of trips.

### Remove Favourite Spot

- **Endpoint**: `/users/:userId/favourite-spots`
- **Method**: DELETE
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `spotId`: ID of the favourite spot to remove
- **Description**: Removes a favourite spot from the user's list of favourite spots.

### Remove Friend Request

- **Endpoint**: `/users/:userId/friend-requests`
- **Method**: DELETE
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `senderId`: ID of the user who sent the friend request
- **Description**: Removes a friend request from the user's list of pending requests.

## Spots Endpoints

### Get Spots Sorted by Distance

- **Endpoint**: `/spots/distance`
- **Method**: GET
- **Description**: Retrieves spots sorted by distance from a specified location.
- **Parameters**: 
  - `lattitude`: Latitude coordinates
  - `longitude`: Longitude coordinates
  - `distance` (optional): Maximum distance in kilometers

### Get All Spots Sorted by Rating

- **Endpoint**: `/spots/rating`
- **Method**: GET
- **Description**: Retrieves all spots sorted by rating.
- **Parameters**: 
  - `skip` (optional): Number of spots to skip
  - `limit` (optional): Maximum number of spots to return
  - `orderBy`: Sorting order ('asc' or 'desc')

### Get Spots by Partial Name

- **Endpoint**: `/spots/match-name/:name`
- **Method**: GET
- **Description**: Retrieves spots matching a partial name.
- **Parameters**: 
  - `name`: Partial name of the spot

### Get Spot by ID

- **Endpoint**: `/spots/:spotId`
- **Method**: GET
- **Description**: Retrieves a spot by its ID.
- **Parameters**: 
  - `spotId`: ID of the spot

### Get Spots Within Distance

- **Endpoint**: `/spots/`
- **Method**: GET
- **Description**: Retrieves spots within a specified distance from a location.
- **Parameters**: 
  - `lattitude`: Latitude coordinates
  - `longitude`: Longitude coordinates
  - `distance` (optional): Maximum distance in kilometers

### Create Spot

- **Endpoint**: `/spots/`
- **Method**: POST
- **Description**: Creates a new spot.
- **Request Body**:
  - `lattitude`: Latitude coordinates
  - `longitude`: Longitude coordinates
  - `name`: Name of the spot
- **Response Status Code**: 201 (Created)

### Update Spot Name

- **Endpoint**: `/spots/:spotId/name`
- **Method**: PATCH
- **Description**: Updates the name of a spot.
- **Parameters**: 
  - `spotId`: ID of the spot
- **Request Body**:
  - `name`: New name for the spot

### Update Spot Rating

- **Endpoint**: `/spots/:spotId/rating`
- **Method**: PATCH
- **Description**: Updates the rating of a spot.
- **Parameters**: 
  - `spotId`: ID of the spot
- **Request Body**:
  - `rating`: New rating for the spot

### Delete Spot

- **Endpoint**: `/spots/:spotId`
- **Method**: DELETE
- **Description**: Deletes a spot.
- **Parameters**: 
- `spotId`: ID of the spot

## Trips Endpoints

### Get Upcoming Trips

- **Endpoint**: `/trips/upcoming`
- **Method**: GET
- **Description**: Retrieves upcoming trips.
- **Parameters**: 
  - `lattitude`: Latitude coordinates
  - `longitude`: Longitude coordinates
  - `distance` (optional): Maximum distance in kilometers
  - `timezone` (optional): Timezone information

### Get Trip by ID

- **Endpoint**: `/trips/:tripId`
- **Method**: GET
- **Description**: Retrieves a trip by its ID.
- **Parameters**: 
  - `tripId`: ID of the trip
  - `timezone` (optional): Timezone information

### Create Trip

- **Endpoint**: `/trips/`
- **Method**: POST
- **Description**: Creates a new trip.
- **Request Body**:
  - `spotId`: ID of the spot
  - `date`: Date of the trip
  - `name`: Name of the trip
- **Response Status Code**: 201 (Created)

### Update Trip Name

- **Endpoint**: `/trips/:tripId/name`
- **Method**: PATCH
- **Description**: Updates the name of a trip.
- **Parameters**: 
  - `tripId`: ID of the trip
- **Request Body**:
  - `name`: New name for the trip

### Update Trip Date

- **Endpoint**: `/trips/:tripId/date`
- **Method**: PATCH
- **Description**: Updates the date of a trip.
- **Parameters**: 
  - `tripId`: ID of the trip
- **Request Body**:
  - `date`: New date for the trip

### Delete Trip

- **Endpoint**: `/trips/:tripId`
- **Method**: DELETE
- **Description**: Deletes a trip.
- **Parameters**: 
- `tripId`: ID of the trip
