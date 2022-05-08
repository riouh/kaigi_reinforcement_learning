<script lang="ts">
    import Board from '$lib/Board.svelte';
    import {Agent, Env, INIT_LEARN_OPTIONS, INIT_PLAY_OPTIONS, possible_init_positions, sleep} from "$lib/rl.js";
    import type {QValue} from "$lib/types";
    import type {Position} from "$lib/types";
    import {writable} from "svelte/store";
    import QTable from '$lib/QTable.svelte';
    import { TabContent, TabPane } from 'sveltestrap';
    import {addData, resetChart} from "$lib/rl.js";
    import type {Chart} from "chart.js";
    import ChartComp from '$lib/Chart.svelte';
    import Form from '$lib/Form.svelte';
    import type {FormLearn as FormLearnType, FormPlay as FormPlayType} from "$lib/forms";
    import {onMount} from "svelte";
    import {io} from "$lib/client";

    let chart: Chart;

    const init_position: Position = {x: 0, y: 0};
    const env = new Env(init_position);
    const state_store = writable(env.state);

    let learn = true;
    let n_episode = 0
    let learn_options: FormLearnType = {...INIT_LEARN_OPTIONS};
    let play_options: FormPlayType = {...INIT_PLAY_OPTIONS};

    let launched = false;
    let q_table: QValue[][] = play_options.q_values;
    let loading = 0;

    async function play() {
        launched = true;
        const agent = new Agent(false, learn_options, play_options);
        let n_ep = 0

        while (n_ep <= play_options.nr_episodes && launched) {
            console.log("Episode: ", n_ep);
            const new_init_position: Position = possible_init_positions[Math.floor(Math.random() * possible_init_positions.length)];
            const env = new Env(new_init_position);
            let state = env.state;
            let done = false
            let len_episode = 0;

            state_store.set(state);
            await sleep(play_options.sleep_time_s * 1000);

            while (!done && launched) {
                const action = agent.act(state, n_ep);
                const episode = env.step(action);
                done = episode.done || len_episode > 30;
                state = episode.state_tplus1;

                state_store.set(state);
                await sleep(play_options.sleep_time_s * 1000);

                len_episode++;
            }
            loading = Math.round(
                n_ep * 100 / play_options.nr_episodes
            );
            addData(chart, n_ep.toString(), len_episode)
            n_ep++;
        }
        launched = false;
    }

    async function submit() {
        if (learn) {
            launched = true;
            io.emit("launch_training", {learn_options});
        } else {
            await play();
        }
    }

    onMount(() => {
        io.on("episode_terminated", message => { // Listen to the message event
            n_episode = message.n_episode;
            loading = Math.round(
                n_episode * 100 / learn_options.nr_episodes
            );
            q_table = message.q_table;
            addData(chart, message.n_episode.toString(), message.len_episode);
            console.log("Finished episode " + n_episode);
        })
        io.on("finished_learning", message => { // Another listener for the name:
            console.log(`Finished learning in ${message.process_time_s} seconds!`)
            launched = false;
        })
    })

    const stop = () => {
        launched = false;
        state_store.set(new Env({x: 0, y: 0}).state);
        resetChart(chart);
    }

    const assignQTable = (qtable) => {
        play_options = {...play_options, q_values: qtable};
    }

    const assignPlayOptions = (playOptions) => {
        q_table = playOptions.q_values;
    }

    $: assignQTable(q_table);
    $: assignPlayOptions(play_options);
</script>

<div class="container py-3 px-5">
    {#if !launched}
        <Form bind:learn bind:learn_options bind:play_options {submit}/>
    {:else}
        <div class="progress my-3">
          <div class="progress-bar" role="progressbar" style={`width: ${loading}%`} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{`${loading}%`}</div>
        </div>
        <button type="button" class="btn btn-danger" on:click={stop}>Stop</button>
    {/if}

    <Board state={$state_store} />

    <TabContent>
      <TabPane tabId="alpha" tab="Performance chart" active>
        <ChartComp bind:chart/>
      </TabPane>
      <TabPane tabId="bravo" tab="Q-Table">
        <div class="mx-5 px-5">
            <QTable bind:q_table/>
        </div>
      </TabPane>
    </TabContent>
</div>
