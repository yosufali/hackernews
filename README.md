# Notes

## GraphQL Queries

For each React component that requires data from the backend, we have to write what these requirements are expressing them in the form of a GraphQL fragment. We use Relay's API for this: the `fragmentContainer` can be used to wrap the React component so that Relay can:
- figure out what the data dependencies for each component are,
- compose a query,
- send that query to the server,
- then make the result data available to the components.

For the given component, import the needed dependencies:

```javascript
import { createFragmentContainer, graphql } from 'react-relay';
```

Create a fragmentContainer based on the given component. The fragment that specifies the data dependencies of the component is tagged with the `graphql` function (which is later used by the graphql compiler to compile the fragments).

```javascript
export default createFragmentContainer(Link, graphql`
  fragment Link_link on Link {
    id
    description
    url
  }
`)
```

The `Link_link` fragment name is based on the naming of convention: name according to the File `Link`, and the expected prop `link`.

Above example code can be found [here](https://github.com/yosufali/hackernews-react-relay/blob/master/src/components/Link.js).

---

The `Link` component above is used within a `LinkList` component. The fragment for `LinkList` follows a similar style:

```javascript
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
```

This:
- asks for the last 100 links that have been added to the database (in relay, you always have to specify how many from a list you want to fetch, you can't fetch the entire list)
- `orderby` ensures the latest links are displayed first
- `@connection` directive is used to identify that particular connection in the relay cache
- Using the Relay `@connection` pattern, you have to traverse the connection by going through the edges, to the individual nodes, to get access to the elements inside the connection.
- There are no specific data requirements for this component `LinkList`, so we just include those for `Link` (you should include the data dependencies of the component's children)

Above example code can be found [here](https://github.com/yosufali/hackernews-react-relay/blob/master/src/components/LinkList.js).

These data dependencies are passed up to the root of the Relay container tree, the `QueryRenderer`, which sits in a parent component.

---

QueryRenderer is the root of a Relay container tree, and
- it takes a query as an argument
- fetches the data
- calls the render callback with the received data
- then in the render callback, you can actually render the components WITH their data available.

This would be the root of our React application, and the component that that is rendered in `App.js`.

You need the following relevant imports:

```javascript
import { QueryRenderer, graphql } from 'react-relay';
import environment from '../Environment';
```

`environment` is the Relay environment which is needed so the `QueryRenderer`, through the `environment`, knows the GraphQL server that it has to send the Query to.

(An example [environment.js](https://github.com/yosufali/hackernews-react-relay/blob/master/src/Environment.js))

The root query will include the fragments of the children, just like the fragment in the previous component, to make sure they're taken into account when they're sent to the server:

```javascript
const LinkListPageQuery = graphql`
  query LinkListPageQuery {
    viewer {
      ...LinkList_viewer
    }
  }
`
```

Now with the root query in place, we can instantiate the `QueryRenderer`, and pass it all the required information:

```javascript
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
            return <LinkList viewer={props.viewer} />
          }
          return <div> Loading </div>
        }}
      />
    )
  }
}
```

We're:
- passing the relay `environment` to the `QueryRenderer` so that it knows the server that it can talk to,
- passing the root query that we just defined,
- then the `render` callback gets the error and props properties from the network request,
- - if the network request fails we can render an error/failure state to the userkk
- - if the props are available we use them and render the relevant components by passing down the propsk
- - otherwise the network request is ongoing so we just render a loading state to the user.

Above example code can be found [here](https://github.com/yosufali/hackernews-react-relay/blob/master/src/components/LinkListPage.js).

---

You need to run the `react-compiler` to compile all the graphql code. You can do this by running the following, passing in the relevant src files and schema:

`relay-compiler --src ./src --schema ./schema.graphql`

However, you instead can configure `babel-plugin-relay` which will compile everything for you. (You also need to do this anyway in order to run the application.) You will need to eject from `create-react-app` to do this in order to do custom configurations.

```json
"babel": {
  "presets": [
    "react-app"
  ],
  "plugins": [
    "relay"
  ]
}
```

To inspect what what the actual query that is sent to the server looks like, you can go to the network tab of your browser's dev tools.
