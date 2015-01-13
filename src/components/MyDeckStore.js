/** @jsx React.DOM */

var React = require("react");
var Firebase = require("firebase");
var Actions = require("./Actions");
var Reflux = require('reflux');
var UserStore = require('./UserStore');

var defaultUserStiring = "https://sizzling-torch-8926.firebaseio.com/users/guest/cards";
var defaultUsernameString = "guest";
var userBaseString = "https://sizzling-torch-8926.firebaseio.com/users/";
var cardRef = new Firebase(defaultUserStiring);

var CardStore = Reflux.createStore({
  mixins: [Reflux.connect(UserStore,"User")],
  init: function(){
    this.cards = [];
    this.User = [];
    cardRef.on("child_added",this.updateCards.bind(this));
    this.trigger(([]));
    this.listenTo(Actions.addUserCard,this.addCard.bind(this));
    this.listenTo(Actions.removeUserCard,this.removeCard.bind(this));
    this.listenTo(Actions.login,this.login.bind(this));
    this.listenTo(Actions.logout,this.logout.bind(this));
  },
  login: function(user){
    this.User = user;
    this.cards = [];
    this.trigger((this.cards));
    cardRef = new Firebase(userBaseString +  user.github.username + "/cards");
    cardRef.on("child_added",this.updateCards.bind(this));
  },
  logout: function(){
    this.cards = [];
    this.User = [];
    this.trigger((this.cards));
    cardRef = new Firebase(defaultUserStiring);
    cardRef.on("child_added",this.updateCards.bind(this));
  },
  addCard: function(card){
    console.log(this.User.github != undefined);
    if( this.User.github != undefined ){
      card.owner = this.User.github.username;
    }
    else{
      card.owner = defaultUsernameString;
    }

    cardRef.push(card,function(err){
      if (err){
        console.log("did not add card");
      } else {
        console.log("did add card: " + card.name);
      }
    });
  },
  removeCard: function(card){
    for (index = 0; index < this.cards.length; ++index) {
      if(this.cards[index].key == card.key){
        this.cards.splice( index, 1);
        index = this.cards.length;
      }
    }

    cardRef.child(card.key).remove();
    this.trigger((this.cards));
  },
  updateCards: function(snapshot){

    if(this.User.github != undefined){
        if(this.User.github.username == snapshot.val().owner){
          var card = {
              key: snapshot.name(),
              name: snapshot.val().name,
              url: snapshot.val().url,
              owner: snapshot.val().owner
          };

          if(!cardExixsts(this.cards,card)){
            this.cards.push(
              card
            );

            this.trigger((this.cards));
          }         
        }
    }
    else{
        var card = {
            key: snapshot.name(),
            name: snapshot.val().name,
            url: snapshot.val().url,
            owner: snapshot.val().owner
        };

       
        if(!cardExixsts(this.cards,card)){
          this.cards.push(
            card
          );

          this.trigger((this.cards));
        }
    }
  },
  getDefaultData: function(){
    return this.cards || [];
  }
});

function cardExixsts(cards,card){
  for(var i = 0; i < cards.length; i++){
    if(cards[i].key == card.key ){
      return true;
    }
  }
  return false;
}

module.exports = CardStore;