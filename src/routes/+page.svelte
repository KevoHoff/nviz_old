<script>
    import Header from "$lib/Header.svelte";
    import Hero from "$lib//Hero.svelte"

    let page = 0;

    function clickHandler() {
      page = 1;
    }
</script>

<main>
  <Header/>
  <Hero on:click={clickHandler}/>
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