<script>
    import Header from "$lib/Header.svelte";
    import DataSelector from "$lib/DataSelector.svelte";
    import DataViewer from "$lib/DataViewer.svelte";
    import Spinner from '$lib/Spinner.svelte';
	  import Playground from "$lib/Playground.svelte";
	  import Breadcrumb from "$lib/Breadcrumb.svelte";

    let csv = null;
    let df;
    let state = 0;
    let loading = false;
    let dummy_vars = true;

    const options = [
      { util: 'selector', component: DataSelector },
      { util: 'viewer', component: DataViewer },
      { util: 'playground', component: Playground }
    ]

    function handleUpload(event) {
      csv = event.detail.csv

      console.log(csv);
      state = 1;
      loading = false;
    }

    function handleViewer(event) {
      df = event.detail.df;
      state = 2;
    }
</script>
          

<main>
  <Header/>
  {#if loading}
  <div class="flex justify-center w-full h-full items-center">
    <Spinner></Spinner>
  </div>
  {:else}
    {#if state === 0}
    <DataSelector {csv} {loading} bind:dummy_vars on:upload={handleUpload}/>
    {:else if state === 1}
    <DataViewer {csv} {dummy_vars} on:upload={handleViewer}/>
    {:else if state ===2}
    <Playground {df}></Playground>
    {/if}
  {/if}
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    background: -moz-linear-gradient(to bottom right, rgba(204,204,204,0.34) 0%, rgba(204,204,204,0.1) 100%);
    background: -webkit-linear-gradient(to bottom right, rgba(204,204,204,0.34) 0%, rgba(204,204,204,0.1) 100%);
    background: linear-gradient(to bottom right, rgba(204,204,204,0.34) 0%, rgba(204,204,204,0.1) 100%);
  }
</style>