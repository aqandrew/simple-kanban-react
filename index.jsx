import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';

const initialData = [
  {
    columnName: 'Winnie',
    items: ['buy eggs', 'buy milk'],
    color: 'purple',
  },
  {
    columnName: 'Brad',
    items: ['buy meat', 'buy vegi'],
    color: 'green',
  },
  {
    columnName: 'Bob',
    items: ['buy meat', 'buy vegi'],
    color: 'darkgrey',
  },
  {
    columnName: 'Thomas',
    items: ['buy meat', 'buy vegi'],
    color: 'orange',
  },
];

const reducer = (state, action) => {
  const getColumnWithCardRemoved = (column, cardIndex) => {
    return {
      ...column,
      items: column.items.filter((card, j) => j !== cardIndex),
    };
  };

  const getColumnWithCardAdded = (column, cardIndex, text) => {
    return {
      ...column,
      items: [
        ...column.items.slice(0, cardIndex),
        text,
        ...column.items.slice(cardIndex),
      ],
    };
  };

  switch (action.type) {
    case 'ADD_CARD': {
      return state.map((column, i) => {
        if (i === action.columnIndex) {
          return { ...column, items: [...column.items, action.newCardText] };
        }

        return column;
      });
    }
    case 'MOVE_CARD_LEFT': {
      return state.map((column, i) => {
        const { text, columnIndex, cardIndex } = action;

        if (i === columnIndex) {
          return getColumnWithCardRemoved(column, cardIndex);
        }

        if (i === columnIndex - 1) {
          return getColumnWithCardAdded(column, cardIndex, text);
        }

        return column;
      });
    }
    case 'MOVE_CARD_RIGHT': {
      return state.map((column, i) => {
        const { text, columnIndex, cardIndex } = action;

        if (i === columnIndex) {
          return getColumnWithCardRemoved(column, cardIndex);
        }

        if (i === columnIndex + 1) {
          return getColumnWithCardAdded(column, cardIndex, text);
        }

        return column;
      });
    }
    default:
      return state;
  }
};

const Card = ({ text, columnIndex, cardIndex, dispatch }) => {
  const isFirstColumn = columnIndex === 0;
  const isLastColumn = columnIndex === initialData.length - 1;

  return (
    <li>
      <button
        onClick={() => {
          dispatch({ type: 'MOVE_CARD_LEFT', text, columnIndex, cardIndex });
        }}
        disabled={isFirstColumn}
      >
        {'<'}
      </button>
      {text}
      <button
        onClick={() => {
          dispatch({ type: 'MOVE_CARD_RIGHT', text, columnIndex, cardIndex });
        }}
        disabled={isLastColumn}
      >
        {'>'}
      </button>
    </li>
  );
};

const Column = ({ columnName, items, color, columnIndex, dispatch }) => {
  const openAddCardModal = () => {
    const newCardText = prompt('Please enter card text');
    dispatch({ type: 'ADD_CARD', newCardText, columnIndex });
  };

  return (
    <div className="Column">
      <h2 style={{ background: color }}>{columnName}</h2>
      <ol>
        {items.map((item, index) => (
          <Card
            text={item}
            columnIndex={columnIndex}
            dispatch={dispatch}
            cardIndex={index}
            key={index}
          />
        ))}
      </ol>
      <button onClick={openAddCardModal}>+ Add a card</button>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialData);

  console.log({ state });

  return (
    <div className="App">
      {state.map((column, index) => (
        <Column
          {...column}
          columnIndex={index}
          dispatch={dispatch}
          key={column.columnName}
        />
      ))}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
