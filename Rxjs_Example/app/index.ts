import { Observable } from 'rxjs';

let circle = document.getElementById("circle");
// pub:
let source = Observable.fromEvent(document, 'mousemove')
	
	// processing pipeline:
	.map((e:MouseEvent) => {
		return {
			x: e.clientX,
			y: e.clientY
		}
	}). filter(value => value.x < 500);

function onNext(value:any) {
	circle.style.left = value.x;
	circle.style.top = value.y;
}

// sub:
source.subscribe(
	value => console.log(value),
	e => console.log(`error: ${e}`),
	() => console.log("Complete")
);

