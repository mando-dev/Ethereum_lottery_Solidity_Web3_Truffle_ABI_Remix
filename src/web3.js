import Web3 from 'web3'; //captiol for construction func

                                            // const web3 = new Web3(window.web3.currentProvider); //window global variable and web3 global var. so window.web3 is the copy coming from metamask library. currentProvider is the provider given to that web3. so this currentProvider property si pretty powerful because it has access to all the addresses and public/private keys. this provider here has also been prconfigured to the rinkby test network//creatin new instance of web3 and ripping out provided from metamask
const web3 = new Web3(window.ethereum);   //had to replace line above with this one to use usable provider for our version of web3
window.ethereum.enable();                //allowing us to connect metamask to our ver of web3


export default web3;