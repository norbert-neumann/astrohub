## AstroHub API Documentation

### User Endpoints

#### Get User Information

- **Endpoint**: `/users/:userId`
- **Method**: GET
- **Parameters**: 
  - `userId` (ID of the user)
- **Description**: Retrieves information about the user with the specified ID.

#### Get User's Friends

- **Endpoint**: `/users/:userId/friends`
- **Method**: GET
- **Parameters**: 
  - `userId` (ID of the user)
- **Description**: Retrieves the list of friends of the user with the specified ID.

#### Get User's Friend Requests

- **Endpoint**: `/users/:userId/friend-requests`
- **Method**: GET
- **Parameters**: 
  - `userId` (ID of the user)
- **Description**: Retrieves the list of pending friend requests for the user with the specified ID.

#### Get User's Favourite Spots

- **Endpoint**: `/users/:userId/favourite-spots`
- **Method**: GET
- **Parameters**: 
  - `userId` (ID of the user)
- **Description**: Retrieves the list of favourite spots of the user with the specified ID.

#### Get User's Trips

- **Endpoint**: `/users/:userId/trips`
- **Method**: GET
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `timezone`: Timezone information
- **Description**: Retrieves the list of trips associated with the user with the specified ID.

#### Add Friend

- **Endpoint**: `/users/:userId/friends`
- **Method**: POST
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `friendId`: ID of the friend to add
- **Description**: Adds a friend to the user with the specified ID.

#### Add Trip

- **Endpoint**: `/users/:userId/trips`
- **Method**: POST
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `tripId`: ID of the trip to add
- **Description**: Adds a trip to the user's list of trips.

#### Add Favourite Spot

- **Endpoint**: `/users/:userId/favourite-spots`
- **Method**: POST
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `spotId`: ID of the favourite spot to add
- **Description**: Adds a favourite spot to the user's list of favourite spots.

#### Add Friend Request

- **Endpoint**: `/users/:userId/friend-requests`
- **Method**: POST
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `friendId`: ID of the user to send the friend request
- **Description**: Sends a friend request to the user with the specified ID.

#### Update Username

- **Endpoint**: `/users/:userId/username`
- **Method**: PATCH
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `newUsername`: New username
- **Description**: Updates the username of the user with the specified ID.

#### Update Display Name

- **Endpoint**: `/users/:userId/display-name`
- **Method**: PATCH
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `newDisplayName`: New display name
- **Description**: Updates the display name of the user with the specified ID.

#### Delete User

- **Endpoint**: `/users/:userId`
- **Method**: DELETE
- **Parameters**: 
  - `userId` (ID of the user)
- **Description**: Deletes the user with the specified ID.

#### Remove Friend

- **Endpoint**: `/users/:userId/friends`
- **Method**: DELETE
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `friendId`: ID of the friend to remove
- **Description**: Removes a friend from the user's list of friends.

#### Remove Trip

- **Endpoint**: `/users/:userId/trips`
- **Method**: DELETE
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `tripId`: ID of the trip to remove
- **Description**: Removes a trip from the user's list of trips.

#### Remove Favourite Spot

- **Endpoint**: `/users/:userId/favourite-spots`
- **Method**: DELETE
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `spotId`: ID of the favourite spot to remove
- **Description**: Removes a favourite spot from the user's list of favourite spots.

#### Remove Friend Request

- **Endpoint**: `/users/:userId/friend-requests`
- **Method**: DELETE
- **Parameters**: 
  - `userId` (ID of the user)
- **Request Body**:
  - `senderId`: ID of the user who sent the friend request
- **Description**: Removes a friend request from the user's list of pending requests.
