/** @jsx React.DOM */

var React = require("react");
var Firebase = require("firebase");
var $ = require("jquery");
var Actions = require("./Actions");
var Reflux = require('reflux');
var UserStore = require('./UserStore');

var UpdateCards = React.createClass({
	mixins: [Reflux.connect(UserStore,"User")],
	getInitialState: function() {
    	this.items = [];
    	this.admins = [];
    	this.User = [];
    	return {items: [], name: "", url:""};
  	},
  	componentWillMount: function() {
		this.firebaseRef = new Firebase("https://sizzling-torch-8926.firebaseio.com/all_Cards/");

		$.ajax({
      		url: this.props.url,
      		dataType: 'json',
      		success: function(admins) {
        		this.setState({admins: admins});
      		}.bind(this),
      		error: function(xhr, status, err) {
        		console.error(this.props.url, status, err.toString());
      		}.bind(this)
    	});
	},
	componentWillUnmount: function() {
    	this.firebaseRef.off();
    },
	handleSubmit: function(e) {
    	e.preventDefault();
    	if( this.state.name.toString().length > 0 &&
    		this.state.url.toString().length > 0){
    		var imageUrl = "../src/images/cards/" + this.state.url.toString();
    		console.log(imageUrl);
			imageExists(imageUrl, function(exists) {
			  	if(exists){			  		
					this.firebaseRef.push({
        				name: this.state.name,
        				url: imageUrl
		  			});
		  	
		  			this.setState({name: "", url:""});

		  			document.getElementById("submitError").innerHTML = "";
			  	}
			  	else{
			  		document.getElementById("submitError").innerHTML = "Image Not Found!";
			  	}
			}.bind(this));
    	}   	
    },
    nameOnChange: function(e) {
	    this.setState({name: e.target.value});
    },
    URLOnChange: function(e) {
	    this.setState({url: e.target.value});
    },
	render: function(){	
		
		if(isAdmin(this.state.admins, this.state.User)){
			return(
				 <div className='div'>
					<form onSubmit={ this.handleSubmit }>
						<p id='submitError'></p>
						<p>Add a card to db</p>
	          			Name:<input onChange={ this.nameOnChange } value={ this.state.name } /><br/>
	          			URL:<input onChange={ this.URLOnChange } value={ this.state.url } /><br/>
	         			<button>Add Card</button>
	        		</form>
				</div>
			);
		}
		else{
			return (
				 <div className='div'>
					<p>You are not one of the admins</p>
				</div>
			);
		}
	}
});


function imageExists(url, callback) {
  var img = new Image();
  img.onload = function() { callback(true); };
  img.onerror = function() { callback(false); };
  img.src = url;
}

function isAdmin(admins, user){

	if(admins != null && user != null){
		for (var i = 0; i < admins.length; i++) {
			if(admins[i].username == user.github.username){
				return true;
			}
		};
		return false;
	}
	else{
		return false;
	}
}

var UpdateCardsHTML = React.createClass({
	render : function (){
	return (
		<div>
			<UpdateCards url="Admins.json"/>
		</div>
		);	
	}
});

module.exports = UpdateCardsHTML;