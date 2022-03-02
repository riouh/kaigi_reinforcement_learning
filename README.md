# Reinforcement learning introduction

This repo proposes a small UI to train an test Q-Learning agents on a simple game.
The UI is made with Svelte and Typescript. The Q-learning algorithm runs in a nodeJS server and the communication 
with the UI is made via Websocket to give a real-time sensation to the user during the learning phase.

You can use it in local. For that, you will need to have nodeJS 16 and npm 8 installed. 

`
 cd rl-demo
 npm install
 npm run dev
`

Then, access the UI on http://localhost:3002
