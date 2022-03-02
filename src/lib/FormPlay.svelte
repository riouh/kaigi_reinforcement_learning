<script lang="ts">
    import {Form, FormGroup, Label} from 'sveltestrap';
    import type {FormPlay} from "$lib/forms";
    import FormInputNumber from "$lib/utils/FormInputNumber.svelte";
    import {convertQValuesFromFile, isFileQTable} from "$lib/forms";

    export let options: FormPlay;

    function processFile(event): void {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (typeof event.target.result === "string") {
                const temp_jsonObj = JSON.parse(event.target.result);
                if (isFileQTable(temp_jsonObj)) {
                    options.q_values = convertQValuesFromFile(temp_jsonObj);
                }
            }
        }
        reader.readAsText(event.target.files[0]);
    }
</script>

<Form validated id="submit">
    <FormInputNumber title='Number of episodes' bind:value={options.nr_episodes} id="nr_episodes"/>
    <FormInputNumber step={0.01} title='Sleep time (s)' bind:value={options.sleep_time_s} id="sleep_time_s"/>
    <FormGroup>
        <div class="row align-content-center">
            <div class="col-4 my-auto">
                <Label for="exampleFile">Initial Q-Values</Label>
            </div>
            <div class="col-8">
                <div class="input-group">
                    <input
                        type="file"
                        accept="application/json"
                        class="form-control"
                        id="inputGroupFile04"
                        aria-describedby="inputGroupFileAddon04"
                        aria-label="Upload"
                        on:click|stopPropagation
                        on:change={processFile}
                    />
                </div>
            </div>
        </div>
    </FormGroup>

    <slot name="submit"/>
</Form>
