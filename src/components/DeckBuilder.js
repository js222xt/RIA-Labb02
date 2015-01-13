/** @jsx React.DOM */

var React = require("react");
var Firebase = require("firebase");
var Actions = require("./Actions");
var Reflux = require('reflux');
var CardStore = require('./MyDeckStore');

var CardsListAllCard = React.createClass({
	render: function() {
    var createItem = function(card, index) {
      	return <div className='card' key={ index }><img onClick={this.props.onClick.bind(null, card)} src={ card.url }/></div>;
    }.bind(this);

    return <div className='cards'>{ this.props.cards.map(createItem) }</div>;
  	}
});

var DeckCalculatorAllCards = React.createClass({
	getInitialState: function() {
		this.cards = [];
		return {cards: [], key:"null", name:"default", url:"defaultURL", owner:"guest"};
  	},
  componentWillMount: function() {
  		this.firebaseRefAllCards = new Firebase("https://sizzling-torch-8926.firebaseio.com/all_Cards/");

  		this.firebaseRefAllCards.on("child_added", function(dataSnapshot) {
  			var card = {
	            key: dataSnapshot.name(),
	            name: dataSnapshot.val().name,
	            url: dataSnapshot.val().url,
              owner: dataSnapshot.val().owner
        	};

   			this.cards.push(
   				card
   			);
    		this.setState({
      			cards: this.cards
    		});
  		}.bind(this));
	},

	componentWillUnmount: function() {
    	this.firebaseRefAllCards.off();
    },
  handleOnAdd: function(card){    	
      Actions.addUserCard(card);
    },
  	render: function() {
    return (
      <div className='div'>
      	<h3>All Cards</h3>
        <CardsListAllCard onClick={ this.handleOnAdd } cards={ this.state.cards } />
      </div>
    );
  }
});

var CardsListUserCard = React.createClass({
	render: function() {
    var createItem = function(card, index) {
      	return <div className='card' key={ index }><img onClick={this.props.onClick.bind(null, card)} src={ card.url }/></div>;
    }.bind(this);

    return <div className='cards'>{ this.props.userCards.map(createItem) }</div>;
  	}
});

var DeckCalculatorUserCards = React.createClass({
  mixins: [Reflux.connect(CardStore,"userCards")],
	getInitialState: function() {
		this.defaultUserName = "Guest";
		return {userCards: [], key:"null", name:"default", url:"defaultURL"};
  },
  componentWillMount: function() {
	},
	componentWillUnmount: function() {
  },    
  handleOnRemove: function(card){
      Actions.removeUserCard(card);
  },
  render: function() {
    return (
      <div className='div'>
      	<h3>{ this.state.userName } Cards</h3>
        <CardsListUserCard onClick={ this.handleOnRemove } userCards={ this.state.userCards } />
      </div>
    );
  }
});

var DeckBuilder = React.createClass({
	render : function (){
	return (
		<div>
			<DeckCalculatorUserCards />
			<DeckCalculatorAllCards />
		</div>
		);	
	}
});

module.exports = DeckBuilder;