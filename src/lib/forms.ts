import type {QValue} from "$lib/types";
import {ACTIONS, INIT_Q_VALUES} from "$lib/rl.js";
import type {Action} from "$lib/types";

interface FormBase {
    nr_episodes: number;
}

export interface FormLearn extends FormBase {
    discount_factor: number;

    learning_rate_start: number;
    learning_rate_end: number;
    learning_rate_episodes_decay: number;

    epsilon_start: number;
    epsilon_end: number;
    epsilon_episodes_decay: number;

    memory_size: number;
    learn_every_n_episode: number;
}

export interface FormPlay extends FormBase{
    sleep_time_s: number;
    q_values: QValue[][];
}

export interface FileQTable {
    states: Array<{
        state: { x: number, y: number },
        actions: Array<{ action: Action, q_value: number }>
    }>
}

export function convertQValuesFromFile(file: FileQTable): QValue[][] {
    const init_q_table = [...INIT_Q_VALUES];
    return file.states.map(s => {
        const qvalues = init_q_table.find(i => i[0].x === s.state.x && i[0].y === s.state.y);
        return qvalues?.map(q => {
            const action = s.actions.find(a => a.action === q.action)
            return {...q, q_value: action?.q_value || 0}
        }) || [];
    })
}

export function convertQValuesToFile(q_values: QValue[][]): FileQTable {
    return {states: q_values.map(q => {
        return {
            state: {x: q[0].x, y: q[0].y},
            actions: q.map(action => {return {action: action.action, q_value: action.q_value}})
        }
    })}
}

function assert(condition: boolean, message?: string): void {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

export function isFileQTable(json: Record<string, any>): json is FileQTable {
    try {
        const q_table: FileQTable = {
            states: json.states.map((s: Record<string, any>) => {
                assert(typeof s.state.x === 'number');
                assert(typeof s.state.y === 'number');
                return {
                    state: {x: s.state.x, y: s.state.y},
                    actions: s.actions.map((a: Record<string, any>) => {
                            assert(ACTIONS.includes(a.action), `Action ${a.action} in q_table json file not supported.`);
                            assert(typeof a.q_value === 'number');
                            return {
                                action: a.action,
                                q_value: a.q_value
                            }
                        }
                    )
                }
            })
        }
        return true;
    } catch (e) {
        console.warn(e)
        return false;
    }
}
