/** @type {import('./types').Action[]} */
export const ACTIONS = ["up", "down", "right", "left"];

/** @type {import('./types').State[]} */
export const STATES = [
    {x:0, y:3, reward: -10, color: "red"}, {x:1, y:3, reward: -1, color: "aquamarine"}, {x:2, y:3, reward: 0, color: "aquamarine"}, {x:3, y:3, reward: 100, color: "green"},
    {x:0, y:2, reward: -1, color: "aquamarine"}, {x:1, y:2, reward: -1, color: "aquamarine"}, {x:2, y:2, reward: -10, color: "red"}, {x:3, y:2, reward: -1, color: "aquamarine"},
    {x:0, y:1, reward: -1, color: "aquamarine"}, {x:1, y:1, reward: -10, color: "red"}, {x:2, y:1, reward: -1, color: "aquamarine"}, {x:3, y:1, reward: -1, color: "aquamarine"},
    {x:0, y:0, reward: -1, color: "aquamarine"}, {x:1, y:0, reward: -1, color: "aquamarine"}, {x:2, y:0, reward: -1, color: "aquamarine"}, {x:3, y:0, reward: -10, color: "red"},
];

/** @type {import('./types').Position[]} */
export const possible_init_positions = [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 0}, {x: 2, y: 0}];

/** @type {import('./types').QValue[][]} */
export const INIT_Q_VALUES = STATES.map((state) => {
    return ACTIONS.map((action) => {
        return {...state, action, q_value: 0}
    })
})

export class Env {
    /** @type {import('./types').State[]} */
    states = STATES;

    /** @type {number} */
    Xmax = Math.max(...STATES.map(s => s.x));

    /** @type {number} */
    Ymax = Math.max(...STATES.map(s => s.y));
    Xmin = 0
    Ymin = 0

    /** @type {import('./types').State} */
    state;

    /**
     * @param {import('./types').Position} init_position
     */
    constructor(init_position) {
        this.state = this.find_state(init_position);
    }

    /**
     * @param {import('./types').Position} pos
     * @return {import('./types').State}
     */
    find_state(pos) {
        return this.states.find(s => s.x === pos.x && s.y === pos.y) || this.states[0];
    }

    /**
     * @param {import('./types').Action} a
     * @return {import('./types').Episode}
     */
    step(a) {
        const new_position = {x: 0, y: 0};
        switch (a) {
            case "up":
                new_position.x = this.state.x;
                new_position.y = Math.min(this.state.y + 1, this.Ymax);
                break;
            case "down":
                new_position.x = this.state.x;
                new_position.y = Math.max(this.state.y - 1, this.Ymin);
                break;
            case "right":
                new_position.x = Math.min(this.state.x + 1, this.Xmax);
                new_position.y = this.state.y;
                break;
            case "left":
                new_position.x = Math.max(this.state.x - 1, this.Xmin);
                new_position.y = this.state.y;
                break;
        }
        const new_state = this.find_state(new_position);

        /** @type {import('./types').Episode} */
        const episode = {
            state_t: this.state,
            action: a,
            reward: new_state.reward,
            state_tplus1: new_state,
            done: new_state.color === "green",
        }
        this.state = new_state;
        return episode
    }
}

/** @template T */
class Deque {
    /** @type {T} */
    content;

    /** @type {number} */
    len;

    /**
     * @param {number} len
     */
    constructor(len) {
        this.content = [];
        this.len = len;
    }

    /**
     * @param {T} elem
     */
    add(elem) {
        if (this.content.length >= this.len) {
            this.content.shift();
        }
        this.content.push(elem);
    }
}

export class Agent {
    /** @type {import('./types').QValue[][]} */
    Q_TABLE;

    /** @type {import('./forms').FormLearn} */
    learn_options;

    /** @type {import('./forms').FormPlay} */
    play_options;

    /** @type {boolean} */
    play;

    /** @type {Deque<import('./types').Memory>} */
    memory;

    /** @type {number} */
    learn_every_n_episode;

    /**
     * @param {boolean} learn
     * @param {import('./forms').FormLearn} learn_options
     * @param {import('./forms').FormPlay} play_options
     */
    constructor(learn, learn_options, play_options) {
        this.Q_TABLE = learn ? INIT_Q_VALUES : play_options.q_values;
        this.learn_options = learn_options;
        this.play_options = play_options;
        this.play = !learn;
        this.memory = new Deque(learn_options.memory_size);
        this.learn_every_n_episode = learn_options.learn_every_n_episode;
    }

