import "./style.scss";
import {Other} from "./utils/interface";

let canvas = document.getElementById("fractal-canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
let information = document.getElementById("information") as HTMLElement;
let elementsOfTheSet = 0;

function complex(this: any, real: number, imaginary: number) {
  this.real = real;
  this.imaginary = imaginary;

  this.add = function (other: Other) {
    return new (complex as any)(this.real + other.real, this.imaginary + other.imaginary);
  };

  this.mul = function (other: Other) {
    return new (complex as any)(
      this.real * other.real - this.imaginary * other.imaginary ,
      this.real * other.imaginary + this.imaginary * other.real
    );
  };

  this.abs = function () {
    return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
  };
}

const include = (real: number, imaginary: number, iterations: number) => {
  let z = new (complex as any)(0, 0);
  let c = new (complex as any)(real, imaginary);
  let i = 0;
  while (z.abs() < 2 && i < iterations) {
    z = z.mul(z).add(c);
    i++;
  }
  return i;
}

const participle = (x: number, y: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
};

const draw = (width: number, height: number, maxIterations: number) => {
  // Coordinates: X (Real numbers), Y (Imaginary numbers);
  let minReal = -2, maxReal = 1, minImaginary = -1, maxImaginary = 1;
  let realStep = (maxReal - minReal) / width;
  let imaginaryStep = (maxImaginary - minImaginary) / height;
  let real = minReal;

  do {
    let imaginary = minImaginary;
       
    do {
      let result = include(real, imaginary, maxIterations);
      let x = (real - minReal) / realStep;
      let y = (imaginary - minImaginary) / imaginaryStep;

       if (result === maxIterations) {
        elementsOfTheSet++;
        participle(x, y, "black");
      }
      if (result !== maxIterations) {
        let color = `hsl(${Math.round((900 * result * 1.0) / maxIterations)}, 100%, 50%)`;
        participle(x, y, color);
      }

      imaginary += imaginaryStep;
    } while(imaginary < maxImaginary);

    real += realStep;
  } while(real < maxReal);
  
}

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

 (async function(){
   let iterations =  Array.from({ length: (180 - 0) / 3 + 1}, (_, i) => 0 + (i * 3));
    for(let i=0; i < iterations.length; i++) {
      draw(700, 450, iterations[i]);
      information.textContent = `Mandelbrot set 
      \nIterations: ${iterations[i]}/180 (${(((i + 1)/iterations.length) * 100).toFixed(2)})%
      \nBelongs to set: ${elementsOfTheSet}`;
      await sleep(10);
   }
})();

