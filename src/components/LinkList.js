import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Link from './Link';

class LinkList extends Component {
  render() {
    return (
      <div>
        {this.props.viewer.allLinks.edges.map(({node}) =>
          <Link key={node.__id} link={node} />
        )}
      </div>
    )
  }
}

// this asks for the last 100 links that have been added to the database
// in relay, you always have to specify how many from a list you want to fetch
// orderby ensures latest links are dislayed first
// @connection is used to identify that particular conn in the relay cache
// traverse the conn by going through the edges, to the individual nodes, to
//   get access to the elements inside the list/conn
// no specific req. for this comp (LinkList), so just include those for Link
//  (should inc dep of its children)
export default createFragmentContainer(LinkList, graphql`
  fragment LinkList_viewer on Viewer {
    allLinks(last: 100,orderBy: createdAt_DESC) @connection(key: "LinkList_allLinks", filters:[]) {
      edges {
        node {
          ...Link_link
        }
      }
    }
  }
`);
