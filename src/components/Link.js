import React, { Component } from 'react';

class Link extends Component {
  render() {
    return (
      <div>
        {this.props.link.description} ({this.props.link.url})
      </div>
    );
  }

  voteForLink = async () => {
    // implemented later
  }
}

export default Link;
