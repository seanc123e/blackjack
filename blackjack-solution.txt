var BlackJack = function () {
  this.createDeck = function () {
    // Programmatically create a deck
    var faces = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    var suits = ['Diamonds', 'Clubs', 'Hearts', 'Spades'];

    var deck = suits.map(function (suit) {
      return faces.map(function (face) {
        // this creates an array of 4 arrays, each nested array contains all the cards for a suit, each card is represented as an object
        return {
          face: face,
          suit: suit
        }
      });
    }).reduce(function (deck, suits) {
      // we flatten the array to produce an array of card objects
      return deck.concat(suits);
    }, []);
    return deck;
  }
  // initiate object properties, think of them as variables, but they are contained in the object
  this.deck = this.createDeck();
  this.playerHand = [];
  this.dealerHand = [];
  this.roundCounter = 0;
  this.balance = 100;
  this.betSize = 0;
  
  this.bet = function () {
    // This is the first function run to start the game, user is asked to determine the betsize
    this.betSize = Number(prompt('Choose your bet size. Minimum is $10. Maximum is $' + this.balance + '. Higher bet has to be increments of $10.', ''));
    if (this.betSize >= 10 && this.betSize % 10 === 0 && this.betSize <= this.balance) {
      this.configureForNewRound();
      this.startRound();
    } else {
      this.bet();
    }
  };

  this.configureForNewRound = function () {
    // resets some of the properties for a new round
    this.deck = this.createDeck();
    this.playerHand = [];
    this.dealerHand = [];
    this.roundCounter++;
    this.balance -= this.betSize;
  }

  this.getHandValue = function (cards) {
    // this function determines the total value of a hand
    var cardValues = cards.map(function (card) {
      switch (card.face) {
        case 'J':
        case 'Q':
        case 'K':
          return 10;
          break;
        case 'A':
          return 11;
        default:
          return Number(card.face);
      }
    });
    var value = cardValues.reduce(function (acc, value) {return acc + value}, 0);
    var indexOfA = cardValues.indexOf(11);
    
    // the following will turn Aces value into 1 when the total value is larger than 21
    while (value > 21 && indexOfA !== -1) {
      cardValues[indexOfA] = 1;
      value = value - 10;
      indexOfA = cardValues.indexOf(11);
    }
    return value;
  }

  this.dealCard = function (hand) {
    // randomly choose an index in the deck and deal to a hand
    var index = Math.floor(Math.random() * this.deck.length);
    var newCard = this.deck[index];
    this.deck = this.deck.slice(0, index).concat(this.deck.slice(index + 1));
    hand.push(newCard);

    // return the dealt card object to be used in the calling program
    return newCard;
  }

  this.newRoundOrNot = function () {
    // The logic for whether player has enough balance to keep playing, and for the player to end the game
    var choice;
    if (this.balance > 10) {
      choice = confirm('You can start your Round ' + String(this.roundCounter + 1) + ' with bet size between $10 and $' + this.balance + ' and with $10 increments. ' + '\nClick OK to continue or click Cancel to cash out.');
    } else if (this.balance === 10) {
      choice = confirm('You can start a new round with bet size of $10.' + '\nClick OK to continue or click Cancel to cash out.');
    } else {
      return alert('Not enough balance to start a new round. See you next time.');
    }

    if (choice) { 
      this.bet();
    } else {
      alert('You cashed out $' + this.balance + '. See you next time.');
    }
  };

  this.getCardsInString = function (cards) {
    // modify the card object into a string form to be printed
    return cards.map(function (card) {
      return card.face + ' of ' + card.suit;
    })
  }

  this.currentRoundEnds = function (result) {
    // prints a summary of the round that just finished
    var that = this;
    // sets the this object to a that variable so it can be used in the message object below
    var message = {
      'player won': function () {
        that.balance += 2 * that.betSize;
        alert('Congrats, you won. Your balance is $' + that.balance + '.');
      },
      'player lost': function () {
        alert('You lost. Your balance is $' + that.balance + '.');
      },
      'push': function () {
        that.balance += that.betSize;
        alert('It\'s a push. Your balance is $' + that.balance + '.');
      }
    };
    
    var playerHandValue = this.getHandValue(this.playerHand);
    var playerHandString = this.getCardsInString(this.playerHand).join('\n');
    var dealerHandValue = this.getHandValue(this.dealerHand);
    var dealerHandString = this.getCardsInString(this.dealerHand).join('\n');

    alert('Summarizing the game...\n\nPlayer\'s hand value: ' + playerHandValue + '\nPlayer\'s card summary:\n' + playerHandString + '\n\nDealer\'s hand value: ' + dealerHandValue + '\nDealer\'s card summary:\n' + dealerHandString);
    message[result]();
    this.newRoundOrNot();
  };

  this.playerTurn = function () {
    // calculate player hand value, and calculate dealer face up cards value
    var playerHandValue = this.getHandValue(this.playerHand);
    var dealerFaceUpValue = this.getHandValue(this.dealerHand) - this.getHandValue([this.dealerHand[0]]);

    // ask player whether to hit or stand
    var choice = confirm('Stand or hit? Click Cancel to stand or click OK to hit.\n\n[Reminder]\nPlayer\'s hand value: ' + playerHandValue + '\nDealer\'s faced up hand value: ' + String(dealerFaceUpValue));

    // if player hits, deal player hand a card and calculate new value and inform player, then ask player again if hit or stand. If player stands, run dealerTurn program.
    if (choice) {
      var newCard = this.dealCard(this.playerHand);
      playerHandValue = this.getHandValue(this.playerHand);
      alert('Player\'s new card: ' + this.getCardsInString([newCard]).join('') + '\nPlayer\'s card summary:\n' + this.getCardsInString(this.playerHand).join('\n') + '\n\nPlayer\'s hand value: ' + playerHandValue + '\nDealer\'s faced up hand value: ' + String(dealerFaceUpValue));

      if (playerHandValue === 21) {
        return this.currentRoundEnds('player won');
      } else if (playerHandValue > 21) {
        return this.currentRoundEnds('player lost');
      } else {
        this.playerTurn();
      }
    } else {
      this.dealerTurn();
    }
  };

  this.dealerTurn = function () {
    var dealerHandValue = this.getHandValue(this.dealerHand);
    var playerHandValue = this.getHandValue(this.playerHand);

    if (dealerHandValue > 16) {
      if (dealerHandValue > 21 || dealerHandValue < playerHandValue) {
        return this.currentRoundEnds('player won');
      } else if (dealerHandValue > playerHandValue) {
        return this.currentRoundEnds('player lost');
      } else {
        return this.currentRoundEnds('push');
      }
    } else {
      var newCard = this.dealCard(this.dealerHand);
      var dealerHandValue = this.getHandValue(this.dealerHand);
      alert('Dealt a new card to Dealer. Now Dealer has ' + this.dealerHand.length + ' cards. Dealer\'s hand value: ' + dealerHandValue + '.\n\n[Reminder]\nPlayer in stand position. Player\'s hand value: ' + playerHandValue + '.\nPlayer\'s card summary:\n' + this.getCardsInString(this.playerHand).join('\n'));
      this.dealerTurn();
    }
  };

  this.startRound = function () {
    this.dealCard(this.playerHand);
    this.dealCard(this.dealerHand);
    this.dealCard(this.playerHand);
    this.dealCard(this.dealerHand);
    
    alert('Player\'s first two cards: ' + this.getCardsInString([this.playerHand[0]]).join('') + ' and ' + this.getCardsInString([this.playerHand[1]]).join('') + '\n\nDealer\'s sided up card: ' + this.getCardsInString([this.dealerHand[1]]).join(''));
    
    var playerHandValue = this.getHandValue(this.playerHand);
    var dealerHandValue = this.getHandValue(this.dealerHand);

    if (playerHandValue === 21 || dealerHandValue === 21) {
      if (playerHandValue === dealerHandValue) { 
        alert('Well, you and dealer both got blackjack.');
        return this.currentRoundEnds('push'); 
      } else if (playerHandValue > dealerHandValue) {
        alert('Wow! You got blackjack.');
        return this.currentRoundEnds('player won');
      } else {
        alert('Dealer got blackjack.');
        return this.currentRoundEnds('player lost');
      }
    }

    this.playerTurn();
  };
}

var game = new BlackJack()
game.bet();