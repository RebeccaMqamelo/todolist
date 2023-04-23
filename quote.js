//jshint esversion:6

exports.newQuote = function () {

    const quotesArray = [{
        quote: "Wisely and slow; they stumble that run fast.",
        author: "Friar Laurence"
    }, {
        quote: "Your rest does not require artefacts.",
        author: "Sean"
    }, {
        quote: "Face what you reject, accept what you refuse to acknowledge, and you will find the treasure that the dragon guards.",
        author: "Jordan Peterson"
    }, {
        quote: "Embracy uncertainty. Some of the most beautiful chapters of our lives won't have a title until much later.",
        author: "Bob Goff"
    }, {
        quote: "I will not waste my life in friction when it could be turned into momentum.",
        author: "Frances Willard"
    }];
     
    var randomNumber = Math.floor(Math.random() * quotesArray.length)
    //document.getElementById("quoteDisplay").innerHTML = quotes[randomNumber]
    return quotesArray[randomNumber];
    
};