// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./Auction.sol";

contract AuctionFactory {
    Auction[] public auctions;
    Auction[] public winedAuctions;
     Auction[] public biddedAuctions;

    error CustomerDoesntHaveWinedAuction();
    error ThereIsNoBiddedAuctions();
    function createAuction(uint biddingTime, address payable beneficiary, string memory secret, uint price) public {
        Auction newAuction = new Auction(biddingTime, beneficiary, secret, price);
        auctions.push(newAuction);
    }

    function getAllAuctions() public view returns (Auction[] memory) {
        return auctions;
    }

    // Inside the AuctionFactory contract
function getHistoryOfBidding() public returns (Auction[] memory) {
    // Auction[] public customerAuctions;

    for (uint i = 0; i < auctions.length; i++) {
        // Call the getBidders function to retrieve the bidders array
        address[] memory auctionBidders = auctions[i].returnBidders();
        if(auctionBidders.length > 0) {
            biddedAuctions.push(auctions[i]);
        }
       
    }
    if(biddedAuctions.length == 0) {
        revert ThereIsNoBiddedAuctions();
    }
    return biddedAuctions;
    }
    // function returnBiddedAuctions() public view returns (Auction[] memory) {
    //     return biddedAuctions;
    // }
    //string kao ulazni parametar 
    //co
    function getAllWinedAucionsByCustomer(address customer) public returns (Auction[] memory) {
        for(uint i=0; i<auctions.length; i++) {
            if(auctions[i].highestBidder() == customer && auctions[i].ended() == true) {
                winedAuctions.push(auctions[i]);
            }
        }
        if(winedAuctions.length == 0) {
            revert CustomerDoesntHaveWinedAuction();
        }
        return winedAuctions;
    }

    }


