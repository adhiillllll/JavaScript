function abc(){
    let e=20;
    let f=40;
    function xyz(){
        alert("this is " +(e+f))
        console.log(e+f)
        console.error("ERROR")
    }
    xyz();
}
abc();



//callback functions

setTimeout(function () {
    console.log("timer")
} , 4000)


function x(y){
  console.log("x")
  y()
}
x(function y(){
  console.log("y")
})