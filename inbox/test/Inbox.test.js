const { equal } = require('assert');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
//Web3 is constructor it is used to create instances of web3 library
const provider = ganache.provider();
const web3 = new Web3(provider);
const  { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const INITIAL_STRING = 'Hi Piyush Work User';

beforeEach(async () => {
    //got a list of all web3 accounts
    accounts =  await web3.eth.getAccounts();
    
    //use one of the account to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [INITIAL_STRING]})
        .send({ from: accounts[0], gas: '1000000'});
    
        inbox.setProvider(provider)

});

describe('Inbox',()=>{
    it('deploy the contract',()=>{
        assert.ok(inbox.options.address);
    });

    it('it has a default message',async ()=>{
        //tis a boilerplate .call tell how that function get called
        const message = await inbox.methods.message().call();
        assert.equal(message,INITIAL_STRING);
    });
    
    it('can change the message',async ()=>{
        await inbox.methods.setMessage('Bye').send({ from: accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Bye');
    });
});