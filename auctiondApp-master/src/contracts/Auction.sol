// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;
contract Auction {
   
    address payable public beneficiary; //Adresa primaoca
    uint public auctionEndTime; //Vreme trajanja u sekundama
    string private secretMessage; 
    uint public price;
    address[] public bidders;
    // Trenuno stanje aukcije.
    address public highestBidder; 
    uint public highestBid;

    mapping(address => uint) pendingReturns;
    mapping(address => Auction[]) public userAuctions;
    mapping(address => address) public highestBidders;



    bool public ended; 
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
    

    error AuctionAlreadyEnded();
    error BidNotHighEnough(uint highestBid);
    error AuctionNotYetEnded();
    error AuctionEndAlreadyCalled();
    error PriceNotEqualToCost(uint price);
   constructor(
        uint biddingTime,
        address payable beneficiaryAddress,
        string memory secret, // Parametar za podatke tajne poruke
        uint auctionPrice
    ) {
        beneficiary = beneficiaryAddress;
        auctionEndTime = block.timestamp + biddingTime;
        secretMessage = secret; // Postavljanje tajne poruke
        price = auctionPrice;
    }

    function bid() external payable {
        if (ended)
            revert AuctionAlreadyEnded();

        if (msg.value <= highestBid)
            revert BidNotHighEnough(highestBid);

        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
        }
        highestBidder = msg.sender;
        highestBid = msg.value;
        bidders.push(msg.sender);
        emit HighestBidIncreased(msg.sender, msg.value);
        // Dodaj trenutnu aukciju u niz licitacija korisnika
        userAuctions[msg.sender].push(this);
    }

    function returnBidders() public view returns(address[] memory) {
        return bidders;
    }
    function buy() external payable {
        if(ended) {
            revert AuctionAlreadyEnded();
        }
        if(msg.sender.balance < price) {
           revert PriceNotEqualToCost(msg.value);
        }
        highestBidder = msg.sender;
        highestBid = price;
        auctionEndTime = 0;
        ended = true;
    
        emit AuctionEnded(msg.sender, msg.value);
    }

    function returnHighestBidder() external view returns(address) {
        return highestBidder;
    }

    function withdraw() external returns (bool) {
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }
    function auctionEnd() external {

        // 1. Uslovi
        if (block.timestamp < auctionEndTime)
            revert AuctionNotYetEnded();
        if (ended)
            revert AuctionEndAlreadyCalled();

        // 2. Efekti
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        // 3. Interakcija
        beneficiary.transfer(highestBid);
    }

    function getSecretMessage() external view returns (string memory) {
        // Proveravamo da li je pozivatelj dobitnik aukcije
        require(ended, "The auction has not ended yet.");
        require(msg.sender == highestBidder, "Only the auction winner can access the secret code.");
        return secretMessage;
    }

    function getUserAuctions() external view returns (Auction[] memory) {
    return userAuctions[msg.sender];
    }   
}