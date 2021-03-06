import { Middleware } from "redux";
import { hotelsSearched, hotelsFound } from "../../app/store/hotelSearch/actions";
import Action from "../../app/store/hotelSearch/Action";

type Task = () => Promise<void> | void

export default class FakeSearcher {

    private tasks: Task[] = []

    async flush() {
        return Promise.all(this.tasks.map(fn => fn()));
    }

    middleware(): Middleware {
        const enqueue = (t: Task) => this.tasks.push(t);

        return ({dispatch}) => next => (action: Action) => {
            switch(action.type) {
                case hotelsSearched.type:
                    enqueue(() => {
                        dispatch(hotelsFound({ 
                            hotels: [ 
                                { name: `${action.filter}1`, facilities: [], starRating: 1 },
                                { name: `${action.filter}2`, facilities: [], starRating: 5 } 
                            ] 
                        }))
                    });
                    
                default:
                    return next(action);
            }
        };
    }

}
