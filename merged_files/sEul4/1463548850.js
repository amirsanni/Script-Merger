'use strict';

$(document).ready(function(){
    
    //WHEN "SEND MESSAGE" IS CLICKED IN THE CONTACT US PAGE
    $("#contactSubmit").click(function(e){
        e.preventDefault();
        
        var name = $("#contactName").val();
        var email = $("#contactEmail").val();
        var phone = $("#contactPhone").val();
        var msg = $("#contactMsg").val();
        var subject = $("#contactSubject").val();
        
        
        if(!msg || !email || !name){
            !msg ? $("#contactMsg").css("borderColor", "red") : $("#contactMsg").css("borderColor", "");
            !email ? $("#contactEmail").css("borderColor", "red") : $("#contactEmail").css("borderColor", "");
            !name ? $("#contactName").css("borderColor", "red") : $("#contactName").css("borderColor", "");
            
            return;
        }
        
        $("#contactErrMsg").html("<i class='"+spinnerClass+"'></i> Sending....").focus();
        
        $.ajax({
            url: appRoot+"misc/email_us",
            data: {name:name, email:email, phone:phone, msg:msg, subject:subject},
            method: "POST"
        }).done(function(returnedData){
            if(returnedData.status === 1){
                document.getElementById("contactUsForm").reset();
                
                $("#contactErrMsg").css('color', 'green').html("<b>Message Sent. Thank you for contacting us</b>").fadeOut(8000);
            }
            
            else{
                $("#contactErrMsg").css('color', 'red').html("Oops! An unexpected error occurred. Pls try again");
            }
        }).fail(function(){
            //call function to check online status and show necessary error message
        });
    });
    
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   
   //remove the red border on fields when they have a value
    $("#contactName, #contactEmail, #contactMsg").change(function(){
        $(this).val() ? $(this).css("borderColor", "") : $(this).css("borderColor", "red");
    });
});'use strict';

