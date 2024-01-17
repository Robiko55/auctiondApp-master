import React, { useState, useEffect } from 'react';
import AuctionList from '../AuctionList/AuctionList.js'; 
import CreateAuctionModal from '../CreateAuctionModal/CreateAuctionModal.js'; 
import Web3 from 'web3';
import './Main.css';
import CreateHistoryModal from '../CreateHistoryModal/CreateHistoryModal.js';
import CreateWinnedAuctionsModal from '../CreateWinnedAuctionsModal/CreateWinnedAuctionsModal.js'
const auctionFactoryAddress = "0x0eF68cCD42c0dA47be0F06d95C104292B1b48048";
const sepoliaRPCUrl = "https://sepolia.infura.io/v3/12f8dae0c0134c9daed1b789d1a16352";

const Main = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHistoryModal, setShowHistoyModal] = useState(false);
  const [showWinnedAcutionsModal, setShowWinnedAuctionsModal] = useState(false);
  const [web3, setWeb3] = useState(null); 
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        console.log("Connected to Ethereum account: ", accounts[0]);
        window.ethereum.on('accountsChanged', (newAccounts) => {
          setAccount(newAccounts[0]);
          console.log("Switched to account: ", newAccounts[0]);
          console.log(account);
        });
      } else {
        console.log("MetaMask is not installed.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask: ", error);
    }
  };
  

  useEffect(() => {
    const web3Instance = new Web3(sepoliaRPCUrl);
    console.log(web3Instance);
    setWeb3(web3Instance);
    connectWallet();
    console.log("Web3 instance set up: ", web3);
  }, []);

  return (
    <div className="main-container">
      {!account && (
        <button className="connect-wallet-button" onClick={connectWallet}>
          Poveži se sa MetaMaskom
        </button>
      )}
      
      <AuctionList className="auction-list" web3={web3} account={account} auctionFactoryAddress={auctionFactoryAddress}/>
      <button className="create-auction-button" onClick={() => setShowCreateModal(true)}>
        Napravi Aukciju
      </button>
        <button className="create-auction-button" onClick={() => setShowHistoyModal(true)}>
          Proveri istoriju aukcija
        </button>
        <button className="create-auction-button" onClick={() => setShowWinnedAuctionsModal(true)}>
          Winned auctions
        </button>
        
      {showCreateModal && (
        <CreateAuctionModal className="create-auction-modal" web3={web3} account={account} onClose={() => setShowCreateModal(false)} auctionFactoryAddress = {auctionFactoryAddress}/>
      )}
      { showHistoryModal && (
          <CreateHistoryModal className="create-auction-modal" web3={web3} account={account} auctionFactoryAddress={auctionFactoryAddress} onClose={() => setShowHistoyModal(false)}></CreateHistoryModal> 
      )}
       { showWinnedAcutionsModal && (
          <CreateWinnedAuctionsModal className="create-auction-modal" web3={web3} account={account} auctionFactoryAddress={auctionFactoryAddress} onClose={() => setShowWinnedAuctionsModal(false)}></CreateWinnedAuctionsModal> 
      )}
    </div>
  );
}

export default Main;