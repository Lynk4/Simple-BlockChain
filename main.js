const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress; 
        this.amount = amount;
    }
}
class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.claculateHash();
        this.nonce = 0;
    }
    // creating a new method. this function will calculate the hash of the block.
    claculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.claculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

// creating a new class for the blockchain.
class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    // the first block in a blockchain is called the genesis block and it is added manually so create a method for that.
    createGenesisBlock(){
        // the genesis block is the first block in the chain and it has no previous hash.
        return new Block("17/11/2023", "Genesis block", "0");
    }

    // to return the latest block in the chain.
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }


    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log("Block successfully mined.............");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)   
        ];
    }
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
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
// console.log('Mining block 1..........');
// lynk4coin.addBlock(new Block(1, "18/11/2023", {amount: 18}));
// console.log('Mining block 2..........');
// lynk4coin.addBlock(new Block(2, "19/11/2023", {amount: 19}));




// // let's see how the block chain looks like.
// console.log(JSON.stringify(lynk4coin, null, 4));
// console.log('Is Block Chain Valid?.......... '+ lynk4coin.isChainVaild());
// // lynk4coin.chain[1].data = {amount: 100};

lynk4coin.createTransaction(new Transaction('address1', 'address2', 100));
lynk4coin.createTransaction(new Transaction('address2', 'address2', 50));

console.log('\n Starting the miner..........');
lynk4coin.minePendingTransactions('lynk-address');

console.log('\n Balance of lynk is ', lynk4coin.getBalanceOfAddress('lynk-address'));

console.log('\n Starting the miner again..........');
lynk4coin.minePendingTransactions('lynk-address');
console.log('\n Balance of lynk is ', lynk4coin.getBalanceOfAddress('lynk-address'));