$(document).ready(function () {
    //TO LAUNCH THE FILE UPLOAD DIALOG WHEN THE BUTTON TO UPLOAD LOGO IS CLICKED
    $("#trigDialog").click(function (e) {
        e.preventDefault();
        
        $("#privCompLogoUp").click();//trigger the click event of the file input
    });


    /*
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     */


    //WHEN AN IMAGE IS SELECTED WHILE TRYING TO UPLOAD "LOGO" FOR PRIVATE QUIZ
    $("#privCompLogoUp").change(function (e) {
        e.preventDefault();
        var file = $(this).get(0).files[0];
        
        //call function to handle the file
        displayImgIfAllIsWell(this, file, "#privCompLogoDisp", 200000, '');
        
    });
    
    
    
    /*
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     */
    
    
    //WHEN A FILE IS DRAGGED AND DROP ON THE IMG TAG FOR DISPLAYING LOGO
    /*
    $("#privCompLogoDisp").on('drop', function(e){
        e.stopPropagation();
        e.preventDefault();
        //alert('a');
        
        var file = e.originalEvent.dataTransfer.files[0];
        
        //set value of file input with id privCompLogoUp to var file
        $("#privCompLogoUp").val($(this).val());
        
        console.log($("#privCompLogoUp").get(0).files[0]);
        
        //call function to handle the file
        displayImgIfAllIsWell($("#privCompLogoUp"), file, "#privCompLogoDisp", 200000);
    });*/


    /*
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     */

    //TO TRIGGER THE FILE UPLOAD DIALOG WHILE TRYING TO ATTACH AN IMAGE TO A QUESTION
    $("#privateQuiz").on('click', '.attImgQuePrivClk', function (e) {
        e.preventDefault();
        
        $(this).siblings("input[type=file]").click();//trigger the click event of the file input
    });



    /*
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     */


    //WHEN AN IMAGE IS SELECTED WHILE TRYING TO ATTACH IMAGE TO A QUESTION
    $("#privateQuiz").on('change', '.queImgPriv', function (e) {
        e.preventDefault();
        
        //get the img tag to display the image
        var imgTag = $(this).parents(".panel-heading").siblings('.panel-body').find('.attImgQuePrivDisp');
        
        //get the element of "remove image" text
        var remImgTextElem = $(this).parents(".panel-heading").siblings('.panel-body').find('.remAttImgPriv');

        //get file
        var file = $(this).get(0).files[0];
        
        //call function to handle the file
        displayImgIfAllIsWell(this, file, imgTag, 200000, function(status){
            if(status === 1){
                //make the img tag visible
                $(imgTag).removeClass("hidden");

                //display "remove image" text
                remImgTextElem.removeClass("hidden");
            }
            
            else{
                //remove the file from the input field
                $(this).val("");
            }
        });
    });


    /*
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     */


    //TO REMOVE AN IMAGE FROM A QUESTION WHILE CREATING QUESTIONS
    $("#privateQuiz").on('click', '.remAttImgPriv', function (e) {
        e.preventDefault();
        
        $(this).siblings(".attImgQuePrivDisp").attr('src', "").addClass("hidden");//unset the image src
        $(this).parents('.panel-body').siblings('.panel-heading').find('.queImgPriv').val('');//remove the image from the input

        //hide 'remove image' text
        $(this).addClass('hidden');
    });


    /*
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     */


    //WHEN THE "ADD OPTION" BUTTON IS CLICKED WHILE CREATING QUESTIONS
    $(".addNewOpPriv").click(function (e) {
        e.preventDefault();

        /*
         * clone one of the options. This is better than having the HTML here since it might change
         * Change the option letter (e.g. from "Option C" to "Option D") of the new option to add
         * Then append the option after the last option.
         */
        
        //to change the option letter, get the letter of the last option and 
        //change this to the next letter after that using "returnAlphabet" function in 'main.js' file
        var currNumberOfOptions = $(this).parent().siblings('.optionDivPriv').length;
        

        if(currNumberOfOptions < 10){
            //clone the previous option and uncheck the radio button in case it was checked in the option we cloned
            var newOption = $(this).parent().prev().clone();
        
            //the length of the options is passed to "returnAlphabet"
            var newOptionLetter = returnAlphabet(currNumberOfOptions);

            //now change the new option letter
            newOption.find(".optionValPriv").attr('placeholder', "Option " + newOptionLetter);

            //remove any text that might be in the cloned option
            newOption.find(".optionValPriv").val('');

            //uncheck the radio button in case it was checked
            newOption.find(".optionDivPrivAns").prop("checked", false);

            //now append the new option
            newOption.insertAfter($(this).parent().siblings(".optionDivPriv:last"));
        }
    });

    /*
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     */


    //TO REMOVE AN OPTION WHEN THE "TIMES" BUTTON IS CLICKED ON THAT OPTION WHILE CREATING QUESTIONS
    $("#privateQuiz").on('click', '.remOpPriv', function (e) {
        e.preventDefault();

        //delete only if there are more than two options left
        var optionLength = $(this).parents('.optionDivPriv').siblings().length;//returns the number of options in question

        //get element of all options in question
        var allOptionsForQue = $(this).parents('.form-group-sm');//returns the mother div holding all options in question

        if (optionLength > 2) {

            $(this).parents(".optionDivPriv").remove();

            //re-arrange option letters. Send the parent div holding all options as argument
            rearrangeOptionLetterQuiz(allOptionsForQue, '.optionDivPriv', '.optionValPriv');
        } else {
            //display msg that there must be at least two options
        }
    });

    /*
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     */


    //WHEN "ADD MORE QUESTION" BUTTON IS CLICKED TO ADD MORE QUESTION TO A QUIZ
    $("#addMoreQuePriv").click(function (e) {
        e.preventDefault();

        /*
         * Clone the first question, change the question number of the cloned div including the name of the radio buttons
         * Then insert after the last question
         */
        var newQue = $(".quizQuestionPriv:first").clone(true);

        //get the number of questions we currently have to know the number the new question will be
        var newQueNumb = $(".quizQuestionPriv").length + 1;

        //change the question number and the name of the radio buttons in options
        newQue.find(".quizQueNumPriv").html("Question " + newQueNumb);
        newQue.find("input[type=radio]").attr("name", "op" + newQueNumb + "Priv");

        //remove any value that might be in the question and options
        newQue.find(".mainQuizQuePriv").val('');
        newQue.find(".optionValPriv").val('');
        newQue.find(".optionDivPrivAns").prop("checked", false);//remove the checked radio button by making all radio buttons unchecked
        newQue.find(".queImgPriv").val('');//remove any image that might hav been attached to question
        newQue.find(".attImgQuePrivDisp").attr('src', '').addClass("hidden");//remove any image being displayed
        newQue.find('.remAttImgPriv').addClass("hidden");//hide 'remove image' text unless it's shown;

        //reduce the number of options to two
        while (newQue.find('.optionDivPriv').length > 2) {
            newQue.find('.optionDivPriv:last').remove();
        }

        //now insert the new question to DOM
        newQue.insertAfter(".quizQuestionPriv:last");


        //scroll to the top of the newly added question
        //scroll down to the displayQuestions div
        scrollToDiv($(".quizQuestionPriv").last());
    });



    /*
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     */

    //WHEN THE "TIMES" BUTTON ON A QUESTION IS CLICKED TO REMOVE THE QUESTION
    $(".quizQuestionPriv").on('click', '.removeQuePriv', function (e) {
        e.preventDefault();

        //remove question only if the clicked question is not the last in the DOM
        if ($(this).parents(".quizQuestionPriv").siblings(".quizQuestionPriv").length > 0) {
            $(this).parents(".quizQuestionPriv").remove();

            //rearrangeQuestionNumbQuiz(numbMainElem, numberTextElem)
            rearrangeQuestionNumbQuiz(".quizQuestionPriv", ".quizQueNumPriv");
        }

    });


    /*
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     */

    //WHEN THE "SUBMIT" BUTTON IS CLICKED TO SUBMIT A NEWLY CREATED QUIZ
    $("#submitQuizQuePriv").click(function (e) {
        e.preventDefault();

        //get all questions, their options and the selected answer
        //all questions must have at least two options and all questions must have an answer
        var logo = document.getElementById("privCompLogoUp").files[0];
        var title = $("#qTitlePriv").val();
        var rf = $("#qFieldReqPrib").val();
        var dur = $("#qDurPriv").val();
        var instruction = $("#qInstructionPriv").val();
        var errorCount = 0;

        //TITLE IS REQUIRED
        if (!title) {
            !title ? $("#qTitlePriv").css({borderColor: 'red'}).focus() : $("#qTitlePriv").css({borderColor: ''});

            return;
        }

        //remove red border
        $("#qTitlePriv").css({borderColor: ''});

        var allQuestions = [];

        //get questions
        //if there is a question in a question div, get the options. Else, go to next question div
        //Each question will be an array like: [questions, arrOfOptions, answer]
        $(".quizQuestionPriv").each(function (queIndex) {
            var currQuestion = $(this).find(".mainQuizQuePriv").val();

            if (currQuestion) {
                var currOptions = [];
                var answer = "";
                
                //loop and get the options
                $(this).find('.optionDivPriv').each(function () {
                    //add option to array if it has a value
                    var optionVal = $(this).find(".optionValPriv").val();

                    optionVal ? currOptions.push(optionVal) : "";//add to array of options in current question

                    //if the radio button of the current option is checked, set it as answer
                    $(this).find(".optionDivPrivAns").prop("checked") ? answer = optionVal : "";
                });


                //if the number of options is greater than 2 and an answer is selected, add question info into array of "allQuestions"
                //else, mark the question div as faulty and increment error by one
                if ((currOptions.length >= 2) && answer) {
                    var queInfo = {q: currQuestion, op: currOptions, a: answer, qInd:queIndex};
                    
                    allQuestions.push(queInfo);

                    //remove the danger in div in case it was set
                    $(this).addClass("panel-primary").removeClass("panel-danger");
                } 
                
                else {
                    $(this).removeClass("panel-primary").addClass("panel-danger");
                    errorCount++;
                }
            }
        });
        
        //send to server if there are no errors and there is at least one question
        (errorCount === 0) && (allQuestions.length > 0) 
                ? 
            sendNewPrivQuizToServer(logo, title, rf, dur, instruction, allQuestions)
                : 
            displayFlashMsg("One or more required fields are empty", '', 'red', 1000);
    });

    /*
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     ********************************************************************************************************************************
     */
    //WHEN USER CLICKS "SUBMIT" AFTER FINISHING QUIZ TO SUBMIT ANSWERS
    $("#submitPrivQuizTest").click(function(e){
        e.preventDefault();

        var quizTakerName = $("#yourName").val();

        //ensure quiz taker's name is provided
        if(quizTakerName){
            $("#confirmPrivQuizSubmissionModal").modal('show');

            $("#yourName").css({borderColor:''});
        }

        else{
            $("#yourName").css({borderColor:'red'}).focus();
        }
    });
    
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */

    //WHEN "YES" IS CLICKED TO CONFIRM SUBMISSION
    $("#confirmSubmissionPrivQuiz").click(function(){
        $("#confirmPrivQuizSubmissionModal").modal('hide');

        getPrivQuizQIdsAndAnswers();//proceed

        clearInterval(displayTimer);
    });
});


