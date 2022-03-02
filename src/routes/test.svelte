<script>
    let data1 = [
        {
            measurement: "Power Flow",
         unit: "kW",
            opened: false,
         sources: [
            {"source": "Forecaster 1"},
            {"source": "Forecaster 2"},
        ]},
        {
         measurement: "Temperature",
         unit: "°C",
            opened: false,
         sources: [
            {"source": "Forecaster x"},
             {"source": "Forecaster y"},
        ]},
    ]

    const toggle = (j) => {
        data1[j].opened = !data1[j].opened;
    }

</script>

<div class="container my-3" style="width: 500px">
<table class="table table-bordered">
    <thead>
        <tr>
          <th scope="col">Measurmeent</th>
            <th scope="col">Unit</th>
          <th scope="col">Source</th>
          <th scope="col">Main</th>
        </tr>
    </thead>
    <tbody>
        {#each data1 as row}
            {#each row.sources as source, i}
                <tr>
                    <td>{row.measurement}</td>
                    <td>{row.unit}</td>
                    <td>{source.source}</td>
                    <td>
                        <input
                            class="form-check-input"
                            type="radio"
                            name={"flexRadioDefault" + row.measurement}
                            id={"flexRadioDefault" + i}
                        >
                    </td>
                </tr>
            {/each}
        {/each}
    </tbody>
</table>
</div>

<div style="height: 50px"></div>

<div class="container my-3" style="width: 500px">
<table class="table table-bordered">
    <thead>
        <tr>
          <th scope="col">Measurmeent</th>
          <th scope="col">Unit</th>
          <th scope="col">Sources</th>
        </tr>
    </thead>
    <tbody>
        {#each data1 as row, j}

                <tr>
                    <td>{row.measurement}</td>
                    <td>{row.unit}</td>
                    <td class="text-center">
                        {#if row.opened}
                            <i class="hover bi bi-caret-up" on:click={() => {toggle(j)}}></i>
                        {:else}
                            <i class="hover bi bi-caret-down" on:click={() => {toggle(j)}}></i>
                        {/if}
                    </td>
                </tr>
            {#if row.opened}
                <tr>
                        <td colspan="3">
                            <table class="table mb-0 px-5 table-secondary">
                                <thead>
                                <tr>
                                    <th scope="col">Source</th>
                                    <th scope="col">Main</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {#each row.sources as source, i}
                                        <tr>
                                            <td>{source.source}</td>
                                            <td>
                                                <input
                                                    class="form-check-input"
                                                    type="radio"
                                                    name={"flexRadioDefault" + row.measurement}
                                                    id={"flexRadioDefault" + i}
                                                >
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>

                        </td>
                </tr>
            {/if}
        {/each}
    </tbody>
</table>
</div>

<style>
    .hover:hover {
        cursor: pointer;
    }
</style>