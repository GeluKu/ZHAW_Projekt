import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3'; //imports the local, metamask injected, web3 version from web3.js file
import estate from './estate'; //imports the smart contract for the real estate

let accounts;

class App extends Component {

  //WIP: others attribute to be defined here
  state={
    contractAddress:'',
    contractBalance:'',
    deployedFromAddress:'',
    email:'',
    newEmail:'',
    valueToBeTransferred:'',
    message:''
  };

  //event handler for the form submit ether to contract
  onFundsSubmit = async (event)=> {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    
    this.setState({message:'Waiting on transaction to be performed...'});

    await estate.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.valueToBeTransferred, 'ether')
     });

    this.setState({message:'Transaction performed!'});
  };

  //event handler for the change e-mail form
  onMailUpdateSubmit = async (event)=> {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    
    this.setState({message:'Waiting on transaction to be performed...'});
    let email=this.state.newEmail;
    this.setState({newEmail:''});

    await estate.methods.setEmail(email).send({from: accounts[0]});

    this.setState({message:'Transaction performed!'});
  }


  async componentDidMount(){

    const accounts=await web3.eth.getAccounts();
//WIP
    const contractAddress = await estate.options.address;
    let contractBalance = await estate.methods.queryBalance().call();
    let email = await estate.methods.email().call();
    const deployedFromAddress=accounts[0];

//WIP
    this.setState({contractAddress});
    this.setState({email});
    this.setState({deployedFromAddress});
  }

  render() {

    return (
      <div>

        <h2> ZHAW Blockchain Project for real estate</h2>
        <h3>Authors: Kim, Reto, Sasa, Gelu</h3>

        <hr />

        <p>The real estate contract has the adress:  {this.state.contractAddress}</p>
        <p>Contract was deployed from the account: {this.state.deployedFromAddress}</p>
        <p>The owner contact E-Mai for this contrat is: {this.state.email}</p>
        <p>Amount on ether on the contract is :{this.state.contractBalance}</p>

        <hr />

        {/*submit ether to contract */}
        <form onSubmit={this.onFundsSubmit} >
          <h4>Transfer some Ether to the real estate contract</h4> 
        <div>
          <label>Amount of ether to transfer to the contract </label>
          <input 
          value={this.state.valueToBeTransferred}
          onChange={event => this.setState({valueToBeTransferred: event.target.value})}
           />
        </div>
        <button>Send tranfer</button>
        </form>

        <hr />
        
        {/*change e-mail adress of the contract */}
        <form onSubmit={this.onMailUpdateSubmit}>
          <h4>Change the e-mail adress of the contract</h4> 
        <div>
          <label>Enter new e-mail address: </label>
          <input
          type='text' 
          value={this.state.newEmail}
          onChange={event => this.setState({newEmail: event.target.value})}
           />
        </div>
        <button> Submit change</button>
        </form>

        {/* status message for waiting times*/}
        <hr />
        <h2>{this.state.message}</h2>
      </div>

    );
  }
}

export default App;