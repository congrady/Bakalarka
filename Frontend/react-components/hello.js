React.createClass({
  sayHello: function(){
    alert(`Hello ${this.props.name}`);
  },
  render: function() {
    //var message = `Hello ${this.props.name}`;

    //var x = React.createElement('div', {href: 'https://facebook.github.io/react/'}, 'Hello!')

    return React.createElement('div', {href: 'https://facebook.github.io/react/'}, 'Hello!')
  }
});
