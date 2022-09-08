function innerHtmlRenderer(index) {
  const innerCounter = `
<div class="p-4 h-auto flex flex-col items-center justify-center space-y-5 bg-white rounded shadow">
<div id="counter-${index}" class="text-2xl font-semibold">0</div>
<div class="flex space-x-3">
  <button
    id="increment-${index}"
    class="bg-indigo-400 text-white px-3 py-2 rounded shadow"
    onclick="incrementFun(${index})"
  >
    Increment
  </button>
  <button
    id="decrement-${index}"
    class="bg-red-400 text-white px-3 py-2 rounded shadow"
    onclick="decrementFun(${index})"
  >
    Decrement
  </button>
</div>
</div>
<br />
`;

  return innerCounter;
}

// select dom elements
const counterEl = document.getElementById("counter");
const incrementEl = document.getElementById("increment");
const decrementEl = document.getElementById("decrement");
const newCounterEl = document.getElementById("new-counter");
const innerCounterEl = document.getElementById("inner-counter");
const resetEl = document.getElementById("reset");

// initial state
const initialState = {
  value: 0,
  totalCounter: 0,
  flag: false,
  countCounter: [],
};

// create reducer function
function counterReducer(state = initialState, action) {
  if (action.type === "increment") {
    return {
      ...state,
      value: state.value + 1,
      flag: false,
    };
  } else if (action.type === "decrement") {
    return {
      ...state,
      value: state.value - 1,
      flag: false,
    };
  } else if (action.type === "TOTALCOUNTER") {
    return {
      ...state,
      totalCounter: state.totalCounter + 1,
      countCounter: state.countCounter.concat(0),
      flag: true,
    };
  } else if (action.type === "INCREMENTDYNAMICCOUNTER") {
    return {
      ...state,
      flag: false,
      countCounter: state.countCounter.map((v, index) => {
        if (index === action.payload.index) {
          v = v + 1;
          return v;
        }

        return v;
      }),
    };
  } else if (action.type === "DECREMENTDYNAMICCOUNTER") {
    return {
      ...state,
      flag: false,
      countCounter: state.countCounter.map((v, index) => {
        if (index === action.payload.index) {
          v = v - 1;
          return v;
        }

        return v;
      }),
    };
  } else if (action.type === "RESET") {
    return {
      ...state,
      flag: false,
      countCounter: [],
    };
  } else {
    return state;
  }
}

// create store
const store = Redux.createStore(counterReducer);

const render = (index) => {
  const state = store.getState();
  console.log(state);
  counterEl.innerText = state.value.toString();
  if (state.totalCounter > 0 && state.flag) {
    innerCounterEl.innerHTML += innerHtmlRenderer(state.totalCounter - 1);
  }
  if (index >= 0) {
    document.getElementById(`counter-${index}`).innerText =
      state.countCounter[index];
    index = -1;
  }
};

// update UI initially
render();

store.subscribe(render);

// button click listeners
incrementEl.addEventListener("click", () => {
  store.dispatch({
    type: "increment",
  });
});

decrementEl.addEventListener("click", () => {
  store.dispatch({
    type: "decrement",
  });
});

newCounterEl.addEventListener("click", () => {
  store.dispatch({
    type: "TOTALCOUNTER",
  });
});

resetEl.addEventListener("click", () => {
  store.dispatch({
    type: "RESET",
  });
});

function incrementFun(index) {
  store.dispatch({
    type: "INCREMENTDYNAMICCOUNTER",
    payload: {
      index,
    },
  });

  render(index);
}

function decrementFun(index) {
  store.dispatch({
    type: "DECREMENTDYNAMICCOUNTER",
    payload: {
      index,
    },
  });

  render(index);
}
