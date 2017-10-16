import React, { Component } from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from '../Environment';
import LinkList from './LinkList';

// The root query includes the fragments of the children
// to make sure they're taken into account when query is
// sent to the server
const LinkListPageQuery = graphql`
  query LinkListPageQuery {
    viewer {
      ...LinkList_viewer
    }
  }
`

// render callback:
// - we get the error + props properties form the network request
// - if the net. req. fails we can render an error otherwise if props available use them
// - otherwise the req. is still loading so wait
class LinkListPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment = {environment}
        query = {LinkListPageQuery}
        render = {({error, props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return <LinkList view={props.viewer} />
          }
          return <div> Loading </div>
        }}
      />
    )
  }
}

export default LinkListPage;

// QueryRenderer is the root of a Relay container tree, and
// - it takes a query as an argument
// - fetches the data
// - calls the render callback with the recieved data
// then in the render callback, you can actually render the components WITH
// thier data available
