import {Agent, Env, INIT_PLAY_OPTIONS, possible_init_positions} from "./src/lib/rl.js";
import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";


async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: {
    origin: "http://localhost:3002", connectTimeout: 99999999999
  } });

io.on('connection', (socket) => {
    console.log("Socket connection established with ID: ", socket.id);

    // Receive incoming messages and broadcast them
    socket.on('launch_training', async (launch_payload) => {
        const n_episodes_max = launch_payload.learn_options.nr_episodes;
        const agent = new Agent(true, launch_payload.learn_options, INIT_PLAY_OPTIONS);
        const start_time = Date.now();

        const episodes = new Array(n_episodes_max + 1).fill(0)
        let n_episode = 0
        for (const _ of episodes) {
            console.log(`Episode: ${n_episode}/${n_episodes_max}`);
            await timeout(60);
            await train(agent, n_episode, socket);
            n_episode++;
        }
        socket.emit("finished_learning", {process_time_s: (Date.now() - start_time) / 1000});
    });


    socket.on("connect_error", (err) => {
        console.log(`Connection error due to ${err.message}`);
    });

    socket.on("disconnect", (reason) => {
        console.log("Disconnection.." + reason)
    });
});
console.log('SocketIO injected');

io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

/**
 * @param {import('./src/lib/rl.js').Agent} agent
 * @param {number} n_episode
 * @param {import('socket.io').Socket} socket
 * @return {number}
 */
async function train(agent, n_episode, socket) {
    const new_init_position = possible_init_positions[Math.floor(Math.random() * possible_init_positions.length)];
    const env = new Env(new_init_position);
    let state = env.state;
    let done = false
    let len_episode = 0;
    while (!done) {
        const action = agent.act(state, n_episode);
        const episode = env.step(action);
        agent.memorize(episode, n_episode, len_episode);
        done = episode.done;
        state = episode.state_tplus1;
        len_episode++;
    }
    socket.emit("episode_terminated", {n_episode, len_episode, q_table: agent.Q_TABLE});
    console.log("Emitting: ", {n_episode});
}


httpServer.listen(3000);
