# Unchated Waters: A web Virtual Reality environment

Uncharted Waters is a multiplayer VR network game using Express(todo), MongoDB(todo), Vue and three.js.

Demo: <a>webpj.ruchenshanghai.cn</a>

## Communications

- 胡弋舟 15302010002@fudan.edu.cn
- 麻俊特 15302010022@fudan.edu.cn
- 文进 14307110274@fudan.edu.cn
- 吴豪奇 15302010016@fudan.edu.cn



## What is it?

Uncharted Waters is a multiplayer VR network game. Players can login the game after registered.

In the main scene of the game, you can drive your ship with the keyboard buttons "w,a,s,d" and fire with "f". You can also switch your view scope with the help of the up and down buttons. And space is used to locate the view scope to your ship.

Players can also chat with other players in the chat room embedded in the scene, along with a ranklist and your own status board. 

<img src="https://github.com/xianyinuma/totalProject/blob/master/photo/demo1.jpeg">

## Programe Architecture

Front end : ./public/

We use vue.js and three.js to write the front end of the project. While vue.js is used to write the login and register pages and the main scene of the game is built with the help of three.js.

With socket.io, an online chat room is embedded in the game.

In ./public/js/sea-battle/ , all the JavaScript files of the objects can be found, and in ./public/assets/ their models can be found.


## What we have done?

1. The front end.
    1. Model building of ships, scene, skybox, bonus boxes, portals.
    2. The movement of ships, and the fire function.
    3. The status of players, including the health, current level, current score, etc.
    4. The function of bonus boxes and portals.
    5. The login and register page.
2. Chat Room
3. Definiton of APIs, regulating the interaction between front and back end.

## todo
We are going to complete the development of back end soon. After adding various users into our scene, we will adjust the movement and fire of the ship; also, we will apply a better way of view scope moving including its restriction and a better shadowing system.

We are going to build a user database with MongoDB.

We are going to apply docker. 

If possible, the UI design will be optimized.

If possible, we will apply natural language processing technology to add some NPCs into the scene to interact with the player (including the accompolishment system or other EXCITING interaction).

