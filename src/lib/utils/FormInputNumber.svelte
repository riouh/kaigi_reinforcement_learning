<script lang="ts">
    import {FormGroup, Input, Label} from 'sveltestrap';

    export let value: number;
    export let title: string
    export let placeholder = 'Enter a value'
    export let id: string
    export let step = 1
</script>

<FormGroup>
    <div class="row">
        <div class="col-4 my-auto">
            <Label for={id}>{title}</Label>
        </div>
        <div class="col-8">
            <Input {step} {id} required type="number" placeholder={placeholder} bind:value/>
        </div>
    </div>
</FormGroup>
