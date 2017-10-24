// 1
import {
  commitMutation, // used to send mutation to the server
  graphql,
} from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import environment from '../Environment'

// 2
// $input is the arguments that we want to pass when creating a new link
//   i.e. the url and description of the link
// createLink is the field of the mutation (passing in the above input)
// then specifying the payload we want returned from the server after the mutation
const mutation = graphql`
  mutation CreateLinkMutation($input: CreateLinkInput!) {
    createLink(input: $input) {
      link {
        id
        createdAt
        url
        description
      }
    }
  }
`

// 3
// An anonymous function that takes the arguents that we want the caller to
//   provide when they want to create a new link on the backend
// Accepts the data, and a callback to execute once the mutation is performed
export default (description, url, callback) => {
  // 4
  // wrapping the desc and url in an input object which corresponds to the
  //   input object being passed into the mutation above
  // clientMutationId is included bc it's a requirement of Graphcool relay API
  //   (not required anymore with Relay Modern)
  const variables = {
    input: {
      description,
      url,
      clientMutationId: ""
    },
  }
  // 5
  // Passing in the env (so Relay knows the endpoint), the mutation and vars
  //   we've prepared, then (once completed) calling the callback that the above //   function provides
  commitMutation(
    environment,
    {
      mutation,
      variables,
      // 6
      onCompleted: () => {
        callback()
      },
      onError: err => console.error(err),
    },
  )
}
