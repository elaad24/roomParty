Here is the updated version with code blocks for the commands and code references:

---

## **README.md**

# RoomParty API Documentation

This project is a backend API built with Django for a music-sharing platform called "RoomParty." The API allows a host to play music in a room, where other users can join, vote for the current song, and request changes based on votes.

## **Setup and Configuration**

1. Clone the repository and install dependencies.

   ```bash
   git clone <repo_url>
   cd roomparty-backend
   pip install -r requirements.txt
   ```

2. Apply migrations to set up the database:

   ```bash
   python manage.py migrate
   ```

3. Run the development server:

   ```bash
   python manage.py runserver
   ```

### **Core Models**

- **User (Extended from Django User)**:

  - Fields: `username`, `password`, `room` (ForeignKey), `host` (Boolean).
  - Tokens: Access and refresh tokens are generated on user creation.

- **RoomModel**:

  - `room_key`: Unique identifier for each room.
  - `host`: Reference to the host user (ForeignKey to User).
  - `vote_requirement_type`: Defines how many votes are needed to change a song (either by number or percentage).
  - `vote_requirement_value`: Number or percentage required for a song change.

- **VotesModel**:

  - Represents each room's voting status.
  - Fields include `current_song_id`, `current_song_image`, `like_count`, `dislike_count`.
  - Data is summarized by signals, and the model is updated automatically based on votes received from `UserVotesModel`.

- **UserVotesModel**:
  - Records every user’s voting action in a room.
  - Fields include `user_id`, `room_id`, `vote_type` (like/dislike).
  - Ensures only current song votes are recorded, ignoring outdated requests.
  - When a song changes, previous votes for that song are deleted.

---

### **API Endpoints Overview**

#### **User Management**

- **Create User API**:

  - Creates a new user with `username`, `password`, `room`, and `host` status.
  - Automatically generates and returns access and refresh tokens.
  - Checks for a unique username during registration.

- **Login API**:
  - Handles user authentication with `username` and `password`.
  - Generates new access and refresh tokens upon successful login.

#### **Room Management**

- **Create Room API**:

  - Generates a unique `room_key` when a new room is created.
  - If the user already has a room, the previous room is deleted from both `RoomModel` and `VotesModel`.
  - Deletes any associated votes in `UserVotesModel` for the previous room.
  - An instance in `VotesModel` is created to represent the new room.
  - **New feature**: When a room is deleted, the room key is also removed from any users who were in that room, setting their room field to `null`.

- **Enter Room API**:
  - Users enter a room by providing a valid `room_key`.
  - Updates the user's `room` field to link them to the new room.
  - Removes the previous room assignment from the user (ensuring the user is in only one room at a time).

#### **Voting System**

- **Vote API**:
  - Allows a user to vote for the current song in a room (`like`/`dislike`).
  - Verifies that the user is in the correct room before submitting the vote.
  - If the user has already voted for the current song, their previous vote is updated.
  - Ensures votes only apply to the currently active song and not outdated ones.
  - Triggers a signal to update the `VotesModel` with the vote tally.

#### **Song Management**

- **Change Song API**:
  - Changes the current song in a room, updating the `current_song_id` and `current_song_image` in `VotesModel`.
  - Resets `like_count` and `dislike_count` for the new song.
  - Deletes all previous votes from `UserVotesModel` for the previous song in that room.

---

### **Signals**

- **VotesModel Update**:

  - A signal that listens for changes in `UserVotesModel` and updates the vote tally in `VotesModel` for the room.
  - Automatically updates `like_count` and `dislike_count` whenever a vote is cast.

- **Clean-up on Song Change**:
  - Another signal that listens for song changes and cleans up `UserVotesModel`, removing votes related to the previous song.

---

### **Authentication**

- All API views are protected by authentication. The `authView` middleware grabs the access token from the request and validates the user.

---

### **Features Completed**

1. **User Registration and Token Generation**: Created functionality to register new users, checking for unique usernames and returning access and refresh tokens.
2. **Room Creation**: When a room is created, a unique room code is generated. Old rooms and their related votes are deleted if the user had a previous room. **Additionally, the room key is removed from other users who were in the deleted room.**
3. **Enter Room**: Users can join rooms by submitting a valid room key, which updates their user data.
4. **Voting System**: Implemented a vote model to track user votes, ensuring only one vote per song per user. Votes are analyzed by signals and the tally is automatically updated in the room's vote model.
5. **Song Management**: Created a function to change the current song in a room, reset vote counts, and clean up previous song data.
6. **Authentication**: All views are protected using an access token validation function (`authView`), ensuring only authenticated users can interact with the API.

---

### **Future Work**

- **Real-time Updates**: Transition from REST to WebSockets for live updates (e.g., song changes, vote tallies).
- **Spotify Integration**: Implement Spotify login and recommendations using user song preferences and AI-based analysis.

---
