const prompt = require('prompt-sync')({ signit: true});
var playFlag = true;
var wins = 0;
var losses = 0;
var draws = 0;

while(playFlag === true) {
    // deck building variables
    var suits = ['Clubs', 'Spades', 'Diamonds', 'Hearts']
    var values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace']
    var deck = [];
    var card = '';
    var weight = 0;

    // hand building variables
    var userHand = [];
    var dealerHand = [];
    var handWeight = 0;

    // total variables
    var userTotal = 0;
    var dealerTotal = 0;

    // game set up variables
    let hitOrStandInput = '';
    prompt('Welcome to Blackjack! Press enter to start');

    // create deck function
    function createDeck () {
        deck = [];
        for (var i = 0; i < values.length; i++) {
            for (var j = 0; j < suits.length; j++) {
                weight = parseInt(values[i]);
                if (values[i] === 'Jack' || values[i] === 'Queen' || values[i] === 'King') {
                    weight = 10;
                } else if (values[i] === 'Ace') {
                    weight = 1;
                }
                card = ' '+ values[i] + ' of ' + suits[j] + '; Weight: ' + weight;
                deck.push(card);
            }
        }
    }
    
    // shuffle deck
    var shuffle = function () {
        for (var i = 0; i < deck.length; i++) {
            var cardLocation1 = Math.floor((Math.random() * deck.length));
            var cardLocation2 = Math.floor((Math.random() * deck.length));

            var currentLocation = deck[cardLocation1];
            deck[cardLocation1] = deck[cardLocation2];
            deck[cardLocation2] = currentLocation;
        }
    }
    
    // deal hands
    var dealCards = function() {
        // user deal
        for (let i = 0; i < 2; i++) {
            var card = deck.pop();
            userHand.push(card);
            if (userHand.length === 2) {
                playFlag = false;
            }
        }
        // bot deal
        for (let i = 0; i < 2; i++) {
            var card = deck.pop();
            dealerHand.push(card);
            if (dealerHand.length === 2) {
                playFlag = false;
            }
        }
    }
    
    // sort hand
    var sortHand = function (hand) {
        let instancesOfAce = hand.filter(card => card.includes('Ace'));
        let noAces = hand.filter(card => !card.includes('Ace'));
        return noAces.concat(instancesOfAce);
    }

    // Determine card values
    function cardTotal() {
        userTotal = 0;
        dealerTotal = 0;
        userHand = sortHand(userHand);
        dealerHand = sortHand(dealerHand);

        // user total    
        for (i = 0; i < userHand.length; i++) {
            handWeight = parseInt(userHand[i].split(' ')[5]);
            suitInHand = (userHand[i].split(' ')[1])
            if (userTotal < 11 && suitInHand === 'Ace') {
                handWeight = 11;
                userHand[i] = userHand[i].split(' ').slice(0, 5).join(' ') + ' 11';
            }
            userTotal += handWeight;
        }
        // dealer total
        instancesOfAce = dealerHand.filter(card => card.includes('Ace'));
        noAces = dealerHand.filter(card => !card.includes('Ace'));
        

        for (i = 0; i < dealerHand.length; i++) {
            handWeight = parseInt(dealerHand[i].split(' ')[5]);
            suitInHand = (dealerHand[i].split(' ')[1])
            if (dealerTotal < 11 && suitInHand === 'Ace') {
                handWeight = 11;
                dealerHand[i] = dealerHand[i].split(' ').slice(0, 5).join(' ') + ' 11';
            }
            dealerTotal += handWeight;
        }
    }
    
    // hit or stand function
    var hitOrStand = function() {
        var hitAgain = true;
        if (dealerTotal <= 14) {
            var card = deck.pop();
            dealerHand.push(card);
        }
        while(hitAgain) {
            hitOrStandInput = prompt('Would you like to hit or stand? Please type either "hit" or "stand": ');
            if (hitOrStandInput.toLowerCase() === 'hit') {
                hitAgain = true;
                var card = deck.pop();
                userHand.push(card);
                console.log('You chose to hit!');
            } else if (hitOrStandInput.toLowerCase() === 'stand') {
                hitAgain = false;
            } else if (hitOrStandInput.toLowerCase() !== 'hit' || hitOrStandInput.toLowerCase() !== 'stand') {
                console.log("That doesn't seem right. Check for typos?")
                hitAgain = true;
            } 
            cardTotal();
            if (userTotal > 21) {
                hitAgain = false;
            }
            if (userTotal === 21) {
                hitAgain = false;
            }
            console.log('user hand:' + userHand);
            console.log('user total: ' + userTotal);
        }
    }

    // Determine winner and play again
    function winner() {
        if (userTotal > dealerTotal && userTotal < 21) {
            console.log('====Nice! You beat the dealer!====');
            wins++;
        } else if (userTotal === 21 && dealerTotal === 21) {
            console.log('====Two blackjacks! Lots of luck today!====');
            draws++;
        } else if (dealerTotal > userTotal && dealerTotal < 21) {
            console.log('====Dealer wins! Better luck next time.====');
            losses++;
        } else if (dealerTotal > 21 && userTotal < 21) {
            console.log('====You win! What luck! The dealer busts.====');
            wins++;
        } else if (userTotal === dealerTotal || (userTotal === 21 && dealerTotal === 21)) {
            console.log('====Draw!====');
            draws++;
        } else if (userTotal > 21) {
            console.log('====Bust! Dealer wins====');
            losses++;
        } else if (userTotal === 21) {
            console.log('====Blackjack! You win!====');
            wins++;
        } else if (dealerTotal === 21) {
            console.log('====Dealer got Blackjack! Better luck next time====');
            losses++;
        }
        console.log('dealer hand:' + dealerHand);
        console.log('dealer total: ' + dealerTotal);
    } 

    createDeck();
    shuffle();
    dealCards();
    playFlag = true;
    cardTotal();
    console.log('user hand:' + userHand);
    console.log('user total: ' + userTotal);
    if (userTotal !== 21) {
        hitOrStand();
    }
    winner();
    console.log('Wins: ' + wins);
    console.log('Losses: ' + losses);
    console.log('Draws: ' + draws);
    console.log('================NEW ROUND================');
}