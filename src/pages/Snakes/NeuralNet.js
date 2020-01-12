import { create, all } from 'mathjs'
const math = create(all)

let toMatrix = (array) => {
  return math.matrix(array)
}

let matrixConstructor = (
  input_nodes,
  hidden_nodes1,
  hidden_nodes2,
  output_nodes,
  num_genes,
) => {
  let weights_ih1 = math.random([hidden_nodes1, input_nodes])
  weights_ih1 = math.multiply(weights_ih1, 2)
  weights_ih1 = math.add(weights_ih1, -1)

  let bias_h1 = math.random([hidden_nodes1, 1])
  bias_h1 = math.multiply(bias_h1, 2)
  bias_h1 = math.add(bias_h1, -1)

  let weights_h1h2 = math.random([hidden_nodes2, hidden_nodes1])
  weights_h1h2 = math.multiply(weights_h1h2, 2)
  weights_h1h2 = math.add(weights_h1h2, -1)

  let bias_h2 = math.random([hidden_nodes2, 1])
  bias_h2 = math.multiply(bias_h2, 2)
  bias_h2 = math.add(bias_h2, -1)

  let weights_h2o = math.random([output_nodes, hidden_nodes2])
  weights_h2o = math.multiply(weights_h2o, 2)
  weights_h2o = math.add(weights_h2o, -1)

  let bias_o = math.random([output_nodes, 1])
  bias_o = math.multiply(bias_o, 2)
  bias_o = math.add(bias_o, -1)

  let genes = math.random([1, num_genes])

  let fresh_dna = [
    weights_ih1,
    weights_h1h2,
    weights_h2o,
    bias_h1,
    bias_h2,
    bias_o,
    genes,
  ]

  return fresh_dna
}

let mutate = (dna, amount) => {
  let newDNA = []
  for (let z = 0; z < dna.length; z++) {
    newDNA[z] = []
    for (let k = 0; k < dna[z].length; k++) {
      newDNA[z][k] = []
      for (let j = 0; j < dna[z][k].length; j++) {
        newDNA[z][k][j] = Math.min(Math.max(dna[z][k][j] + Math.random() * amount - amount / 2, -1), 1)
      }
    }
  }
  return newDNA
}

// very primitive crossover function. selects a random source for each gene individually
// assumes both parents have identical dna structure
let crossOver = (parent1, parent2, mutationAmount) => {
  let dna1 = parent1.dna
  let dna2 = parent2.dna
  let dnaPool = [dna1, dna2]
  let crossedOver = []
  for (let z = 0; z < dna1.length; z++) {
    crossedOver[z] = []
    for (let k = 0; k < dna1[z].length; k++) {
      crossedOver[z][k] = []
      for (let j = 0; j < dna1[z][k].length; j++) {
        crossedOver[z][k][j] = dnaPool[Math.round(Math.random())][z][k][j]
      }
    }
  }
  crossedOver = mutate(crossedOver, mutationAmount)
  return crossedOver
}

class NeuralNet {
  constructor(dna) {
    this.weights_ih1 = dna[0]
    this.weights_h1h2 = dna[1]
    this.weights_h2o = dna[2]

    this.bias_h1 = dna[3]
    this.bias_h2 = dna[4]
    this.bias_o = dna[5]
  }

  // returns regular array of length equal to num of output nodes
  feedforward(input_array) {
    let inputs = toMatrix(input_array)

    let hidden1 = math.multiply(this.weights_ih1, inputs)
    hidden1 = math.add(hidden1, this.bias_h1)
    hidden1 = math.tanh(hidden1)

    let hidden2 = math.multiply(this.weights_h1h2, hidden1)
    hidden2 = math.add(hidden2, this.bias_h2)
    hidden2 = math.tanh(hidden2)

    let output = math.multiply(this.weights_h2o, hidden2)
    output = math.add(output, this.bias_o)
    output = math.tanh(output)

    // transpose to make 1 by X matrix into array
    // then return the first row (which is the entire array)
    return math.transpose(output).valueOf()[0]
  }
}

export { NeuralNet, matrixConstructor, mutate, crossOver }