/*
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 */
/*
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 */
/*
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 */


/**
 * 
 * @param file logo file to upload as quiz logo
 * @param string title title of quiz
 * @param string rf requested field. An additional field user is requesting quiz taker's to provide
 * @param int dur duration of quiz
 * @param string instruction
 * @param array allQuestions
 * @returns {undefined}
 */
function sendNewPrivQuizToServer(logo, title, rf, dur, instruction, allQuestions){
    var formData = new FormData();

    formData.append("l", logo);
    formData.append("t", title);
    formData.append("rf", rf);
    formData.append("d", dur);
    formData.append("i", instruction);
    formData.append("aq", JSON.stringify(allQuestions));
    
    
    //also append all the images attached to questions to the formData using each question (class) index as image key
    $(".quizQuestionPriv").each(function(index){
        //get each questions file input field
        var fileInput = $(this).find(".queImgPriv");
        
        if(fileInput.get(0).files[0]){//if a file was selected, append it to formData obj
            formData.append("img"+index, fileInput.get(0).files[0]);
        }
    });
    
    //show progress message
    $("#privQuizProgMsg").css('color', 'black').html(loaderDiv);
    
    $.ajax({
        url: appRoot+"quiz/crPrivQ",
        method: "POST",
        data: formData,
        processData: false,
        cache: false,
        contentType: false
    }).done(function(returnedData){
        if(returnedData.status === 1){
            //reset form, display success message, append quiz to quiz list and trigger the event to load the just inserted quiz
            $("#privQuizProgMsg").css('color', 'green').html("Quiz successfully created");
            
            //remove the message after a while
            setTimeout(function(){$("#privQuizProgMsg").html("");}, 3000);
            
            document.getElementById("createPrivQuizForm").reset();
            
            //change logo image  back to default
            $("#privCompLogoDisp").attr("src", "public/images/img.png");
            
            //remove all the newly added question div leaving just the first one
            $(".quizQuestionPriv").not($(".quizQuestionPriv").first()).remove();
            
            //remove any image that might have been attached to questions
            $(".attImgQuePrivDisp").attr("src", "").addClass("hidden");//unset the displayed images and hide the tags
            $(".remAttImgPriv").addClass("hidden");//hide the "remove image" text
            
            //prepend quiz to list
            //appendToQuizList(quizTitle, quizId) in 'quiz.js'
            appendToQuizList(title, returnedData.qI);
            
            //trigger the click event on the just appended elem
            //a.click();
        }
        
        
        else if(returnedData.status === -1){//user is not logged in            
            triggerLoginForm("You appear to be logged out. Pls log in or register and resubmit quiz", {color:'red'});
            
            //remove the progress message
            $("#privQuizProgMsg").html("");
        }
        
        else{
            //change progress message
            $("#privQuizProgMsg").css('color', 'red').html("Quiz could not be created. Please crosscheck and try again");
            
            //display all returned error messages
            returnedData.l_e_m ? "" : "";
            
            //display error message in each question with errors
            $(".quizQuestionPriv").each(function(i){
                i in returnedData ? $(this).find(".qErr").html(returnedData.i) : "";
            });
        }
    }).fail(function(){
        checkBrowserOnline();
    });
}

