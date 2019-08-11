import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);


  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-repository.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
      setIsLoading(false);
      return res.json();
    })
    .then(resData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        { id: resData.name, ...ingredient }
      ]);
    });
  };

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(`https://react-hooks-repository.firebaseio.com/ingredients/${ingredientId}.jon`, {
      method: 'DELETE'
    })
    .then(res => {
      setIsLoading(false);
      setUserIngredients(prevIngredients =>
        prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
      );
    })
    .catch(err => {
      setError('Something went wrong!');
    });
  }
  
  const clearError = () => {
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
