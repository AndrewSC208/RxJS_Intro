import * as Rx from 'rxjs-es/Rx';

// // ======= CONVERTING TO OBSERVABLES ======= //
// // From one or multiple values
// Rx.Observable.of('foo', 'bar');
// // From array:
// Rx.Observable.from([1,2,3])
// // From event: *THIS IS FOR SAFARI*
// Rx.Observable.fromEvent(document.querySelector('button'), 'click');
// // From Promise:
// Rx.Observable.fromPromis(fetch('/users'));
// // From a callback (last argument is a callback)
// // fs.exists = (path, cb(exists))
// let exists = Rx.Observable.bindCallback(fs.exists);
// exists('file.txt').subscribe(exists => console.log('Does file exist?', exists));
// // From a callback (last argument is a callback)
// // fs.rename = (pathA, pathB, cb(err, result))
// let rename = Rx.Observable.bindNodeCallback(fs.rename);
// rename('file.txt', 'else.txt').subscribe(() => console.log('Renamed!'));

// // ======= CREATING OBSERVABLES ======= //
// // Externally produce new events.
// let myObservable = new Rx.Subject();
// myObservable.subscribe(value => console.log(value));
// myObservable.next('foo');

// // Internally produce new events.
// let myObservable = Rx.Observable.create(observer => {
//   observer.next('foo');
//   setTimeout(() => observer.next('bar'), 1000);
// });
// myObservable.subscribe(value => console.log(value));

// // ======= CONTROLLING THE FLOW ======= //
// // typing "hello world"
// var input = Rx.Observable.fromEvent(document.querySelector('input'), 'input');

// // Filter out target values less than 3 characters long
// input.filter(event => event.target.value.length > 2)
//   .map(event => event.target.value)
//   .subscribe(value => console.log(value)); // "hel"

// // Delay the events
// input.delay(200)
//   .map(event => event.target.value)
//   .subscribe(value => console.log(value)); // "h" -200ms-> "e" -200ms-> "l" ...

// // Only let through an event every 200 ms
// input.throttleTime(200)
//   .map(event => event.target.value)
//   .subscribe(value => console.log(value)); // "h" -200ms-> "w"

// // Let through latest event after 200 ms
// input.debounceTime(200)
//   .map(event => event.target.value)
//   .subscribe(value => console.log(value)); // "o" -200ms-> "d"

// // Stop the stream of events after 3 events
// input.take(3)
//   .map(event => event.target.value)
//   .subscribe(value => console.log(value)); // "hel"

// // Passes through events until other observable triggers an event
// var stopStream = Rx.Observable.fromEvent(document.querySelector('button'), 'click');
// input.takeUntil(stopStream)
//   .map(event => event.target.value)
//   .subscribe(value => console.log(value)); // "hello" (click)

// // ======= PRODUCING VALUES ======= //
// // typing "hello world"
// var input = Rx.Observable.fromEvent(document.querySelector('input'), 'input');

// // Pass on a new value
// input.map(event => event.target.value)
//   .subscribe(value => console.log(value)); // "h"

// // Pass on a new value by plucking it
// input.pluck('target', 'value')
//   .subscribe(value => console.log(value)); // "h"

// // Pass the two previous values
// input.pluck('target', 'value').pairwise()
//   .subscribe(value => console.log(value)); // ["h", "e"]

// // Only pass unique values through
// input.pluck('target', 'value').distinct()
//   .subscribe(value => console.log(value)); // "helo wrd"

// // Do not pass repeating values through
// input.pluck('target', 'value').distinctUntilChanged()
//   .subscribe(value => console.log(value)); // "helo world"

// ===== CREATING APPLICATIONS ===== //
// Let us create a simple state store of the value 0. On each click we want to increase that count in our state store.
//var button = document.querySelector('button');

//Rx.Observable.fromEvent(button, 'click')
// scan (reduce) to a stream of counts:
//.scan(count => count + 1, 0)
// set the count on an element each time it changes:
//.subscribe(count => document.querySelector('#count').innerHTML = count);

// ===== STATE STORES ===== //
// Applications use state stores to hold state. These are called different things in different frameworks, like store, reducer and model, but at the core they are all just a plain object. What we also need to handle is that multiple observables can update a single state store.
//var increaseButton = document.querySelector('#increase');
//var increase = Rx.Observable.fromEvent(increaseButton, 'click')
  // We map to a function that will change our state
//  .map(() => state => Object.assign({}, state, {count: state.count + 1}));

//var state = increase.scan((state, changeFn) => changeFn(state), {count: 0});

var increaseButton = document.querySelector('#increase');
var increase = Rx.Observable.fromEvent(increaseButton, 'click')
  // Again we map to a function the will increase the count
  .map(() => state => Object.assign({}, state, {count: state.count + 1}));

var decreaseButton = document.querySelector('#decrease');
var decrease = Rx.Observable.fromEvent(decreaseButton, 'click')
  // We also map to a function that will decrease the count
  .map(() => state => Object.assign({}, state, {count: state.count - 1}));

var inputElement = document.querySelector('#input');
var input = Rx.Observable.fromEvent(inputElement, 'keypress')
  // Let us also map the keypress events to produce an inputValue state
  .map(event => state => Object.assign({}, state, {inputValue: event.target.value}));

// We merge the three state change producing observables
var state = Rx.Observable.merge(
  increase,
  decrease,
  input
).scan((state, changeFn) => changeFn(state), {
  count: 0,
  inputValue: ''
});

// We subscribe to state changes and update the DOM
// state.subscribe((state) => {
//   document.querySelector('#count').innerHTML = state.count;
//   document.querySelector('#hello').innerHTML = 'Hello From Input: ' + state.inputValue;
// });

// To optimize our rendering we can check what state
// has actually changed
var prevState = {};
state.subscribe((state) => {
  if (state.count !== prevState.count) {
    document.querySelector('#count').innerHTML = state.count;
  }
  if (state.inputValue !== prevState.inputValue) {
    document.querySelector('#hello').innerHTML = 'Hello From Input: ' + state.inputValue;
  }
  prevState = state;
});
