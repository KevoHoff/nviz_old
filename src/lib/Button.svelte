<script>
    export let state  = 'primary';
    export let size = 'md';
    export let text = 'lorem';
    export let active = 'active';

    let states = {
        'primary': 'text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800',
        'outline': 'text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:hover:bg-purple-600 dark:focus:ring-purple-800'
    }

    let sizes = {
        'xs': 'px-3 py-2 text-xs font-medium',
        'sm': 'px-3 py-2 text-sm font-medium',
        'md': 'px-5 py-2.5 text-sm font-medium',
        'lg': 'px-5 py-3 text-base font-medium'
    }

</script>

{#if active=='active'}
<button type="button" class="{states[state].concat(" ", sizes[size])}">{text}</button>
{:else}
<button type="button" class="{states[state].concat(" ", sizes[size], " ", "cursor-not-allowed")}" disabled>{text}</button>
{/if}