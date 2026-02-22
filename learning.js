
// {--------PROBLEM 1: Swap Two Variables-------}


// >..... swap with temp.....

        // let a=5,b=10,temp

        // temp=a
        // a=b
        // b=temp

        // console.log(a)
        // console.log(b)


//>.....swap without temp.....

        // let c=15 
        // let d=30;

        // [c,d]=[d,c]

        // console.log(c);
        // console.log(d);



//{-------PROBLEM 2: FizzBuzz--------}


//>..... Loops, conditionals, modulus operator......

        // for(let i=1;i<=100;i++)
        // {
        //     if (i%3===0 && i%5===0){
        //         console.log("fizzBuzz");
        //     }
        //     else if (i%3===0){
        //         console.log("fizz");
                
        //     }
        //     else if (i%5==0) {
        //         console.log("Buzz");
                
        //     }
        //     else {
        //         console.log(i);
        //     }
        // }


//{--------PROBLEM 3: Find the Largest in an Array---------}

//>.....Arrays, loops, comparison......

        // function findMax(arr) {

        // let max = arr[0];
        // for (let i = 1; i < arr.length; i++) {

        //         if (arr[i] > max) {
        //         max = arr[i]; 
        //         }
        // }

        // return max;
        // }
        // let numbers = [3, 7, 2, 9, 1];

        // let result = findMax(numbers);

        // console.log(result);



//{-------PROBLEM 4: Reverse a String---------}

//.....1. Using built-in methods (split, reverse, join).....

        // function reverseStr(str) {
        // const arr = str.split('') ;
        // arr.reverse();
        // const reversedStr = arr.join('');
        // return reversedStr ;
        // }
        // const originalString = "hello";
        // const reversedString = reverseStr(originalString);
        // console.log(reversedString);


//.....2. Using a for loop.....


        // function reverseString (str) {
        // let reversed = "" ;
        //         for (let i = str.length-1 ; i >= 0 ; i--){
        //         reversed += str[i];
        //         }
        //         return reversed ;

        // }
        // const originalString = "hello" ;
        // const result = reverseString(originalString);
        // console.log(result);




//{-------PROBLEM 5: Count Vowels-------}

//>.....using Strings, conditionals, includes().....


        // function countVowels(str) {

        //         let count = 0;
        //         let vowels ="aeiou";
        //         for( let char of str.toLowerCase()) {
        //                 if (vowels.includes(char)) {
        //                         count++;
        //                 }
        //         }
        //         return count;

        // }
        // console.log(countVowels("hello world"));


//{-------PROBLEM 6: Remove Duplicates from an Array-------}

//>.....with (set).....

        // function removeDuplicates(arr) {
        //         return [...new Set(arr)];

        // }
        // const input=[1,2,3,3,3,4,4,5,5,];
        // console.log(removeDuplicates(input));


//>.....without (set).....

        // function removeDuplicates(arr) {
        // const result = [];
        
        // for (let i = 0; i < arr.length; i++) {
        // if (!result.includes(arr[i])) {
        // result.push(arr[i]);
        // }
        // }
        
        // return result;
        // }

        // const input = [1, 2, 2, 3, 3, 4, 4, 5, 5];
        // console.log(removeDuplicates(input));


//{-------PROBLEM 7: Title Case a Sentence-------}

//..... String manipulation, split, map, join......

        // function titleCase(str) {


        //         let word =str.split (' ');
        //         let capitalizedArray = word.map (function (word) {
        //                 return word[0].toUpperCase() + word.slice(1);
                        
        //         })
        //         let result = capitalizedArray.join(' ');
        //         return result ;
        // }
        // const input ="hello world from javascript";
        // console.log(titleCase(input));


//{--------PROBLEM 8: Sum of Nested Arrays (Flat & Sum)-------}

//>.....

        // function nestedSum(arr) {
        //         let sum = 0;

        //         for(let item of arr) {
        //                 if (Array.isArray(item)) {
        //                 sum += nestedSum(item);
        //                 } else {
        //                 sum += item;
        //                 }
        //         }
        //         return sum;
        // }
        // console.log(nestedSum([1, [2, [3, 4]], 5]))


//{--------PROBLEM 9: Object Frequency Counter--------}

//>.....Objects, loops, bracket notation.....

        // function charFrequency(str) {

        //         const frequency = {}
        //         for (const char of str ) {
        //                 frequency[char] = (frequency[char] || 0) +1;

        //         }
        //         return frequency;

        // }

        // const result = charFrequency("banana");
        // console.log(result);


//{-------PROBLEM 10: Mini Calculator using Callbacks-------}

//>.....Functions as first-class citizens, callbacks, higher-order functions.....

        // function add (a,b) {
        //         return a+b;
        // }
        // function substract (a,b) {
        //         return a-b;
        // }
        // function divide (a,b) {
        //         return a/b;
        // }
        // function multiple (a,b) {
        //         return a*b; 
        // }
        // function calculate (a,b,callback) {
        //         return callback(a,b)
        // }

        // console.log(calculate(12,34,add));
        // console.log(calculate(12,34,multiple))
        // console.log(calculate(12,34,divide))
        // console.log(calculate(12,34,substract))

        