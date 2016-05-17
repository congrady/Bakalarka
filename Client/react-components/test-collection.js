'use strict';

React.createClass({
  render: function() {
    var testElements = [];
    for (let prop in this.props.tests){
      let test = this.props.tests[prop];
      testElements.push(React.createElement('test-component', {
        name: test.name,
        added_by: test.added_by,
        uploaded: test.uploaded,
        last_modified: test.last_modified
      }))
    }

    return React.DOM.div(null, testElements);
  }
});
