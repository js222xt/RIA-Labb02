/** @jsx React.DOM */

var React = require("react");
var Firebase = require("firebase");
var Actions = require("./Actions");
var Reflux = require('reflux');

var UserStore = Reflux.createStore({
  init: function(){
    this.User = [];
    this.listenTo(Actions.login,this.login.bind(this));
    this.listenTo(Actions.logout,this.logout.bind(this));
  },
  login: function(user){
    this.User = user;
    this.trigger((this.User));
  },
  logout: function(){
    this.trigger((null));
  },
  getDefaultData: function(){
    return this.User || [];
  }
});

module.exports = UserStore;