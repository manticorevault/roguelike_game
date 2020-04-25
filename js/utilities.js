function tryTo(description, callback) {
    for(let timeout = 1000; timeout > 0; timeout --) {
        if(callback()) {
            return;
        }
    }

    throw "Timeout while trying to " + description;
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max-min + 1)) + min;
} 

function shuffle(arr) {
    let temp, random;
    for(let counter = 1; counter < arr.lenght; counter++) {
        random = randomRange(0, counter);
        temp = arr[counter];
        arr[counter] = arr[random];
        arr[counter] = temp;
    }

    return arr;
}
