export default function pop(state = {
    entry: 'HOME',
    pops: []
}, action) {
    if (action.type) {
        return {...state, ...action.data, type: action.type}
    } else {
        return state
    }
}