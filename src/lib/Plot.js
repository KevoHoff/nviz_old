export class Plot {
    constructor(canvas, options) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.options = options
    }

    resize(model) {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
        this.options.width = this.canvas.width - 2*this.options.padding.x;
        this.options.height = this.canvas.height - 2*this.options.padding.y;
        this.options.cols = model.sizes.length;
        this.ctx = this.canvas.getContext('2d');
        
        let N = Math.max.apply(Math, model.sizes);
        let radius = this.options.height - (this.options.minDist*(N-1))
        const nodeWidth = 2;

        radius /= (2 * N + nodeWidth);

        this.options.radius = radius
        
        let font_size = radius/2;
        if (font_size > this.options.fontMax) {
            font_size = this.options.fontMax
        }

        this.options.font = `${font_size}px Arial`;
    }

    plot_line(node1, node2) {
        this.ctx.beginPath()
        // TODO: Kevin add line info (strokeStyle, lineWidth)
        this.ctx.strokeStyle = node1.line_cols[node2.i]
        this.ctx.lineWidth = node1.line_widths[node2.i]
        this.ctx.moveTo(node1.x, node1.y)
        this.ctx.lineTo(node2.x, node2.y)
        this.ctx.stroke()
    }

    plot_node(node) {
        // Draw node itself
        this.ctx.beginPath()
        this.ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI, false)
        this.ctx.fillStyle = this.options.fillStyle
        this.ctx.fill()
        this.ctx.strokeStyle = this.options.strokeStyle
        this.ctx.lineWidth = this.options.nodeWidth;
        this.ctx.stroke()
        
        // Draw coefficients
        if (node.loc[1] == 0 || node.loc[1] == this.options.cols-1) {
            this.ctx.beginPath()
            this.ctx.fillStyle = this.options.strokeStyle;  // contrast
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.font = this.options.font
            this.ctx.fillText(node.text, node.x, node.y)
            this.ctx.stroke()
        }
        
        // Draw labels
        this.ctx.beginPath()
        this.ctx.fillStyle = this.options.strokeStyle;
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = this.options.font
        this.ctx.fillText(node.label, node.x - this.options.radius - 10, node.y)
        this.ctx.stroke()
    }

    plot_lines(nodes) {
        for (let col = 0; col < nodes.length - 1; col ++) {
            for (let row = 0; row < nodes[col].length; row++) {
                for (let row2 = 0; row2 < nodes[col + 1].length; row2++) {
                    let node1 = nodes[col][row]
                    let node2 = nodes[col + 1][row2]

                    this.update_lines(node1)
                    this.plot_line(node1, node2)
                }
            }
        }
    }

    plot_nodes(nodes) {
        for (let col in nodes) {
            for (let row in nodes[col]) {
                let node = nodes[col][row]
                this.plot_node(node)
            }
        }
    }

    plot(model, inputs=null, results=null) {
        this.resize(model)
        let nodes = this.get_nodes(model, inputs, results)
        console.log(nodes)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.plot_lines(nodes)
        this.plot_nodes(nodes) 
    }

    get_nodes(model, inputs, results) {
        let nodes = [];

        for (let col in model.sizes) {
            col = parseInt(col)
            let node_row = []

            let x = col / (model.sizes.length - 1)
            x = x * this.options.width + this.options.padding.x

            for (let row = 0; row < model.sizes[col]; row++) {
                let node = {}
    
                let y = (row+1) / (model.sizes[col]+1)
                y = y * this.options.height + this.options.padding.y
    
                node['x'] = x
                node['y'] = y
                node['text'] = ''
                node['loc'] = [row, col];
                node['radius'] = this.options.radius
                node['coef'] = model.outputs[col][row]
                node['weights'] = []
                node['i'] = row
                if (col < model.weights.length - 1) {
                    let weights = model.weights[col + 1]
                    for (let weight of weights) {
                        node['weights'].push(weight[row])
                    }
                }
                
                node['label'] = ''
                if (col == 0) {
                    for (let label in model.inputLookup) {
                        if (model.inputLookup[label] == row) {
                            node['label'] = label
                            if (inputs) {
                                node['text'] = inputs.loc[label][0].toFixed(0)
                            }
                            break
                        }
                    }
                }

                
                if (col > 0 &&  col < model.sizes.length-1) {
                    node.radius /= 2
                }
    
                node_row.push(node)
            }
            
            nodes.push(node_row)
        }

        if (results) {
            nodes[nodes.length-1][0].text = results.iloc[0][0].toFixed(0)
        }
    
        return nodes
    }

    update_lines(node) {
        const THRESH = 1
        const MIN_SATURATION = 200
        let res = {}
        res['line_widths'] = []
        res['line_cols'] = []
        for (let weight of node.weights) {
            let line_width = THRESH*node.radius
            let saturation = 255
            let opacity = 1
            if (Math.abs(weight) < THRESH) {
                line_width = weight * node.radius
                saturation = weight * (255-MIN_SATURATION)*2 + MIN_SATURATION
            }
            
            let color = `rgb(230, 0, 64, ${opacity})`
            if (Math.sign(weight) == 1) {
                color = `rgb(0, 230, 64, ${opacity})`
            }
            res.line_widths.push(line_width)
            res.line_cols.push(color)
        }
        Object.assign(node, res)
    }

    sigmoid(x) {
        const k = 0.5;
        return 1 / (1 + Math.exp(-x/k))
    }
}