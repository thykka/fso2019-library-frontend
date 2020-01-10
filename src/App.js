import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

import { Query, ApolloConsumer, Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

const ALL_AUTHORS = gql`{
  allAuthors { name, born, id }
}`;

const ALL_BOOKS = gql`{
  allBooks {
    title,
    published,
    author {
      name,
      born
    },
    genres,
    id
  }
}`;

const CREATE_BOOK = gql`
mutation createBook(
  $title: String!,
  $author: String!,
  $published: Int,
  $genres: [String!]!
) {
  addBook(
    title: $title,
    authorName: $author,
    published: $published,
    genres: $genres
  ) {
    title,
    published,
    author {
      name
    },
    id
  }
}`;

const EDIT_AUTHOR_BORN = gql`
mutation editAuthorBorn(
  $name: String!,
  $born: Int!
) {
  editAuthor(
    name: $name,
    setBornTo: $born
  ) {
    name, born, id
  }
}
`;

const App = () => {
  const [page, setPage] = useState('authors')

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      <ApolloConsumer>
        { client =>(<>
          <Query query={ALL_AUTHORS}>{ result =>
            <Mutation
              mutation={EDIT_AUTHOR_BORN}
              refetchQueries={[{ query: ALL_AUTHORS }]}>
                { editAuthorBorn =>
                  <Authors show={page === 'authors'}
                    editAuthorBorn={editAuthorBorn}
                    result={result}
                    client={client} />
                }
            </Mutation>
          }</Query>

          <Query query={ALL_BOOKS}>{ result =>
            <Books show={page === 'books'} result={result} client={client} />
          }</Query>
        </>)}
      </ApolloConsumer>

      <Mutation
        mutation={CREATE_BOOK}
        refetchQueries={[{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]}>
        { createBook => (
            <NewBook
              show={page === 'add'}
              createBook={createBook}
            />
        ) }
      </Mutation>

    </div>
  )
}

export default App
