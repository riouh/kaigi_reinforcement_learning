<script lang="ts">
    import type {QValue} from "$lib/types";
    import {convertQValuesToFile} from '$lib/forms';
    import type {FileQTable} from '$lib/forms';

    export let q_table: QValue[][];

    const chooseClass = (i: number): string => {
        const colors = ["table-primary", "table-success", "table-info"];
        return colors[i % colors.length];
    }

    let json: FileQTable;
</script>

<table class="table">
    <thead>
    <tr>
        <th scope="col">#</th>
        {#each q_table[0] as action}
            <th scope="col">{action.action}</th>
        {/each}
    </tr>
    </thead>
    <tbody>
    {#each q_table as state}
        <tr class={chooseClass(state[0].y)}>
            <th scope="row">{`(${state[0].x}, ${state[0].y})`}</th>
            {#each state as action}
                <th scope="col">{action.q_value}</th>
            {/each}
        </tr>
    {/each}
    </tbody>
</table>
<div class="d-flex flex-row-reverse">
    <div
            id="download_result"
            class="mx-2 align-self-center text-center"
            on:click={() => (json = convertQValuesToFile(q_table))} style="width: 40px"
    >
        <a
                href={'data:application/json;charset=utf-8,' + encodeURI(JSON.stringify(json))}
                target="_blank"
                download="q_table.json">
            <i class="bi bi-download" style="width: 1em; height: 1em; font-size: 30px"></i>
        </a>
    </div>
    <label class="my-auto" for="download_result">Download Q-Table</label>
</div>

<style lang="scss">
  .download {
    color: #4e688a;
  }

  .download:hover {
    cursor: pointer;
    color: darken(#4e688a, 10);
  }
</style>
