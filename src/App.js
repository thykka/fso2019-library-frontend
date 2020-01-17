import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

import { Query, ApolloConsumer, Mutation, useMutation } from 'react-apollo';
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

const LOGIN = gql`
mutation login(
  $username: String!,
  $password: String!
) {
  login(
    username: $username,
    password: $password
  ) {
    value
  }
}`

const CREATE_BOOK = gql`
mutation createBook(
  $token: String!,
  $title: String!,
  $author: String!,
  $published: Int,
  $genres: [String!]!
) {
  addBook(
    token: $token,
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
  $token: String!,
  $name: String!,
  $born: Int!
) {
  editAuthor(
    token: $token,
    name: $name,
    setBornTo: $born
  ) {
    name, born, id
  }
}
`;

const App = () => {
  const [page, setPage] = useState('authors')

  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null);
  const [login] = useMutation(LOGIN, {
    onError: (e)=>{ setErrorMessage(e.message || e) }
  })
  const logout = (client) => {
    setToken(null)
    localStorage.removeItem('phonenumbers-user-token')
    client.resetStore()
  }

  const errorNotification = () => errorMessage && (
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>
  );

  if(!token) {
    return (
      <div>
        {errorNotification()}
        <h2>Log in</h2>
        <LoginForm login={login} setToken={token => setToken(token)} />
      </div>
    )
  }

  return (
    <div>
    <ApolloConsumer>{ client =>(
      <>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => logout(client)}>Log out</button>
        </div>
        <Query query={ALL_AUTHORS}>{ result =>
          <Mutation
            mutation={EDIT_AUTHOR_BORN}
            refetchQueries={[{ query: ALL_AUTHORS }]}>
              { editAuthorBorn =>
                <Authors show={page === 'authors'}
                  editAuthorBorn={editAuthorBorn}
                  result={result}
                  client={client}
                  token={token} />
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
            token={token}
          />
      ) }
    </Mutation>
  </div>)
}

export default App
