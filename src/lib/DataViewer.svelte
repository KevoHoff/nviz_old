<script>
	import { DataFrame } from "./DataFrame";
    import Overlay from 'svelte-overlay';
    import { createEventDispatcher } from 'svelte';
    import Papa from 'papaparse';

    export let csv = null;
    export let dummy_vars = true;

    const dispatch = createEventDispatcher()
    
    let df = new DataFrame(csv.meta.fields, csv.data)
    let num_headers = df.headers.length;
    let modal = true;
    let num_decimals = 2;

    $: num_headers = df.headers.length;
    
    if (dummy_vars) {
        df.make_dummy_cols()
    }

    let selected_col = df.headers[0];

    function popCol(key) {

        const idx = df.headers.indexOf(key);

        df.pop(key);
        df = df;

        if (idx === 0) {
            selected_col = df.headers[idx];
        } else {
            selected_col = df.headers[idx-1];
        }
    }

    function renameCol(key, new_key) {
        df.rename(key, new_key);
        df = df;
    }

    function normalize() {
        df.summarize()
        df = df.normalize()
    }

    function toggleModal() {
        modal = !modal;
    }

    function onSubmit(e) {
        const formData = new FormData(e.target);

        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }

        renameCol(selected_col, data['colName']);
        toggleModal();
        
        e.target.reset();
    }

    function downloadCSV() {  // TODO: Kevin
        let text = Papa.unparse(df.data);
        const file = new File([text], 'test.csv', {
            type: 'text/plain'
        })
    }

    function submitDF() {
        console.log('submitted')
        dispatch('upload', {df: df});
        
    }
    
</script>

<main>
    <div class="relative px-6">
        <div class="mx-auto max-w-3xl mt-[10vh] flex flex-col justify-center">
            <div class="grid-container max-h-[60vh]">
                <div class="relative shadow-md sm:rounded-lg overflow-auto">
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-auto">
                        <thead class="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                            <tr>
                                {#each df.headers as header}
                                <th scope="col" class="py-1 px-4">
                                    <button class="hover:bg-gray-100 sm:rounded-md p-2" class:bg-gray-200={selected_col==header} on:click|self={() => {selected_col = header}} on:focus={() => {selected_col = header}}>
                                        {header}
                                    </button>
                                </th>
                                {/each}
                            </tr>
                        </thead>
                        <tbody>
                            {#each df.data as row}
                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                {#each df.headers as header}
                                <td class="py-4 mx-6 text-center">
                                    {#if df.types[header]}
                                    <span class="opacity-50 text-xs">{df.filters[header][row[header]]} →</span> {row[header].toFixed(num_decimals)}
                                    {:else}
                                    {row[header].toFixed(num_decimals)}
                                    {/if}
                                </td>
                                {/each}
                            </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                <div class="controls flex flex-col justify-around gap-4">
                    <div class="bg-white shadow-md sm:rounded-lg p-4">
                        <h3 class="text-md font-semibold">{selected_col}</h3>
                        <hr class="my-4 h-px bg-gray-200 border-0 dark:bg-gray-700">
                        <div class="">
                            <h4>Actions</h4>
                            <ul class="p-2">  
                                <li><button on:click={() => {popCol(selected_col)}} disabled={df.headers.length <= 1} class:cursor-not-allowed={df.headers.length <= 1} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Remove</button></li>
                                <li><button on:click={() => {toggleModal()}} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Rename</button></li>
                            </ul> 
                        </div>
                    </div>
                    <div class="bg-white shadow-md sm:rounded-lg p-4">
                        <h3 class="text-md font-semibold">Global</h3>
                        <hr class="my-4 h-px bg-gray-200 border-0 dark:bg-gray-700">
                        <div class="">
                            <h4>Actions</h4>
                            <ul class="p-2">
                                <li><button on:click={normalize} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Normalize</button></li>
                                <li>
                                    <label for="decimals" class="text-sm">Visible Deimals</label>
                                    <input type="range" class="w-full" bind:value={num_decimals} id="decimals" name="decimals" min="0" max="5" step="1">
                                </li>
                                <li><button on:click={downloadCSV} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Download</button></li>

                            </ul>     
                        </div>
                    </div>
                </div>
            </div>
            <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"><svg class="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>Select at most 8 features</h5>
        </div>
        
        <a class="flex justify-center" href="/playground">
            <button type="button" on:click={submitDF} class="text-white bg-primary hover:bg-deepPrimary focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary dark:hover:bg-deepPrimary focus:outline-none dark:focus:ring-blue-800">Play</button>
        </a>
    </div>
    {#if !modal}
    <div class="absolute top-0 left-0 w-full h-full grid place-items-center backdrop-blur-sm">
        <!-- Main modal -->
        <div id="defaultModal" tabindex="-1" aria-hidden="true" class="overflow-x-hidden overflow-y-auto h-modal md:h-fit">
            <div class="relative w-full h-full max-w-2xl md:h-auto">
                <!-- Modal content -->
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button type="button" on:click={toggleModal} class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                    <div class="px-6 py-6 lg:px-8">
                        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Rename Column</h3>
                        <form on:submit|preventDefault={onSubmit} class="space-y-6" action="#">
                            <div class="relative">
                                <input type="text" id="floating_outlined" name="colName" class="block px-2.5 pb-2.5 pt-4 w-1/2 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required/>
                                <label for="floating_outlined" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Name</label>
                            </div>
                        
                            <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Rename</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/if}
    
</main>

<style>
    .grid-container {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr 10rem;
        grid-template-rows: 1fr 1fr;


    }
</style>