    /**
     * @param {import('./types').Episode} episode
     * @param {number} n_episode
     * @param {number} len_episode
     */
    memorize(episode, n_episode, len_episode) {
        this.memory.add({...episode, n_episode, len_episode});
        if (!this.play && (n_episode % this.learn_every_n_episode === 0)){
            this.learn();
        }
    }

    /**
     * @param {number} n_episodes
     * @return {number}
     */
    get_epsilon(n_episodes) {
        return Math.max(this.learn_options.epsilon_start *
            (this.learn_options.epsilon_episodes_decay - n_episodes) / this.learn_options.epsilon_episodes_decay, this.learn_options.epsilon_end);
    }

    /**
     * @param {number} n_episodes
     * @return {number}
     */
    get_learning_rate(n_episodes) {
        return Math.max(this.learn_options.learning_rate_start *
            (this.learn_options.learning_rate_episodes_decay - n_episodes) / this.learn_options.learning_rate_episodes_decay, this.learn_options.learning_rate_end);
    }

    /**
     * @param {import('./types').State} state
     * @param {number} n_episode
     * @return {import('./types').Action}
     */
    act(state, n_episode) {
        // epsilon belongs to [0 ; 1] and is the probability of picking an action randomly
        if (Math.random() <= this.get_epsilon(n_episode) && !this.play) {
            // Take action randomly
            return this.getRandomAction();
        } else {
            // Take action based on greatest q_values for this state
            return this.getLearnedAction(state);
        }
    }

    /**
     * @param {import('./types').State} state
     * @return {import('./types').Action}
     */
    getLearnedAction(state) {
        const state_index = STATES.findIndex(s => s.x === state.x && s.y === state.y);
        const q_values = this.Q_TABLE[state_index];
        const max_q_value = Math.max(...q_values.map(q => q.q_value));
        const actions = q_values.filter(q => q.q_value === max_q_value);
        const action = actions[Math.floor(Math.random() * actions.length)]?.action;
        if (action === undefined) {
            throw new Error(`Action is undefined`);
        } else {
            return action;
        }
    }

    learn() {
        this.memory.content.forEach(e => {
            this.q_learning(e.state_t, e.action, e.state_tplus1, e.reward, e.n_episode);
        })
    }

    /**
     * @param {import('./types').State} s_t
     * @param {import('./types').Action} action_taken
     * @param {import('./types').State} s_t_plus_1
     * @param {number} reward
     * @param {number} n_episode
     * @return {import('./types').QValue[][]}
     */
    q_learning(s_t, action_taken, s_t_plus_1, reward, n_episode) {
        const state_index = STATES.findIndex(s => s.x === s_t.x && s.y === s_t.y);
        const q_values = this.Q_TABLE[state_index];
        const action_index = q_values.findIndex(q => q.action === action_taken);

        const state_t_plus_1_index = STATES.findIndex(s => s.x === s_t_plus_1.x && s.y === s_t_plus_1.y);
        const q_values_t_plus_1 = this.Q_TABLE[state_t_plus_1_index];
        const max_q_value_t_plus_1 = Math.max(...q_values_t_plus_1.map(q => q.q_value));
        this.Q_TABLE[state_index][action_index].q_value += this.get_learning_rate(n_episode) * (
            reward
            + this.learn_options.discount_factor * max_q_value_t_plus_1
            - this.Q_TABLE[state_index][action_index].q_value
        )
        return this.Q_TABLE;
    }

    /**
     * @return {import('./types').Action}
     */
    getRandomAction() {
        return ACTIONS[this.getRandomIntInclusive(-0.5, 3.5)]
    }

    /**
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
    getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

/**
* @param {number} ms
* @return {Promise<any>}
*/
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
* @param {import('chart.js').Chart} chart
 * @param {string} label
 * @param {number} data
* @return {void}
*/
export function addData(chart, label, data) {
    chart.data?.labels?.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

/**
* @param {import('chart.js').Chart} chart
* @return {void}
*/
export function resetChart(chart) {
    if (chart.data) {
        chart.data.labels = [];
        chart.data.datasets = [];
        chart.update();
        console.debug("Chart reset!")
    }
}

/** @type {import('./forms').FormLearn} */
export const INIT_LEARN_OPTIONS = {
    nr_episodes: 5000,
    discount_factor: 0.9,

    learning_rate_start: 1,
    learning_rate_end: 0.1,
    learning_rate_episodes_decay: 3000,

    epsilon_start: 1,
    epsilon_end: 0.1,
    epsilon_episodes_decay: 3000,
    memory_size: 3000,
    learn_every_n_episode: 100
};

/** @type {import('./forms').FormPlay} */
export const INIT_PLAY_OPTIONS = {
    nr_episodes: 5000,
    sleep_time_s: 0.1,
    q_values: INIT_Q_VALUES,
};
