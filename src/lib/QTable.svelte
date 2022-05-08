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

    let edit_mode = false;

    const toggle = () => {
        edit_mode = !edit_mode;
    }
</script>

<table class="table align-middle">
    <thead>
    <tr>
        <th scope="col" style="width: 100px">#</th>
        {#each q_table[0] as action}
            <th scope="col">{action.action}</th>
        {/each}
    </tr>
    </thead>
    <tbody class="align-middle">
    {#each q_table as state, i}
        <tr class={chooseClass(state[0].y)}>
            <th scope="row">{`(${state[0].x}, ${state[0].y})`}</th>
            {#each state as action, j}
                <th scope="col">
                    {#if edit_mode}
                        <input
                            id="{`${i},${j}`}"
                            type="number"
                            class="form-control"
                            bind:value="{action.q_value}"
                        />
                    {:else}
                        <div style="height: 38px;">{action.q_value}</div>
                    {/if}
                </th>
            {/each}
        </tr>
    {/each}
    </tbody>
</table>

<div class="d-flex flex-row align-items-center justify-content-between pb-5">
    <div>
        <button class="btn btn-white" on:click={toggle}>
        {#if edit_mode}
            <i class="bi bi-pencil-fill"/>
        {:else}
            <i class="bi bi-pencil"/>
        {/if}
            </button>
    </div>

    <div>
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
    </div>
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
