React.createClass({
  sayHello: function(){
    alert(`Hello ${this.props.name}`);
  },
  render: function() {
    var message = `Hello ${this.props.name}`;

    return React.DOM.p(null, message);
  }
});
