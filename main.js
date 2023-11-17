const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.claculateHash();
    }
    // creating a new method. this function will calculate the hash of the block.
    claculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

// creating a new class for the blockchain.
class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    // the first block in a blockchain is called the genesis block and it is added manually so create a method for that.
    createGenesisBlock(){
        // the genesis block is the first block in the chain and it has no previous hash.
        return new Block(0, "17/11/2023", "Genesis block", "0");
    }

    // to return the latest block in the chain.
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    // add a new block to the chain. before adding the block we need to calculate the hash of the previous block. 
    // After changing the block we need to recalculate the hash of the block.
    addBlock(newBlock){

        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.claculateHash();
        this.chain.push(newBlock);
    }

    // to check if the chain is valid or not.
    isChainVaild(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.claculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }

}

// creating a new instance of the blockchain.
let lynk4coin = new Blockchain();
lynk4coin.addBlock(new Block(1, "18/11/2023", {amount: 18}));
lynk4coin.addBlock(new Block(2, "19/11/2023", {amount: 19}));

// let's see how the block chain looks like.
console.log(JSON.stringify(lynk4coin, null, 4));
console.log('Is Block Chain Valid?.......... '+ lynk4coin.isChainVaild());
// lynk4coin.chain[1].data = {amount: 100};
