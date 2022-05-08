<script lang="ts">
    import {Chart} from "chart.js";
    import {onMount} from "svelte";

    export let chart: Chart | undefined = undefined;

    let chartValues = [];
	let chartLabels = [];

    onMount(async () => {
        const {Chart, registerables} = await import('chart.js');
        Chart.register(...registerables);
        if (typeof window != 'undefined') {
           let ctx = document.getElementById("myChart").getContext("2d") as HTMLCanvasElement;
           ctx.height = 250;
           chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                    labels: chartLabels,
                    datasets: [{
                            label: 'Episode length',
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: chartValues,
                            pointRadius: 1
                    }],

            },
		});
        }
	});
</script>

<div class="mx-5 px-5">
    <canvas id="myChart"></canvas>
</div>


