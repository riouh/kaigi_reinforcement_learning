import {Server} from "socket.io";
import {Agent, Env, INIT_PLAY_OPTIONS, possible_init_positions} from "../lib/rl.js";

/**
* @param {import('socket.io').Socket} socket
* @param {import('./forms').FormLearn} learn_options
* @return {void}
*/
function learn(socket, learn_options) {
    const n_episodes_max = learn_options.nr_episodes;
    let n_episode = 0;
    const agent = new Agent(true, learn_options, INIT_PLAY_OPTIONS);

    const start_time = Date.now();

    while (n_episode <= n_episodes_max) {
        console.log(`Episode: ${n_episode}/${n_episodes_max}`)
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
        n_episode++;
    }
    socket.emit("finished_learning",  {process_time_s: (Date.now() - start_time) / 1000});
}

/**
* @param {import('vite').ViteDevServer} server
* @return {void}
*/
export function configureServer(server) {
    const httpServer = server.httpServer;
    if (httpServer != null) {
        const io = new Server(httpServer);

        io.on('connection', (socket) => {
            console.log("Socket connection established with ID: ", socket.id);

            /**
            * @param {{learn_options: import('./forms').FormLearn}} launch_payload
            * @return {void}
            */
            const func = (launch_payload) => {
                console.log("Received launch training order")
                learn(socket, launch_payload.learn_options);
            };

            // Receive incoming messages and broadcast them
            socket.on('launch_training', func);


            socket.on("connect_error", (err) => {
              console.log(`Connection error due to ${err.message}`);
            });
        });
        console.log('SocketIO injected');
    } else {
        console.warn("Websocket server not launched. No HTTP server found.")
    }
}