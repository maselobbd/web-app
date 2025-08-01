const extractNameFromEmail=(email) => {
    const regex = /^([a-zA-Z]+)[._+]?.*?@.*$/; //take everything before an @ sign or a dot
    const match = email.match(regex);
    if (match) {
        const firstName = match[1]; //We just want the first name of the person. 
        return capitalizeFirstLetter(firstName);
    } else {
        return '';
    }
}

const capitalizeFirstLetter=(word)=>
{
    return word.charAt(0).toUpperCase() + word.slice(1);
}

module.exports = {extractNameFromEmail}