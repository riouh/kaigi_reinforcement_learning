export type Action = "up" | "down" | "right" | "left";

export interface Position {
    x: number;
    y: number;
}

export interface State extends Position{
    reward: number;
    color: string;
}

export interface Episode {
    state_t: State;
    action: Action;
    reward: number;
    state_tplus1: State;
    done: boolean;
}

export interface QValue extends State {
    action: Action;
    q_value: number;
}

export interface Memory extends Episode {
    n_episode: number;
    len_episode: number;
}
