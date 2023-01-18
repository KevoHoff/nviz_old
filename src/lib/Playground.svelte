<script>
    import * as brain from 'brain.js';
    import { Plot } from '$lib/Plot.js'
	import { onMount } from 'svelte';
    export let df;

    let canvas;
    // provide optional config object (or undefined). Defaults shown.
    

    // const output = net.run(X[0].input); // [0.987]
    // console.log(output)

    onMount(() => {
        const config = {
            binaryThresh: 0.5,
            hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
            activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
            leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
        };

        // create a simple feed forward neural network with backpropagation
        const net = new brain.NeuralNetwork(config);
        console.log(net);

        let X = df.target('Income')
        net.train(X);

        const MAX_FONT_SIZE = 24
        const PADDING_X = 150;
        const PADDING_Y = 0;
        const height = canvas.height - PADDING_Y * 2;
        const width = canvas.width - PADDING_X * 2;
        const min_dist = 10;
        let sizes = [8, 1];
        let n = Math.max.apply(Math, sizes)
        const nodeWidth = 2
        const radius = (height - (min_dist*(n-1))) / (2*n + nodeWidth)
        let font_size = radius/2
        if (font_size > MAX_FONT_SIZE) {
            font_size = MAX_FONT_SIZE
        }

        let options = {}
        options['padding'] = {}
        options['padding']['x'] = PADDING_X
        options['padding']['y'] = PADDING_Y
        options['height'] = height
        options['width'] = width
        options['radius'] = radius
        options['minDist'] = min_dist
        options['font'] = `${font_size}px Arial`
        options['nodeWidth'] = nodeWidth
        options['fillStyle'] = '#FFFFFF'
        options['strokeStyle'] = '#000000'

        let p = new Plot(canvas, options);
        p.plot(net);

        window.addEventListener('resize', () => {
            net.train(X);
            p.plot(net);
        })
    })

</script>

<div class="w-full h-full">
    <canvas bind:this={canvas}></canvas>
</div>


<style>
    
</style>