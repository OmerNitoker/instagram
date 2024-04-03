import { carService } from "../../services/car.service.js";
import { ADD_CAR, CAR_UNDO, REMOVE_CAR, SET_CARS, SET_IS_LOADING, UPDATE_CAR } from "../reducers/car.reducer.js";
import { store } from "../store.js";

export function loadCars() {
    const { filterBy } = store.getState().carModule

    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    return carService.query(filterBy)
        .then(cars => {
            store.dispatch({ type: SET_CARS, cars })
        })
        .catch(err => {
            console.log('car action -> Cannot load cars', err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        })
}

export function removeCar(carId) {
    return carService.remove(carId)
        .then(() => {
            store.dispatch({ type: REMOVE_CAR, carId })
        })
        .catch(err => {
            console.log('car action -> Cannot remove car', err)
            throw err
        })
}

export function removeCarOptimistic(carId) {
    store.dispatch({ type: REMOVE_CAR, carId })
    return carService.remove(carId)
        .catch(err => {
            store.dispatch({ type: CAR_UNDO })
            console.log('car action -> Cannot remove car', err)
            throw err
        })
}

export function saveCar(car) {
    const type = car._id ? UPDATE_CAR : ADD_CAR
    return carService.save(car)
        .then(carToSave => {
            store.dispatch({ type, car: carToSave })
            return carToSave
        })
        .catch(err => {
            console.log('car action -> Cannot save car', err)
            throw err
        })
}