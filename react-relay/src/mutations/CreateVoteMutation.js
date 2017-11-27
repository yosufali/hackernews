import {
  commitMutation,
  graphql
} from 'react-relay'
import environment from '../Environment'

const mutation = graphql`
  mutation CreateVoteMutation($input: CreateVoteInput!) {
    createVote(input: $input) {
      vote {
        id
        link {
          id
          votes {
            count
          }
        }
        user {
          id
        }
      }
    }
  }
`
export default (userId, linkId) => {
  const variables = {
    input: {
      userId,
      linkId,
      clientMutationId: ""
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      // tell relay how we want it to update the cache after the mutations has been performed
      // optimisticUpdater is executed directly after the request is sent to the server without the response being received
      // proxyStore which is being passed into the function is your interface to the relay store where it caches all the data from previous queries
      optimisticUpdater: proxyStore => {
        const link = proxyStore.get(linkId)
        // you're following the structure of the link object from the query's payload above: link has a linkedRecord called votes, which has a value called count
        const currentVoteCount = link.getLinkedRecord('votes').getValue('count')
        const newVoteCount = currentVoteCount + 1

        link.getLinkedRecord('votes').setValue(newVoteCount, 'count')
      },
      // updater is called once the actual response is received, changes made by above are rolled back for changes in here using the actual data retuened by the server
      updater: proxyStore => {
        // createVote refers to the root feild of the mutations we just sent
        const createVoteField = proxyStore.getRootField('createVote')
        const newVote = createVoteField.getLinkedRecord('vote')
        const updatedLink = newVote.getLinkedRecord('link')
        const newVotes = updatedLink.getLinkedRecord('votes')
        const newVoteCount = newVotes.getValue('count')

        const link = proxyStore.get(linkId)
        link.getLinkedRecord('votes').setValue(newVoteCount, 'count')

      },
      onError: err => console.error(err),
    },
  )
}
