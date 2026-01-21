 
 //for loop
 for( i=1 ; i<=30 ; i++ ) {
    if (i%3 == 0 && i%5 == 0)
    document.write (i + " = fizz - buzz "+"<br>");
    else if ( i % 3 == 0)
    document.write (i +" = fizz "+ "<br>");
    else if (i %5 == 0)
    document.write (i + " = buzz"+"<br>");
   
    
 }



 // sum
let sum = 0;

for (i=1;i<=50;i++) {
    if (i%2==0){
     sum+=i ;

    }

}
document.write(sum);

