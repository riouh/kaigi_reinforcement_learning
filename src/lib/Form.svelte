<script lang="ts">
    import FormLearn from "$lib/FormLearn.svelte";
    import FormPlay from "$lib/FormPlay.svelte";
    import type {FormLearn as FormLearnType} from "$lib/forms";
    import type {FormPlay as FormPlayType} from "$lib/forms";
    import {Modal, ModalBody, ModalHeader, Button, ModalFooter} from 'sveltestrap';

    export let learn_options: FormLearnType
    export let play_options: FormPlayType
    export let submit: () => Promise<void>;
    export let learn: boolean;

    let openLearnModal = false;
    let openPlayModal = false;

    const toggleLearn = () => {
        openLearnModal = !openLearnModal;
    }
    const togglePlay = () => {
        openPlayModal = !openPlayModal;
    }

    async function handleKeydown(event) {
		if (event.keyCode === 'Enter') {
            await submit();
        }

	}

    $: learn = openLearnModal === true;
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="row">
    <div class="col d-grid">
        <button type="button" class="btn btn-primary btn-lg" on:click={toggleLearn}>Learn</button>
    </div>
    <div class="d-grid col">
        <button type="button" class="btn btn-primary btn-lg" on:click={togglePlay}>Play</button>
    </div>
</div>

<Modal isOpen={openLearnModal} toggle="{toggleLearn}">
    <ModalHeader {toggleLearn}>Parameters for Learning</ModalHeader>
    <ModalBody>
      <FormLearn bind:options={learn_options}/>
    </ModalBody>
    <ModalFooter>
      <button on:click={async() => {toggleLearn(); await submit();}} type="button" class="btn btn-primary">Learn!</button>
      <Button color="secondary" on:click={toggleLearn}>Cancel</Button>
    </ModalFooter>
</Modal>

<Modal isOpen={openPlayModal} toggle="{togglePlay}">
    <ModalHeader {togglePlay}>Parameters for Playing</ModalHeader>
    <div class="modal-body" style="max-height: 500px; overflow: scroll">
      <FormPlay bind:options={play_options}/>
    </div>
    <ModalFooter>
      <button on:click={async() => {togglePlay(); await submit();}} type="button" class="btn btn-primary">Play!</button>
      <Button color="secondary" on:click={togglePlay}>Cancel</Button>
    </ModalFooter>
</Modal>