/*
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 */


function getPrivQuizQIdsAndAnswers(){
    clearInterval(displayTimer);//clear interval
    
    var jsonObjToSend = {};
    
    var quizTakerName = $("#yourName").val();
    var quizTakerEmail = $("#yourEmail").val();
    
    if(!quizTakerName){
        $("#yourName").css({borderColor:'red'}).focus();
        return;
    }
    
    //remove red border and focus if all is well
    $("#yourName").css({borderColor:''});
    
    //get each question ID and the value of the selected option
    //Each Question's main div has class "eachPubQuizQue"
    $(".eachPubQuizQue").each(function(){
        var questionId = $(this).find('.pubQuizQueId').attr('id').split("-")[1];//get question ID
        var optionsElem = $(this).find('.checkMePubQuiz');
        var selectedOption = "";

        //Loop through the options and get the value of the selected (checked) option
        optionsElem.each(function(){
            if($(this).prop('checked')){
                selectedOption = $(this).val();
            }
        });

        //add the option to array using the question ID as array key
        jsonObjToSend[questionId] = selectedOption;
    });
    
    submitPrivQuizAnswersToServer(jsonObjToSend, quizTakerName, quizTakerEmail);
}





function submitPrivQuizAnswersToServer(jsonObjToSend, quizTakerName, quizTakerEmail){
    displayFlashMsg("Please wait while your result is being generated", spinnerClass, "", "", false);
    
    var quizGroup = $("#qGrp").val();
    
    $.ajax(appRoot+"quiz/spub", {
        data: {qAndAnswers:jsonObjToSend, qGrp:quizGroup, n:quizTakerName, e:quizTakerEmail, t:timeSpentOnPubQuizInSec},
        method: "POST"
    }).done(function(returnedData){
        hideFlashMsg();//hide flash msg
        scrollPageToTop();
        $("#submitPubQuizTest").remove();//remove the submit button
        
        //display the score
        $("#myPubQuizTestScore").html(returnedData.score);
        $("#dispPubQuizTestScore").removeClass('hidden');
        
        for(var i=0; i < returnedData.result.length; i++){
            var qId = returnedData.result[i].qId;
            var UA = returnedData.result[i].UA;
            var CA = returnedData.result[i].CA;
            
            //change the font color of the correct answer to green
            //append a green mark in front of the option text if user chose the right answer
            //else, append a red times icon
            
            $(".pubOpText-"+qId).each(function(){
                //change the font color of the correct answer to green
                $(this).text() === CA ? $(this).css({color:'green', fontSize:'16px'}) : "";
                
                //if current element's text is the user's answer, check if it's the correct answer and take necessary actions
                $(this).text() === UA ? ($(this).text() === CA ? $(this).append(" <i class='fa fa-check text-success'></i>") : $(this).css('color', 'red').append(" <i class='fa fa-times text-danger'></i>")) : "";
            });
        }
    }).fail(function(){
        console.log("Submission failed");
    });
}


/*
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 */




/*
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 */




/*
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 */




/*
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 */



/*
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 ********************************************************************************************************************************
 */
/**
 * @author: Amir Sanni <amirsanni@gmail.com>
 * @date: 24th March, 2016
 */

'use strict';

