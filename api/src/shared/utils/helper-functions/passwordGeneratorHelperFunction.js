function getRandomLower() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
	return +String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
	const symbols = '!@#$%^&*(){}[]=<>/,.'
	return symbols[Math.floor(Math.random() * symbols.length)];
}

const randomFunc = {
	lower: getRandomLower,
	upper: getRandomUpper,
	number: getRandomNumber,
	symbol: getRandomSymbol
}

function generatePassword(length) {
	let generatedPassword = '';
    const typesArr = [
        {lower: true},
        {upper: true},
        {number: true},
        {symbol: true}
    ]
	for(let i=0; i<length; i+=4) {
		typesArr.forEach(type => {
			const funcName = Object.keys(type)[0];
			generatedPassword += randomFunc[funcName]();
		});
	}	
	const finalPassword = generatedPassword.slice(0, length);
	
	return finalPassword;
}


module.exports = {
    generatePassword,
}