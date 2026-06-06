# DevTinder APIs

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password // Forgot password API

## connectionRequestRouter

- POST /request/send/:status/:userId

## userRouter

- GET /user/matches - Gets you the profiles of users you have matched with
- GET /user/feed - Gets you the profiles of other users on platform
- GET /user/feed/cursor - Gets you the profiles of other users on platform using cursor pagination

## health

- GET /health - To check if the server is running

Status: ignored, interested, accepted, rejected