$(document).ready(function(){
    //WHEN THE "ADD OPTION" BUTTON IS CLICKED WHILE CREATING QUESTIONS
    $(".addNewOpPub").click(function(e){
        e.preventDefault();
        
        var optionLength = $(this).parent().siblings('.optionDivPub').length;
        
        /*
         * clone one of the options. This is better than having the HTML here since it might change
         * Change the option letter (e.g. from "Option C" to "Option D") of the new option to add
         * Then append the option after the last option. 
         * Do these only if the options is not up to the max allowed for public quizzes.
         */
        
        if(optionLength < 4){
            //clone the previous option and uncheck the radio button in case it was checked in the option we cloned
            var newOption = $(this).parent().prev().clone();

            //to change the option letter, get the letter of the last option and 
            //change this to the next letter after that using "returnAlphabet" function
            //the length of the options is passed to "returnAlphabet" since the index of the array starts at 0
            var newOptionLetter = returnAlphabet(optionLength);

            //now change the new option letter
            newOption.find(".optionValPub").attr('placeholder', "Option "+newOptionLetter);
            
            //remove any text that might be in the cloned option
            newOption.find(".optionValPub").val('');
            
            //uncheck the radio button in case it was checked
            newOption.find(".optionDivPubAns").prop("checked", false);

            //now append the new option
            newOption.insertAfter($(this).parent().siblings(".optionDivPub:last"));
        }
        
        else{
            //display message that options cannot be more than six
        }
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */    
    
    
    //TO REMOVE AN OPTION WHEN THE "TIMES" BUTTON IS CLICKED ON THAT OPTION WHILE CREATING QUESTIONS
    $("#publicQuiz").on('click', '.remOpPub', function(e){
        e.preventDefault();
        
        //delete only if there are more than two options left
        var optionLength = $(this).parents('.optionDivPub').siblings().length;//returns the number of options in question
        
        //get element of all options in question
        var allOptionsForQue = $(this).parents('.queOptions');//returns the mother div holding all options in a question
        
        if(optionLength > 2){
            
            $(this).parents(".optionDivPub").remove();

            //re-arrange option letters. Send the parent div holding all options as argument
            rearrangeOptionLetterQuiz(allOptionsForQue, '.optionDivPub', '.optionValPub');
        }
        
        else{
            //display msg that there must be at least two options
        }
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //WHEN "ADD MORE QUESTION" BUTTON IS CLICKED TO ADD MORE QUESTION TO A QUIZ
    $("#addMoreQuePub").click(function(e){
        e.preventDefault();
        
        /*
         * Clone the first question, change the question number of the cloned div including the name of the radio buttons
         * Then insert after the last question
         */
        var newQue = $(".quizQuestionPub:first").clone(true);
        
        var currTotQuePub = $(".quizQuestionPub").length;
        
        if(currTotQuePub < 10){
        
            //get the number of questions we currently have to know the number the new question will be
            var newQueNumb = currTotQuePub + 1;

            //change the question number and the name of the radio buttons in options
            newQue.find(".quizQueNumPub").html("Question "+newQueNumb);
            newQue.find("input[type=radio]").attr("name", "op"+newQueNumb+"Pub");

            //remove any value that might be in the question and options
            newQue.find(".mainQuizQuePub").val('');
            newQue.find(".optionValPub").val('');
            newQue.find(".optionDivPubAns").prop("checked", false);//remove the checked radio button by making all radio buttons unchecked

            //reduce the number of options to two
            while(newQue.find('.optionDivPub').length > 2){
                newQue.find('.optionDivPub:last').remove();
            }

            //now insert the new question to DOM
            newQue.insertAfter(".quizQuestionPub:last");
            
            
            //scroll to the top of the newly added question
            //scroll down to the displayQuestions div
            scrollToDiv(".quizQuestionPub:last");
        }
        
        else{
            //show message that users are limited to 10 questions per public quiz
        }
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   
    //WHEN THE "TIMES" BUTTON ON A QUESTION IS CLICKED TO REMOVE THE QUESTION
    $(".quizQuestionPub").on('click', '.removeQuePub', function(e){
        e.preventDefault();
        
        //remove question only if the clicked question is not the last in the DOM
        if($(this).parents(".quizQuestionPub").siblings(".quizQuestionPub").length > 0){
            $(this).parents(".quizQuestionPub").remove();
            
            //rearrangeQuestionNumbQuiz(numbMainElem, numberTextElem)
            rearrangeQuestionNumbQuiz(".quizQuestionPub", ".quizQueNumPub");
            
            //scrollToDiv(".quizQuestionPub:last");
        }
       
    });
   
   /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   
   
    //WHEN THE "SUBMIT" BUTTON IS CLICKED TO SUBMIT A NEWLY CREATED QUIZ
    $("#submitQuizQuePub").click(function(e){
        e.preventDefault();
        
        //get all questions, their options and the selected answer
        //all questions must have at least two options and all questions must have an answer
       var title = $("#qTitlePub").val();
       var instruction = $("#qInstructionPub").val();
       var errorCount = 0;
       
       if(!title){
           !title ? $("#qTitlePub").css({'borderColor':'red'}).focus() : $("#qTitlePub").css({'borderColor':''});
           
           return;
       }
       
       //remove red border
       $("#qTitlePub").css({'borderColor':''});
       
       var allQuestions = [];
       
       //get questions
       //if there is a question in a question div, get the options. Else, go to next question div
        //Each question will be an array like: [questions, arrOfOptions, answer]
        $(".quizQuestionPub").each(function(){
            var currQuestion = $(this).find(".mainQuizQuePub").val();

            if(currQuestion){
                var currOptions = [];
                var answer = "";

                //loop and get the options
                $(this).find('.optionDivPub').each(function(){
                    //add option to array if it has a value
                    var optionVal = $(this).find(".optionValPub").val();

                    optionVal ? currOptions.push(optionVal) : "";//add to array of options in current question

                    //if the radio button of the current option is checked, set it as answer
                    $(this).find(".optionDivPubAns").prop("checked") ? answer = optionVal : "";
                });
                
                
                //if the number of options is between 2 and 4 and an answer is selected, add question info into array of "allQuestions"
                //else, mark the question div as faulty and increment error by one
                if((currOptions.length >= 2) && (currOptions.length <=4) && answer){
                    var queInfo = {question:currQuestion, options:currOptions, answer:answer};

                    allQuestions.push(queInfo);

                    //remove the danger in div in case it is set
                    $(this).addClass("panel-primary").removeClass("panel-danger");
                }

                else{
                    $(this).removeClass("panel-primary").addClass("panel-danger");
                    errorCount++;
                }
            }
       });
       
       //send to server if there are no errors and there is at least one question
       (errorCount === 0) && (allQuestions.length > 0) ? sendNewPubQuizToServer(title, instruction, allQuestions) 
            : displayFlashMsg("One or more required fields are empty", '', 'red', 1000);
    });
   
   
   /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   
    //WHEN USER CLICKS "SUBMIT" AFTER FINISHING QUIZ TO SUBMIT ANSWERS
    $("#submitPubQuizTest").click(function(e){
        e.preventDefault();
        
        var quizTakerName = $("#yourName").val();
        
        //ensure quiz taker's name is provided
        if(quizTakerName){
            $("#confirmPubQuizSubmissionModal").modal('show');
            
            $("#yourName").css({borderColor:''});
        }
        
        else{
            $("#yourName").css({borderColor:'red'}).focus();
        }
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   
    //WHEN "YES" IS CLICKED TO CONFIRM SUBMISSION
    $("#confirmSubmissionPubQuiz").click(function(){
        $("#confirmPubQuizSubmissionModal").modal('hide');
        
        getPubQuizQIdsAndAnswers();//proceed

        clearInterval(timeTrackerPubQuiz);
    });
   
   /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
});





/**
 * Get info about questions and user's answers to each question
 * @returns {undefined}
 */
function getPubQuizQIdsAndAnswers(){
    var jsonObjToSend = {};
    
    var quizTakerName = $("#yourName").val();
    var quizTakerEmail = $("#yourEmail").val();
    
    if(!quizTakerName){
        $("#yourName").css({borderColor:'red'}).focus();
        return;
    }
    
    //remove red border and focus if all is well
    $("#yourName").css({borderColor:''});
    
    //get each question ID and the value of the selected option
    //Each Question's main div has class "eachPubQuizQue"
    $(".eachPubQuizQue").each(function(){
        var questionId = $(this).find('.pubQuizQueId').attr('id').split("-")[1];//get question ID
        var optionsElem = $(this).find('.checkMePubQuiz');
        var selectedOption = "";

        //Loop through the options and get the value of the selected (checked) option
        optionsElem.each(function(){
            if($(this).prop('checked')){
                selectedOption = $(this).val();
            }
        });

        //add the option to array using the question ID as array key
        jsonObjToSend[questionId] = selectedOption;
    });
    
    submitPubQuizAnswersToServer(jsonObjToSend, quizTakerName, quizTakerEmail);
}


/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

/**
 * 
 * @param {type} jsonObjToSend
 * @returns {undefined}
 */
function submitPubQuizAnswersToServer(jsonObjToSend, quizTakerName, quizTakerEmail){
    displayFlashMsg("Please wait while your result is being generated", spinnerClass, "", "", false);
    
    var quizGroup = $("#qGrp").val();
    
    $.ajax(appRoot+"quiz/spub", {
        data: {qAndAnswers:jsonObjToSend, qGrp:quizGroup, n:quizTakerName, e:quizTakerEmail, t:timeSpentOnPubQuizInSec},
        method: "POST"
    }).done(function(returnedData){
        hideFlashMsg();//hide flash msg
        scrollPageToTop();
        $("#submitPubQuizTest").remove();//remove the submit button
        
        //display the score
        $("#myPubQuizTestScore").html(returnedData.score);
        $("#dispPubQuizTestScore").removeClass('hidden');
        
        for(var i=0; i < returnedData.result.length; i++){
            var qId = returnedData.result[i].qId;
            var UA = returnedData.result[i].UA;
            var CA = returnedData.result[i].CA;
            
            //change the font color of the correct answer to green
            //append a green mark in front of the option text if user chose the right answer
            //else, append a red times icon
            
            $(".pubOpText-"+qId).each(function(){
                //change the font color of the correct answer to green
                $(this).text() === CA ? $(this).css({color:'green', fontSize:'16px'}) : "";
                
                //if current element's text is the user's answer, check if it's the correct answer and take necessary actions
                $(this).text() === UA ? ($(this).text() === CA ? $(this).append(" <i class='fa fa-check text-success'></i>") : $(this).css('color', 'red').append(" <i class='fa fa-times text-danger'></i>")) : "";
            });
        }
    }).fail(function(){
        console.log("Submission failed");
    });
}


/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/



/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

function sendNewPubQuizToServer(title, instruction, allQuestions){
    scrollPageToTop();
    
    $("#quizStatusMsg").html(loaderDiv + "Creating Quiz...");
    
    $.post(appRoot+"quiz/crpubq", {title:title, instruction:instruction, questions:allQuestions})
        .done(function(returnedData){
            if(returnedData.status === 1){//success
                //display success message, 
                //load the just created quiz with input fields to share to email and on FB
                //changeFlashMsgContent(returnedData.msg, '', 'black', 1000, false);
                $("#quizStatusMsg").css({color:'green'}).html(returnedData.msg).fadeOut(5000);
                
                clearPubQuizForm();
                
                appendToQuizList(title, returnedData.i);
            }

            else if(returnedData.status === -1){//user is not logged in
                triggerLoginForm("You appear to be logged out. Pls log in or register to continue", {color:'red'});
                
                $("#quizStatusMsg").html("");//remove the 'progress' msg
            }

            else{//other error (probably with questions not meeting criteria or db error)
                //changeFlashMsgContent(returnedData.msg, '', 'red', 1000, false);
                $("#quizStatusMsg").css({color:'red'}).html(returnedData.msg);
            }
        })
        .fail(function(){
            checkBrowserOnline(false);
        });
}

/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

function clearPubQuizForm(){
    $(".quizQuestionPub").not($(".quizQuestionPub").first()).remove();
    
    //reset the form
    document.getElementById("pubQuizForm").reset();
}

/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/




/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/




/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/




/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/'use strict';

$(document).ready(function () {
    //check login status on page load
    //checkLogin("", "Log in required. Please log in to continue");
    
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */

    //call function to attach event handler which will make us check user's log in status each time user leave tab and come back
    //checkDocumentVisibility(checkLogin);
    
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   

    //TO REFRESH THE LIST OF QUIZZES
    $("#quizListDiv").on('click', '#refreshQuizList', function () {
        //show loading...
        $("#quizListDiv").html(loaderDiv + " Refreshing List");

        $("#quizListDiv").load(appRoot + "quiz/ql #quizListDivUL");
    });


    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */

    //WHEN A QUIZ TITLE IS CLICKED (ON THE QUIZ LIST) IN ORDER TO SEE THE QUESTIONS UNDER THE QUIZ
    $("#quizListDiv").on('click', '.myQuizList', function (e) {
        e.preventDefault();
        
        var clickedElem = $(this);
        
        var qId = clickedElem.attr('href');

        if (qId) {
            $("#createQuizDiv").addClass("hidden");
            $("#viewQuizQueDiv").removeClass("hidden");

            //show 'loading'
            $("#viewQuizQueDiv").html(loaderDiv + "Fetching Questions...");


            $("#viewQuizQueDiv").load(appRoot + "quiz/getquiz", {qId: qId}, function () {
                //remove the active class from all lis
                $(".myQuizList").parents('li').removeClass("active");

                //add the active class to the li of the quiz we just displayed
                clickedElem.parents('li').addClass("active");
                
                scrollPageToTop();
            });
        }
    });

    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */

    //WHEN "CREATE NEW QUIZ" IS CLICKED
    $("#viewQuizQueDiv").on('click', '#createNewQuiz', function () {
        $("#createQuizDiv").removeClass("hidden");
        $("#viewQuizQueDiv").addClass("hidden");
    });


    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //WHEN "CHANGE" IS CLICKED IN ORDER T CHANGE A QUIZ's LOGO
    $("#pageContent").on('click', '#chQuizLogo', function(e){
        e.preventDefault();

        $("#newLogo").click();
    });
   
   
   /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //TO CHANGE THE LOGO ATTACHED TO A QUIZ(WHILE VIEWING CREATED QUIZ QUESTIONS)
    $("#pageContent").on('change', '#newLogo', function(e){
        e.preventDefault();
        
        var fileToUpload = $(this).get(0).files[0];
        var qGrp = $("#currVQI").val();//get quiz group
        var currentLogo = $("#curVQLogo").attr('src');
        var fileInputElem = $(this);
        
        //if a file was selected
        if(fileToUpload){
            //show a preview of the file and then send the file to server for upload
            displayImgIfAllIsWell(this, fileToUpload, "#curVQLogo", 200000, function(status){
                //call function to send file to server if function returned 1
                if(status === 1){
                    uploadNewQuizLogo(fileToUpload, qGrp, currentLogo, fileInputElem, "#curVQLogo");
                }
            });
        }
    });
   
   
   
   /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */

    //TO REMOVE THE LOGO ATTACHED TO A QUIZ (WHIE VIEWING CREATED QUIZ QUESTIONS)
    $("#pageContent").on('click', '#remQuizLogo', function(e){
        e.preventDefault();
        
        //get the id of the quiz, send to server to detach the img from quiz and also delete it from disk
        //if successful, display success msg and change src of logo to default (img.png), else display error msg
        
        var qGrp = $("#currVQI").val();
        
        if(qGrp){
            displayFlashMsg("Detaching Image From Quiz", spinnerClass, 'black', '', false);
            
            $.ajax({
                url: appRoot+"quiz/cqi",
                method: "POST",
                data: {qGrp:qGrp, a:'d'}
            }).done(function(returnedData){
                if(returnedData.status === 1){
                    changeFlashMsgContent("Image detached from quiz", '', 'green', 1000, false);
                    $("#curVQLogo").attr('src', appRoot+"public/images/img.png");
                    
                    $("#remQuizLogo").addClass("hidden");//hide the button to remove the image
                }
                
                else{
                    changeFlashMsgContent("Unable to process your request at this time", '', 'red', '', false);
                }
            }).fail(function(){
                checkBrowserOnline();
            });
        }
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   
   //TO REMOVE AN IMAGE FROM A QUESTION
   $("#pageContent").on('click', '.removeImage', function(e){
       e.preventDefault();
       
       var queId = $(this).attr('id').split("-")[1];
       var removeImgElem = $(this);
       var divShowingImg = $(this).parents(".showAttImg");
       var imgElem = $(this).siblings('.attImgQuePrivDisp');
       
       //make server req to detach image from question and also delete the image from disk
       if(queId){
           $(removeImgElem).html("<i class='"+spinnerClass+"'></i> Removing Image...");
           
           $.ajax({
               url: appRoot+"quiz/dqqi",
               method: "POST",
               data: {q:queId}
           }).done(function(returnedData){
                if(returnedData.status === 1){
                    //show success msg, hide the div where the image is shown and make the img src empty
                    $(divShowingImg).addClass("hidden");
                    $(imgElem).attr("src", "");

                    //change the text back to "remove image"
                    $(removeImgElem).html("Remove Image");
                }
               
                else{
                     //dispay error msg
                     $(removeImgElem).html("<i class='fa fa-exclamation text-danger'></i> Request Failed");

                     //change the text back to "remove image"
                     setTimeout(function(){$(removeImgElem).html("Remove Image");}, 2000);
                }
               
           }).fail(function(){
                checkBrowserOnline();
               
                //change the text back to "remove image"
                setTimeout(function(){$(removeImgElem).html("Remove Image");}, 2000);
           });
       }
   });
   
   
   /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   
   
   
   
   /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */

});


/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/


function appendToQuizList(quizTitle, quizId){    
    $("<li><a class='myQuizList pointer' href='"+quizId+"'>"+quizTitle+"</a></li>")
            .insertBefore($("#quizListDivUL").children("li").first());
}


/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/


function uploadNewQuizLogo(fileToUpload, qGrp, currentLogo, fileInputElem, displayLogoElem){
    if(qGrp){
        var formInfo = new FormData();

        formInfo.append('nl', fileToUpload);
        formInfo.append('qGrp', qGrp);
        formInfo.append('a', 'c');

        displayFlashMsg('Upoading image', spinnerClass, 'black', '', false);

        $.ajax({
            url: appRoot+"quiz/cqi",
            method: "POST",
            data: formInfo,
            processData: false,
            cache: false,
            contentType: false
        }).done(function(returnedData){
            if(returnedData.status === 1){
                //dispay success message, 'unset' the file from the file input field
                changeFlashMsgContent('Image changed', '', 'green', 1000);
                
                $("#remQuizLogo").removeClass("hidden");//show the button to remove the image in case it was hidden
            }

            else{
                //display error msg, remove the selected file and change logo displayed back to the previous one
                changeFlashMsgContent(returnedData.l_e_m, '', 'red', '');
                
                $(fileInputElem).val("");//remove selected file from input field
                
                $(displayLogoElem).attr('src', currentLogo);//revert to the logo we want to change
            }
        }).fail(function(){
            $(fileInputElem).val("");//remove selected file from input field
                
            $(displayLogoElem).attr('src', currentLogo);//revert to the logo we want to change
            
            checkBrowserOnline(true);
        });
    }
}

/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/



/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/



/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/