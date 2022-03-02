<script lang="ts">
	import type {State} from "$lib/types";
	import {STATES} from "$lib/rl.js";

	export let state: State

	const max_y = Math.max(...STATES.map(s => s.y));
	const Ys = [...Array(max_y + 1).keys()];
	const board: State[][] = Ys.map(y => STATES.filter(s => s.y === y));
</script>


<div class="constainer p-3 d-flex justify-content-center">
	<div style="height: 200px; width: 400px">
{#each board as row, j}
	<div class="row">
		{#each row as col, i}
			<div class="col border" style={`background-color: ${col.color}`}>
				<div class="row">
					<div class="col">{col.reward}</div>
					<div class="col"></div>
					<div class="col"></div>
				</div>
				<div class="row">
					<div class="col"></div>
					<div class="col">
						{#if state.x === i && state.y === j}
							<span class="dot">
								<i class="bi bi-person"></i>
							</span>
						{:else}
							<span class="dot"/>
						{/if}
					</div>
					<div class="col"></div>
				</div>
			</div>
		{/each}
	</div>
{/each}
	</div>
	</div>


<style>
	.dot {
		height: 25px;
		width: 25px;
		background-color: transparent;
		border-radius: 50%;
		display: inline-block;
	}
</style>
