
var questionsArray = [];

$("#questions .question").each(function(question) {
    var questionHtml = $(this).children("p").html()
    var answersBtns = $(this).find(".form-inline .action-button")    
    var questionValue = questionHtml;
    var answerValues = [];

    var scriptIndex = questionHtml.indexOf("</script>");
    if (scriptIndex != -1) {
        questionValue = questionHtml.substring(scriptIndex + 9)
    }

    answersBtns.each(function(answerIndex, answerBtn) {
        answerValues.push($(answerBtn).text());
    });

    questionsArray.push({
        "question": questionValue,
        "answers": answerValues
    });

    console.log(JSON.stringify(questionsArray));
})