const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const lengthDisplay = document.querySelector("[data-lengthNum]"); 
const inputSlider = document.querySelector("[data-lengthSlider]"); // custom attributes
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const specialCheck = document.querySelector("#special");
const numbersCheck = document.querySelector("#numbers");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type = checkbox]");
const symbols = '@#$&_-:?';


let password = "";
let passwordLength = 10;
let checkCount = 0;
setIndicator("#ccc");

handelSlider();

//set password length
function handelSlider(){
    //password length show keta h slider shift krne pe
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%"

}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    // indicator.style.boxShadow = "0 0 10px  1px" + color;
    indicator.style.boxShadow = `0px 0px 10px 1px ${color}`;
}

function getRandomInteger(min, max){
    return Math.floor(Math.random()*(max-min)) + min;
}

function generateNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol() {
    const randomNum =  getRandomInteger(0, symbols.length);
    return symbols.charAt(randomNum);
}

function calcStrength(){
    //calculate strength on basis of password red, yellow green
    let hasUpper = false;
    let hasLower = false;
    let hasSpecial = false;
    let hasNum = false;

    if(uppercaseCheck.checked) hasUpper= true;
    if(lowercaseCheck.checked) hasLower= true;
    if(specialCheck.checked) hasSpecial= true;
    if(numbersCheck.checked) hasNum= true;

    if(hasUpper && hasLower && (hasSpecial || hasNum) && passwordLength >= 8){
        setIndicator("#00ff00");
    }
    else if((hasUpper || hasLower) && (hasNum || hasSpecial) && passwordLength >=6){
        setIndicator("#ffbb00");
    }
    else{
        setIndicator("#ff0000");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    //to make copy msg visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 1800);
}

function handleCheckBoxChange(){
    //checkbox kitna checked hai
    checkCount = 0;
    allCheckBox.forEach( (checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })
    
    if(passwordLength < checkCount){
        //agar password length no. of checkboxes checked se choti h toh passwoed length ko barabar krdo checkbox checked count se 
        passwordLength = checkCount;
        handelSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    //checkboxs ke upar itrate krne ke liya
    checkbox.addEventListener('change', handleCheckBoxChange);
})


inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handelSlider();
})

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

function shufflePassword(array){
    //Fisher Yates Method
    for(let i=array.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


generateBtn.addEventListener('click', ()=>{
    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handelSlider();
    }

    //genrate new password
    console.log("Starting Generation");
    //remove old password
    password = "";

    // //kon kon se checkboxex checked hai
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateNumber();
    // }
    // if(specialCheckCheck.checked){
    //     password += generateSymbol();
    // }

    let funArr =[];
    
    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funArr.push(generateNumber);
    }
    if(specialCheck.checked){
        funArr.push(generateSymbol);
    }
    //now compulsary addition
    for(let i=0; i<funArr.length; i++){
        password += funArr[i]();  // () is for function call e.g. funArr[1]() ==> lets generateNumber is at 1 index ==> generateNumber(); -->function call
    }
    console.log("Compulsary addition Done");
     
    //bachi hua passord character
    for(let i = 0; i < passwordLength-funArr.length; i++){
        let randomIndex = getRandomInteger(0, funArr.length);
        console.log("RandomIndex" + randomIndex);

        password += funArr[randomIndex]();
    }
    console.log("Remaining length addition Done");

    //shuffel password

    password = shufflePassword(Array.from(password));
    console.log("Shuffle Done");
    console.log(password);

    //Display in UI
    passwordDisplay.value = password;
    console.log("UI addition Done");

    //calculate strength of password
    calcStrength();

})
