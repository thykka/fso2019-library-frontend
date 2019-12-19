import React, { useState } from 'react'

const Authors = ({ show, result, editAuthorBorn }) => {
  if (!show) {
    return null
  }
  if(result.loading) {
    return (
      <div>Loading authors...</div>
    );
  }
  const authors = result.data.allAuthors || [];

  const border = {
    borderLeft: '1px solid',
    paddingLeft: '0.5em'
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th style={border}>
              born
            </th>
            <th style={border}>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.id}>
              <td>{a.name}</td>
              <td style={border}><EditBorn author={a} editAuthorBorn={editAuthorBorn} /></td>
              <td style={border}>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}

const EditBorn = ({ author, editAuthorBorn })=> {
  const [editing, setEditing] = useState(false);
  const [newBirthYear, setNewBirthYear] = useState(author.born || '');

  const inputRef = React.createRef();

  const handleSubmit = async (authorId) => {
    if(authorId && newBirthYear) {
      const born = parseInt(newBirthYear, 10);
      if(born.toString() === newBirthYear) {
        await editAuthorBorn({
          variables: {
            name: author.name,
            born: parseInt(newBirthYear, 10)
          }
        });
      } else {
        console.warn('Invalid birthyear');
      }
    }
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
    const input = inputRef.current;
    setTimeout(() =>
      input.select()
    , 10);
  };

  const handleInput = (newValue) => {
    setNewBirthYear(newValue);
  };

  const sharedStyle = {
    font: 'inherit',
    padding: '0.25em',
    margin: '0',
    boxSizing: 'border-box',
    height: '2em',
    verticalAlign: 'top'
  }

  const bornYearStyle = {
    border: '1px solid',
    width: '5ex',
    marginRight: '0.5em'
  }

  const inputStyle = {
    ...sharedStyle,
    ...bornYearStyle,
    display: editing ? 'inline-block' : 'none'
  };

  const noInputStyle = {
    ...sharedStyle,
    ...bornYearStyle,
    borderColor: '#0000',
    minWidth: '5ex',
    display: editing ? 'none' : 'inline-block'
  }

  const buttonStyle = {
    ...sharedStyle,
    border: '0',
    background: '#0000',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    font: 'inherit'
  };

  const iconStyle = {
    display: 'inline-block',
    transform: 'scale(1.5)'
  };

  return (
    <>
      <input ref={inputRef}
        value={newBirthYear}
        style={inputStyle}
        onInput={e => handleInput(e.target.value) }
        onChange={e => handleInput(e.target.value) }
      />
      <span style={noInputStyle}>{author.born}</span>
      <button style={buttonStyle}
        onClick={e => editing ? handleSubmit(author.id) : handleEdit(author.id) }
      >{
        editing
          ? <span style={iconStyle} role="img" aria-label="edit">&#x1f58b;</span>
          : <span style={iconStyle} role="img" aria-label="save">&#x1f4be;</span>
      }</button>
    </>
  )
};

export default Authors
