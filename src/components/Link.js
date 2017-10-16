import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

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

// in the fragment we specify the data dependencies for the Link Component
export default createFragmentContainer(Link, graphql`
  fragment Link_link on Link {
    id
    description
    url
  }
`)
