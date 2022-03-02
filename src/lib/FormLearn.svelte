<script lang="ts">
    import {Form} from 'sveltestrap';
    import type {FormLearn} from "$lib/forms";
    import FormInputNumber from "$lib/utils/FormInputNumber.svelte";

    export let options: FormLearn;
</script>


<Form validated id="submit">
    <FormInputNumber title='Number of episodes' bind:value={options.nr_episodes} id="nr_episodes"/>
    <FormInputNumber step={0.01} title='Discount Factor' bind:value={options.discount_factor} id="discount_factor"/>
    <FormInputNumber step={0.01} title='Learning rate (start)' bind:value={options.learning_rate_start} id="learning_rate_start"/>
    <FormInputNumber step={0.01} title='Learning rate (end)' bind:value={options.learning_rate_end} id="learning_rate_end"/>
    <FormInputNumber title='# Episodes LR decay' bind:value={options.learning_rate_episodes_decay} id="learning_rate_episodes_decay"/>
    <FormInputNumber step={0.01} title='Epsilon (start)' bind:value={options.epsilon_start} id="epsilon_start"/>
    <FormInputNumber step={0.01} title='Epsilon (end)' bind:value={options.epsilon_end} id="epsilon_end"/>
    <FormInputNumber title='# Episodes Epsilon decay' bind:value={options.epsilon_episodes_decay} id="epsilon_episodes_decay"/>
    <FormInputNumber title='Memory size (# episodes)' bind:value={options.memory_size} id="memory_size"/>
    <FormInputNumber title='Learn every N episode' bind:value={options.learn_every_n_episode} id="learn_every_n_episode"/>
</Form>