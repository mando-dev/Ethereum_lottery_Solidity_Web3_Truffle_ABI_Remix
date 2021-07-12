import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';                                                                      //lottery is an object
      class App extends Component {                                                                    //this is a way of initializing our state.       
          state = {                                                                     // this is our state obejct. this statement is taking place inisde the contructor. all this block of code will be moved to the constructor method
                manager: '',                                                 //property manager. these are 5 different properties of state. the frist thress are coming from the contract and the last 2 are created here in the app component
                players: [],                                                      //instance level property. players will be an empty array to start off
                balance: '' ,                                         //balance is an object not numbr//initializing balance to be an empty string
                value: '' ,  //initializing the value property to be string. This property comes from the form input value which handles the onChange event. empty string are always for empty text input 
                message: ''                                 //Second step once after we first did the message code regarding the 15 second lag, we initialize the message property here in state 
                };                                                      //code deleted- defining our state variable ahead of time. constructor method initializes the sate object a couple linese below
                  async componentDidMount() {                                         //FIRST STEP  inital state when loaded on browser after App is called, which calls the render to call this initial state                    //this lifecycle method will aitomatically be called when App is placed on the screen
                    const manager = await lottery.methods.manager().call(); //SECOND STEP, we using provider from web3 because it was provided via metamaask- so no need to spedicfy acount[0], making a call to the network, no neeed to specify from field/property-accounts0 since metamask provider auto matically loads account currently logged  //attempting to fetch information off of our contract
                    const players = await lottery.methods.getPlayers().call();//after creating players here, we added to tne next line of state object next to manager.
                    const balance = await web3.eth.getBalance(lottery.options.address);//balance is an object not a numnbr //passin in the balance that we want to get the accoutn from -since we want the whole balance we have to supply the address of contract here, geting balance of contract so we know whats at stake
                                                                                                     //properties above get set immediately here below in our setState()
                    this.setState({ manager, players, balance });//three properties in state //THIRD STEP, which causes component to autmatically rerender to fire again.  setting our state for a property called manager
                        }                                                                   //this block of code is what first gets rendered from the component First via lifecycle 
                          onSubmit = async event => { //whenver onSubmit gets called it will get called with an 'event' object. object 'event' represents the form submission.  creating event handler that we initially declread inside the form tag. defining a method inside the class. no need to worry about binding this down to render method(new React upgrade)
                              event.preventDefault();                                                  //preventing from on submittin itslef the tradiional html way which submits itself in html classic way 
                              
                              const accounts = await web3.eth.getAccounts(); //getting list of our accounts before we send/enter into contract. sending a transaction to the enter func. although we did not neet to sepcify any acouunt (because its automatic) in the above consts call(), since we are sending here, we do need to specify account
                        
                              this.setState({message: 'Waiting on transaction success...(about 15 seconds lag)'});   //'message' was First initialized here-you can call it what u want. 'message' will show up in render. purpose of this message property is to tell users status of app
                        
                              await lottery.methods.enter().send({ //statement for user to enter the lottery. assuming first account on array is the one sending this transaction
                                    from: accounts[0],      //so account[0] will be first one entered into the lottery      //need to specify a from property and a value poperty
                                    value: web3.utils.toWei(this.state.value, 'ether')      //2nd arg specifies what value 'this.state.value' is using (ether) 'this.state.value' is the the actual either that must be converted into wei befire sending of as a transaction to contract. 'this.state.value'was grabbed from input field below. //amount of money that we want entered into the lottery contract
                                      });
                    
                          this.setState({message: 'You have been entered into the lottery after that 15 seconds lag'}); //once transaction is approved by the netework(after 15 seonds)
                               };
                onClick = async () => {
                        const accounts = await web3.eth.getAccounts();
                        this.setState({ message:'Waiting on transaction success...(about 15 seconds lag)'});

                              await lottery.methods.pickWinner().send({//sending transaction to this func. whenever we send a transaction, we get no return value back
                                    from: accounts[0]
                                    });
                      this.setState({message: 'A winner has been picked'});
                                    };

            render() {
              return (
                  <div>
                    <center>  <h2> Lottery Game </h2>  </center>
                        
                      <p >          
                        This contract is managed by: <strong> {this.state.manager} </strong>. 
                         There are currently <strong> {this.state.players.length} </strong>people entered,{/*bascially importing the properties from our set state above*/}  
                             
                            competing to win <strong> {web3.utils.fromWei(this.state.balance, 'ether')}</strong> Ether.{/*wei is to gigantic so we will print in ether. the 2nd arguments specifies the units that we want to see */}
                        </p>                                                                   {/* <  FINAL STEP re-renders App component w this state manager property */}
                        <hr />
             
                        <center>    <form onSubmit={this.onSubmit}>                                {/*this is going to be a controlled input, specifyin value and the onChange to it*/}
                              <h4> Do you want to join the Lottery? </h4>
                                  <div>
                                      <label>  Amount of Ether to enter: </label> <br></br>          {/*   asking user how much ether they want to contribute to contract */}{/*this is going to be a controlled input, specifyin value and the onChange to it*/}
                                    <input                                         
                                        value={this.state.value}//this is a value in ether so it must be converted to wei before sending into the transaction. making sure we set the value of input itself . next as a coder, initialize our state.value (property) up at the top of ths component
                                        onChange={event =>  this.setState({value: event.target.value})}// property(value-u can namae this whatever you want) will hold the amoutn of ether user wants to contribute. will take in some 'event'. onChange (even handler) will be called anytiem anayone changeds the text in the input
                

                                    />
                                    </div> <br></br>
                                    <button>Enter</button> {/*///sending a transaction to the 'enter func' on our Lottery contract when the user hits the enter button-they have the perception of entering the contract, user will be enetered into lottery contract */}
                                                                     
                              </form>  </center>
                      <hr />

                       <center>  <h4> Ready to Pick a Winner? (Only Manager Can Control This:)</h4> </center>
                     <center>   <button onClick={this.onClick}>Randomly Pick a Winner from the Lottery</button> </center>     {/*event handler */}


                      <hr />   

                      <h1> {this.state.message}  </h1> {/* //Third step after having iniitalized 'message' in state.    */}       
                      </div> // web3.eth.getAccounts().then(console.log),   //list of all accoutns tied to web3. This returns a promise. //chaining on my promise since we cannot use asyn await in react components
              );
            }
      }
      export default App;                                                           // next we will send a transaction to a function or a fucntion that changes some data that is tored in the blockchain
