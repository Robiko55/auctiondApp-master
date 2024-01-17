import React, { useState, useEffect } from 'react';
import './CreateHistoryModal.css';
import AuctionFactoryABI from '../../contracts/AuctionFactory.json';
import AuctionDetailsModal from '../AuctionDetailsModal/AuctionDetailsModal.js';


// const CreateHistoryModal = ({ onClose, web3, account, auctionFactoryAddress}) => {
//   const [customerData, setCustomerData] = useState({
//    customerAdress: ''
//   });

  const CreateHistoryModal = ({ onClose, account, web3, auctionFactoryAddress }) => {
    const [auctions, setAuctions] = useState([]); 
    const [selectedAuction, setSelectedAuction] = useState(null);

    const loadAuctions = async () => {
      try {
        const auctionFactory = new web3.eth.Contract(
          AuctionFactoryABI.abi,
          auctionFactoryAddress,
        );
    
        const auctionsFromContract = await auctionFactory.methods.getHistoryOfBidding().call();
        console.log(auctionsFromContract);
        setAuctions(auctionsFromContract);
      } catch (error) {
        console.error("Error while loading auction list:", error);
      }
    };
  
    useEffect(() => {
      if (web3) {
        loadAuctions();
      }
    }, [web3]); 
  
    const openDetailsModal = (auction) => {
      setSelectedAuction(auction);
    };

  return (
    <div className="create-auction-modal">
      <div className="modal-content">
      {/* <input className="modal-input" name="customerAddress" placeholder="Your Address" onChange={handleChange} /> */}
     <div className="auction-list">
<h1 className="auction-list-title">Bidded Auctions</h1>
      {auctions.map((auction, index) => (
        <div key={index} className="auction-item" onClick={() => openDetailsModal(auction)}>
          Aukcija {index + 1}
        </div>
      ))}
      {selectedAuction && <AuctionDetailsModal web3={web3} account={account} auction={selectedAuction} onClose={() => setSelectedAuction(null)} />}
    </div>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
    </div>
  );
 };

export default CreateHistoryModal;
