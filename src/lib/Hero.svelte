<script>
    import Button from "$lib/Button.svelte";
</script>

<div class="relative py-[20vh] my-auto flex flex-col gap-8">
    <div class="mx-auto max-w-3xl flex justify-center gap-4">
        <div class="flex flex-col justify-center text-right">
            <h1 class="md:text-5xl sm:text-3xl">Learn <span class="text-secondary">Neural Networks</span> the <span class="text-primary">easy</span> way.</h1>
            <p class="md:text-xl sm:text-lg">Visualize models in your browser</p>
        </div>
        <div class="divider"></div>
        <img class="md:h-96 h-64 md:block hidden" src="nviz.png" alt="nViz Logo">
    </div>
    <a class="grid place-items-center" href="/playground">
        <Button text="Get Started"></Button>
    </a>
</div>
