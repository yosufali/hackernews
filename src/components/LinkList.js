import React, { Component } from 'react';
import Link from './Link';

class LinkList extends Component {
  render() {
    const linksToRender = [{
      id: '1',
      description: 'The coolest GraphQL Backend',
      url: 'https://www.graph.cool',
    },
    {
      id: '2',
      description: 'Highly Performant GraphQL client from Facebook',
      url: 'https://facebook.github.io/relay/'
    }]

    return (
      <div>
        {linksToRender.map(link => (
          <Link key={link.id} link={link}/>
        ))}
      </div>
    )
  }
}

export default LinkList;
