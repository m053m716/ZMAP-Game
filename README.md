# ZMAP-GAME #
Temporary hosting for development of Slack D&D 5e API as well as website interface. 
The javascript API is built around two main classes, one of which is public (`client`) and one that is private (`server`).   

## Client ##
The `Client` is the part "seen" by the end-user. Nothing should ever be "calculated" on the client side; 
instead, the client only requests that certain calculations are performed (such as a dice roll) and then those are done by the server.

The only exception to this is the initial password salt and hash that happens on the client side so that the actual password is not transmitted directly.

## Server ##
The `Server` actually consists of a few different objects responsible for:
* User interactions (`session`), 
* Storing data (`database`), and 
* Handling random streams (`diceroller`)

### Session ###
There needs to be two types of sessions.

#### Client-Session ####
This object is created when a user logs in and is destroyed after either an idle-timeout occurs or the user logs out. 
It handles the out-of-game client-server interactions like "User Profile" access etc.

#### Game-Session ####
This object is created when a user issues the "START_SESSION" command, and is destroyed when a user issues the "END_SESSION" command (or after an idle timeout). 
It handles the within-game client-server interactions.

### Database ###
The database runs through `MongoDB`. This is a document-oriented database, which means that a given `MongoDB` 