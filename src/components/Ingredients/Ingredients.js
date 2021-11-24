import React, { useCallback, useEffect, useMemo, useReducer } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../hooks/http";

const ingredientReducer = (currentIngredient, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredient, action.ingredient];
    case "DELETE":
      return currentIngredient.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get here");
  }
};

//-----------------Logic without custom hook---------------

// const httpReducer = (currentHttp, action) => {
//   switch (action.type) {
//     case "SEND":
//       return { loading: true, error: null };
//     case "RESPONSE":
//       return { ...currentHttp, loading: false };
//     case "ERROR":
//       return { ...currentHttp, error: action.error };
//     case "CLEAR":
//       return { ...currentHttp, error: null };
//     default:
//       throw new Error("Wrong http request!");
//   }
// };

function Ingredients() {
  const [userIngredient, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifier,
    clear,
  } = useHttp(); //custom Hook (useHttp)

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === "REMOVE_INGREDIENT") {
      dispatch({ type: "DELETE", id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === "ADD_INGREDIENTS") {
      dispatch({ type: "ADD", ingredient: { id: data.name, ...reqExtra } });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  //-----------------Logic without custom hook---------------
  // const [httpState, dispatchHttp] = useReducer(httpReducer, {
  //   loading: false,
  //   error: null,
  // });
  // const [userIngredient, setUserIngredient] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  const filterIngredients = useCallback((filterIngredient) => {
    //----------------Logic without custom hook-------------
    // setUserIngredient(filterIngredient);
    dispatch({ type: "SET", ingredients: filterIngredient });
  }, []);

  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        "https://react-hooks-project-4408f-default-rtdb.firebaseio.com/ingredients.json",
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD_INGREDIENTS",
      );

      //use the logic with custom useHttp hook
      //----------------Logic without custom hook-------------
      // setIsLoading(true);
      // dispatchHttp({ type: "SEND" });
      // fetch(
      //   "https://react-hooks-project-4408f-default-rtdb.firebaseio.com/ingredients.json",
      //   {
      //     method: "POST",
      //     body: JSON.stringify(ingredient),
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   },
      // )
      //   .then((response) => response.json())
      //   .then((responseData) => {
      //     // setIsLoading(false);
      //     // dispatchHttp({ type: "RESPONSE" });
      //     dispatch({
      //       type: "ADD",
      //       ingredient: { id: responseData.name, ...ingredient },
      //     });
      //     // setUserIngredient((prevIngredient) => [
      //     //   ...prevIngredient,
      //     //   { id: responseData.name, ...ingredient },
      //     // ]);
      //   });
    },
    [sendRequest],
  );

  const removeIngredientHandler = useCallback(
    (ingredientId) => {
      //use the logic with custom useHttp hook
      sendRequest(
        `https://react-hooks-project-4408f-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
        "DELETE",
        null,
        ingredientId,
        "REMOVE_INGREDIENT",
      );

      //----------------Logic without custom hook-------------
      // dispatchHttp({ type: "SEND" });
      // fetch(
      //   `https://react-hooks-project-4408f-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      //   {
      //     method: "DELETE",
      //   },
      // )
      //   .then((response) => {
      //     dispatchHttp({ type: "RESPONSE" });
      //     dispatch({ type: "DELETE", id: ingredientId });
      //     // setUserIngredient((prevIngredient) =>
      //     //   prevIngredient.filter((ingredient) => ingredient.id !== ingredientId),
      //     // );
      //   })
      //   .catch((error) => {
      //     // setError("Something went Wrong!");
      //     // setIsLoading(false);
      //     dispatchHttp({ type: "ERROR", error: "Something Went Wrong" });
      //   });
    },
    [sendRequest],
  );

  // const clearModal = useCallback(() => {
  //   // setError(null);
  //   // dispatchHttp({ type: "CLEAR" });
  // }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredient}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredient, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filterIngredients} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
