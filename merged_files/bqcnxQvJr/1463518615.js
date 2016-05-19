'use strict';

var gObj;

$(document).ready(function(){
    
});



function gInit(){
    gapi.load('auth2', function() {
        //initialise google api
        gObj = gapi.auth2.init({
            client_id : "238698474465-6kkfuk52j139p7vjrnbl177979v918o9.apps.googleusercontent.com",
            fetch_basic_profile : true
        });
        
        //gObj.signIn().then(gSuccess);
        gapi.signin2.render("gSignInBtn", {
            'scope' : 'email',
            'longtitle' : false,
            'theme' : 'dark',
            'height' : 30,
            'onsuccess' : gSuccess,
            'onfailure' : gFailure
        });
    });
    
    
}

/**
 * Get user's basic info if sign in was successful
 * @returns {undefined}
 */
function gSuccess(){
    var isSignedIn = gObj.isSignedIn.get();
    
    if(isSignedIn){
        $("#logInFMsg").css({'color':'green', 'fontSize':'11px'}).html("Authorisation successful. Pls chill...");
        
        var gUser = gObj.currentUser.get();//create an instance for the current user
        
        var userDetails = gUser.getBasicProfile();//get user's basic profile
  
        var email = userDetails.getEmail();
        var firstName = userDetails.getGivenName();
        var lastName = userDetails.getFamilyName();


        console.log("Google " +email + " " + firstName + " "+ lastName);

        //call function to handle social media log in
        //handleSocialLogIn(email, firstName, lastName, socialLoginType, callback) in "main.js"
        handleSocialLogIn(email, firstName, lastName, "Google", "");
    }
    
    else{
        console.log("User is not signed in");
    }
}



function gFailure(){
    console.log("failed");
    
    //display error message and stop execution
    $("#logInFMsg").css({'color':'red', 'fontSize':'11px'}).html("Authorisation failed");

    $("#signLogModal").modal('show');//launch login modal
    return;
}'use strict';

/*
 * set the appRoot
 * The below line will work for both http, https with or without www
 * @type String
 */
var appRoot = setAppRoot("practa", "");

var spinnerClass = 'fa fa-spinner faa-spin animated';
var loaderDiv = "<div class='loader'></div>";
var g = {timeSpentOnTestInSec:0};//total time spent in answering questions (in secs)
var displayTimer;//used to set interval for the time countdown
var publishedQueInfo;//obj is in the form {"NECO":{"Agricultural science":["2012","2013"],"Yoruba":["2012"]},"TOEFL":{"English":["2010","2012"]},"WAEC":{"Agricultural science":["2013"]}}

$(document).ready(function(){
    //scroll to the top in case the page has been scrolled down
    scrollPageToTop();
    
    //prevent browser default for dragenter event
    $("body").on('dragenter', function(e){
        e.stopPropagation();
        e.preventDefault();
    });
    
    
    //prevent browser default for dragover event
    $("body").on('dragover', function(e){
        e.stopPropagation();
        e.preventDefault();
    });
    
    
    //To validate form fields
    $('form').on('change', '.checkField', function(){
        //change the field border to red if field has no value
        $(this).val() ? $(this).css({'borderColor':''})  : $(this).css({'borderColor':'red'});
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //validate form to select an exam on the home page
    //Triggers when any of the select dropdowns are changed
    $("body").on('change', '#eYearHome, #eBodyHome, #eSubjectHome', function(){
        var id = $(this).prop('id');

        //if field has value, remove any error message that might be displayed
        if($(this).val()){
            //remove error message
            $("#"+id+"Err").html('');
        }

        //display error message
        else{
            id === "eYearHome" ? $("#"+id+"Err").html('Select year') : (id === "eBodyHome" ? $("#"+id+"Err").html('Select exam body') : $("#"+id+"Err").html('Select Subject'));
        }
    });
    
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   
   /**
     * When signup or log in buttons on the modal are clicked
     */
    $("#signUpClk, #loginClk").click(function(e){
        e.preventDefault();
        
        $("#signUpDiv, #logInDiv").toggleClass('hidden');
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //When "Login/signup" on the menu bar is clicked
    $("#logInMenuClk").click(function(e){
        e.preventDefault();
        
        $("#logInDiv").removeClass('hidden');//show the log in form on the modal
        $("#signUpDiv").addClass('hidden');//hide the sign up form
        
        $("#signLogModal").modal('show');//show the modal
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //When "Sign up" on the footer menu is clicked
    $(".signUpFooterClk").click(function(e){
        e.preventDefault();
        
        $("#logInDiv").addClass('hidden');//hide the log in form on the modal
        $("#signUpDiv").removeClass('hidden');//show the sign up form
        
        $("#signLogModal").modal('show');//show the modal
    });
    
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    
    //Check to ensure the email and retype email fields on the sign up form are equal
    $("#emailDup").on('keyup change focusout focus focusin', function(){
        var orig = $("#emailOrig").val();
        var dup = $("#emailDup").val();
        
        if(dup !== orig){
            //show error
            $("#emailDupErr").addClass('fa');
            $("#emailDupErr").addClass('fa-times');
            $("#emailDupErr").removeClass('fa-check');
            $("#emailDupErr").css('color', 'red');
            $("#emailDupErr").html("");
        }
        
        else{
            //show success
            $("#emailDupErr").addClass('fa');
            $("#emailDupErr").addClass('fa-check');
            $("#emailDupErr").removeClass('fa-times');
            $("#emailDupErr").css('color', 'green');
            $("#emailDupErr").html("");
        }
    });
    
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Check to ensure the password and retype password fields on the sign up form are equal
    $("#pwordDup").on('keyup change focusout focus focusin', function(){
        var orig = $("#pwordOrig").val();
        var dup = $("#pwordDup").val();
        
        if(dup !== orig){
            //show error
            $("#pwordDupErr").addClass('fa');
            $("#pwordDupErr").addClass('fa-times');
            $("#pwordDupErr").removeClass('fa-check');
            $("#pwordDupErr").css('color', 'red');
            $("#pwordDupErr").html("");
        }
        
        else{
            //show success
            $("#pwordDupErr").addClass('fa');
            $("#pwordDupErr").addClass('fa-check');
            $("#pwordDupErr").removeClass('fa-times');
            $("#pwordDupErr").css('color', 'green');
            $("#pwordDupErr").html("");
        }
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    
    //When user tries to register using the regular sign up method
    $("#signupSubmit").click(function(e){
        e.preventDefault();
        
        //clear all error messages in case there are some
        changeInnerHTML(['emailOrigErr', 'signupFMsg', 'pwordOrigErr', 'firstNameErr', 'lastNameErr'], "");
        
        var firstName = $("#firstName").val();
        var lastName = $("#lastName").val();
        var email = $("#emailOrig").val();
        var emailConf = $("#emailDup").val();
        var password = $("#pwordOrig").val();
        var passwordConf = $("#pwordDup").val();
        
        if(!email || !emailConf || !password || !passwordConf || !firstName || !lastName){
            //display error messages
            $("#signupFMsg").css({'color':'red', 'fontSize':'11px'}).html("One or more required fields are empty");
            return;
        }
        
        if((email !== emailConf) || (password !== passwordConf)){
            //display error messages
            (email !== emailConf) ? $("#emailOrigErr").html("Emails don't match") : "";
            (password !== passwordConf) ? $("#pwordOrigErr").html("Passwords don't match") : "";
            
            return;
        }
        
        //display "please wait..."
        $("#signupFMsg").css({'color':'green', 'fontSize':'11px'}).html("Please wait while we set up your account");
        
        //make server req
        $.ajax(appRoot+'access/signup', {
            method: "POST",
            data: {email:email, email_retype:emailConf, password:password, password_retype:passwordConf, first_name:firstName,
                last_name:lastName}
        }).done(function(returnedData){
            if(returnedData.status === 1){
                //window.location.reload(true);
                
                changePageToLoggedInView();
            }
            
            else{
                //display error messages
                $("#signupFMsg").css({'color':'red', 'fontSize':'11px'}).html("One or more required fields are empty or not properly filled");
                returnedData.first_name ? $("#firstNameErr").css('color', 'red').html(returnedData.first_name) : "";
                returnedData.last_name ? $("#lastNameErr").css('color', 'red').html(returnedData.last_name) : "";
                returnedData.email ? $("#emailOrigErr").css('color', 'red').html(returnedData.email) : $("#emailOrigErr").css('color', 'red').html(returnedData.email_retype);
                returnedData.password ? $("#pwordOrigErr").css('color', 'red').html(returnedData.password) : $("#pwordOrigErr").css('color', 'red').html(returnedData.password_retype);
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
    
    //when the close button on the login modal is clicked
    $(".closeLogInSignUpModal").click(function(){
        //redirect to landing page
        window.location.href = appRoot;
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //WHEN THE SUBMIT BUTTON ON THE LOG IN MODAL IS CLICKED
    $("#loginSubmit").click(function(e){
        e.preventDefault();
        
        var email = $("#emailLogIn").val();
        var password = $("#logInPassword").val();
       
       if(!email || !password){
           //display error message
           $("#logInFMsg").css('color', 'red').html("Please enter both your email and password");
           return;
       }
       
       
       //display progress message
       $("#logInFMsg").css('color', 'black').html("Authenticating. Please wait...");
       
       
       //call function to handle log in and get the returned data through a callback
       handleLogin(email, password, function(returnedData){
           if(returnedData.status === 1){
                $("#logInFMsg").css('color', 'green').html(returnedData.msg);

                //location.reload(true);
                
                //call function to change page to logged in user's view
                changePageToLoggedInView();
            }

            else{
                //display error message
                $("#logInFMsg").css('color', 'red').html(returnedData.msg);
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
    
    
    //if user tries to take a test from the home page
    $("#pageContent").on('click', '.getQueInfo', function(e){
        e.preventDefault();
        
        //clear all error messages in case there are some
        changeInnerHTML(['eBodyHomeErr', 'eSubjectHomeErr', 'eYearHomeErr'], "");
        
        var examBody = $("#eBodyHome").val();
        var subject = $("#eSubjectHome").val();
        var year = $("#eYearHome").val();
        
        if(!examBody || !subject || !year){
            //display error message(s) and stop execution
            !examBody ? $("#eBodyHomeErr").css({'color':'white', 'font-size':"11px"}).html("Select exam body") : "";
            !subject ? $("#eSubjectHomeErr").css({'color':'white', 'font-size':"11px"}).html("Select a subject") : "";
            !year ? $("#eYearHomeErr").css({'color':'white', 'font-size':"11px"}).html("Select exam year") : "";
            
            return;
        }
        
        
        displayFlashMsg("Please wait...", spinnerClass, '', '');
        
        //ensure user is logged in. If yes, continue. If no, prompt user to either log in or register to continue
        checkLogin(function(status){
            
            if(status === 0){//i.e. user's session has expired
                hideFlashMsg();
                
                //change menu to that of guest
                changePageToGuestView();
				
                //launch log in modal prompting the user to log in                
                triggerLoginForm("Log in required. Pls Log in or Register to take a test", {'color':'red'});
            }
            
            else{
                //call function to handle the fetching of instructions from the server
                getExamInfoFromServer(examBody, subject, year);
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
    
    //When user clicks on "Start" button to actually start the test (from the instruction page)
    $("#pageContent").on('click', '#startTest', function(e){
        e.preventDefault();
        
        var examBody = $("#instExamBody").text();
        var subject = $("#instExamSubject").text();
        var year = $("#instExamYear").text();
        var doNotTimeMe = $("#instDoNotTimeMe").prop('checked') ? 1 : 0;
        
        //call function to handle the fetching of questions from the server
        getExamQuestionsFromServer(examBody, subject, year, doNotTimeMe);
    });
    
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //When exam body is selected or changed
    $("#eBodyHome").change(function(){
        var selectedBody = $(this).val();
        var subjectsToDisplay = [];//subjects to display in options of "eSubjectHome" select dropdown
        
        //loop through the array of published que info
        //get the body equal to the selected body and loop through it to display the available courses under that body
        $.each(publishedQueInfo, function(publishedBody, publishedBodyCourses){
            if(publishedBody === selectedBody){
                $.each(publishedBodyCourses, function(course){
                    subjectsToDisplay.push(course);
                });
                
                subjectsToDisplay.sort();
                
                //call function to display the options
                //setSelectOptions(arrOfOptions, elementId, defaultOptionText)
                setSelectOptions(subjectsToDisplay, "eSubjectHome", "Course");
                setSelectOptions([], "eYearHome", "Year");//reset the year
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
    
    
    
    //When exam course/subject is selected or changed
    $("#eSubjectHome").change(function(){
        var selectedBody = $("#eBodyHome").val();
        var selectedCourse = $(this).val();
        var yearsToDisplay = [];//years to display in options of "eYearHome" select dropdown
        
        //loop through the array of published que info
        //get the selected body and loop through it to get all the available courses under the body
        //then loop though the courses to get all the available years in the selected course
        $.each(publishedQueInfo, function(body, bodyCourses){
            if(body === selectedBody){
                //loop through the courses in selectedBody
                $.each(bodyCourses, function(course, year){
                    if(course === selectedCourse){
                        //get the years available for course
                        $.each(year, function(){
                            yearsToDisplay.push(this);
                        });
                        
                        yearsToDisplay.sort();//sort the year in ascending order
                        
                        //call function to display the options
                        //setSelectOptions(arrOfOptions, elementId, defaultOptionText)
                        setSelectOptions(yearsToDisplay, "eYearHome", "Year");
                    }
                });
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
   
   $("#pageContent").on("click", "#showAllQue", function(){
       var checked = $(this).prop("checked");
       
       
       if(checked){//i.e. show all is checked
           //show all and hide "next" and "previous" buttons
           $(".currTestQue").removeClass("hidden");//remove the hidden class from all questions
           
           $("#paginationOfQueNum").addClass("hidden");//hide the pagination div
           
           //$("#paginationOfQueNum > ul > li").removeClass("active");//remove the active class from the pagination number
           
           $(".nextPrevDiv").addClass("hidden");//hide "next" and "previous" buttons
           
       }
       
       else{//show all is unchecked i.e. show one que per page
           //hide all but one and show "next" and "previous" buttons
           //show the active question number in pagination
           var activeQueNum = "";
           
           $(".currTestQue").not($(".currTestQue").first()).addClass("hidden");//hide all but the first question
           
           $("#paginationOfQueNum").removeClass("hidden");//show the pagination div
           
           $(".nextPrevDiv").removeClass("hidden");//show "next" and "previous" buttons 
       }
   });
    
    
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //when "next" is clicked on a question
    $("#pageContent").on("click", ".nextQue", function(){
        var currQueElem = $(this).parents(".nextPrevDiv").siblings("#questionsDiv").find(".currTestQue").not(".hidden");//$(this).parents(".currTestQue");
        
        //Do not take any action if the currently displayed question is the last
        var lastElemId = $(".currTestQue").last().prop('id');
        
        if(currQueElem.prop('id') === lastElemId){
            return;
        }
        
        //show "previous" button in case it is hidden
        $(".previousQue").removeClass("hidden");
        
        //currQueElem.addClass("hidden");//hide current question
        currQueElem.next().removeClass('hidden');//display next question
        $(".currTestQue").not(currQueElem.next()).addClass('hidden');//hide every other element with 'currTestQue' except the next que which we want to display
        
        
        //get the number (on pagination) of current and next question
        //then remove the "active" class on the current question and add to the next question
        //This is to indicate the number of the question currently being displayed on the pagination
        var currQueNum = currQueElem.prop('id').split("-")[1];
        var nextQueNum = currQueElem.next().prop('id').split("-")[1];
        
        changeCurrQueNumberToActive(currQueNum, nextQueNum);
        
        //hide "next" button if the question we just display is the last
        if(currQueElem.next().prop('id') === lastElemId){
            $(this).addClass("hidden");//hide "next" button
        }
        
    });
    
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   
   
   //when "previous" is clicked on a question
    $("#pageContent").on("click", ".previousQue", function(){
        var currQueElem = $(this).parents(".nextPrevDiv").siblings("#questionsDiv").find(".currTestQue").not(".hidden");//$(this).parents(".currTestQue");
        
        //Do not take any action if the currently displayed question is the last
        var lastElemId = $(".currTestQue").first().prop('id');
        
        if(currQueElem.prop('id') === lastElemId){
            return;
        }
        
        //show "next" button in case it is hidden
        $(".nextQue").removeClass("hidden");
        
        //currQueElem.addClass("hidden");
        currQueElem.prev().removeClass('hidden');//display next question
        $(".currTestQue").not(currQueElem.prev()).addClass('hidden');//hide every other element with 'currTestQue' except the prev que which we want to display
        
        
        //get the number of current and prev question
        //then remove the "disabled" class on the current question and add to the prev question
        var currQueNum = currQueElem.prop('id').split("-")[1];
        var prevQueNum = currQueElem.prev().prop('id').split("-")[1];
        
        changeCurrQueNumberToActive(currQueNum, prevQueNum);
        
        //hide "previous" button if the question we just display is the last
        if(currQueElem.prev().prop('id') === lastElemId){
            $(this).addClass("hidden");
        }
    });
    
    
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //When a question number is clicked while taking a test
    $("#pageContent").on("click", ".pageQueNumber", function(){
        //get the id of the parent (which is the question number to be shown)
        //get the number of the currently displayed question
        //hide the current question (if it's not the one being displayed) and show the question corresponding to the clicked number
        
        var numOfQueToShow = $(this).parent("li").prop('id').split("-")[1];
        var numOfCurrQue = $(this).parent("li").siblings('.activeQue').prop('id').split("-")[1];
        
        if(numOfCurrQue && (numOfCurrQue !== numOfQueToShow)){
            
            //hide all questions except the one we want to display
            $(".currTestQue").not("#currTestQue-"+numOfQueToShow).addClass("hidden");
            
            //remove the hidden class from the one we want to display
            $("#currTestQue-"+numOfQueToShow).removeClass('hidden');
            
            changeCurrQueNumberToActive(numOfCurrQue, numOfQueToShow);
            
            
            //hide "next" button if the question we just display is the last
            var lastElemId = $(".currTestQue").last().prop('id');
            
            if(("currTestQue-"+numOfQueToShow) === lastElemId){
                $(".nextQue").addClass("hidden");//hide "next" button
            }
            
            else{
                $(".nextQue").removeClass("hidden");//show "next" button
            }
            
            
            //hide "previous" button if the question we just display is the first
            var firstElemId = $(".currTestQue").first().prop('id');
            
            if(("currTestQue-"+numOfQueToShow) === firstElemId){
                $(".previousQue").addClass("hidden");//hide "previous" button
            }
            
            else{
                $(".previousQue").removeClass("hidden");//show "previous" button
            }
        }
    });
    
    
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   
   //indicate on the question number when a question is attempted (i.e. user checks an answer)
    $("#pageContent").on('click', '.checkMe', function(){
        if($(this).prop('checked')){
            //get the question number of the question that was attempted
            var queNumOfAttemptedQue = $(this).parents('.currTestQue').prop('id').split("-")[1];
            
            //now mark the question as "attempted/done" on the question number pagination
            $("#pageQueNumber-"+queNumOfAttemptedQue).fadeTo('slow', 0.5).addClass("attemptedQue");
        }
    });
    
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   
    //When the submit button is clicked to submit the test
    /*
    $("#pageContent").on("click", "#submitQue", function(){
        $("#confirmSubmissionModal").modal("show");
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   
    //WHEN "YES" IS CLICKED WHEN USER WAS PROMPTED TO CONFIRM SUBMISSION
    $("#pageContent").on('click', '#confirmSubmission', function(){
        //hide the modal
        $("#confirmSubmissionModal").modal("hide");
        
        //call function to send questions to server and get result
        getQIdsAndAnswers();
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
   
   //When user click "send" button to share test result with friends
    $("#pageContent").on('click', '.sendShareEmail', function(){
        var emails = $(this).siblings(".emailsToShareTo").val();
        
        if(emails){
            //validate email address(es)
            if(!validateEmail(emails)){
                displayFlashMsg("Please crosscheck email address(es)", '', 'red', '', false);
                return;
            }
            
            var userScore = $("#myTestScore").html();
            var examBody = $("#testEBody").val();
            var subject = $("#testECourse").val();
            var year = $("#testEYear").val();

            var msg = "I just practised all "+examBody+"'s "+ year +" "+ subject +" questions <b>for free</b> on\
             <a href='"+appRoot+"'>practa.ng</a> and I got "+userScore +". Think you can do better?\
             Click <a href='"+location.href+"'>here to take the same test.";

           displayFlashMsg("Sending message...", spinnerClass, '', '', false);

            $.ajax(appRoot+"misc/send_email",{
                method: "POST",
                data: {emails:emails, msg:msg}
            }).done(function(returnedData){
                if(returnedData.status === 1){
                    changeFlashMsgContent("Message sent", "", "green", 2000, false);

                    $(".emailsToShareTo").val('');
                }

                else{
                    changeFlashMsgContent("Could not send message. Ensure the emails are separated with commas and try again",
                    "", "red", 2000, false);
                }
            });
        }
        
        else{
            displayFlashMsg("Enter at least one email", '', 'red', 2000, false);
        }
    });
   
   
   /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   
    //WHEN "SEND" BUTTON IS CLICKED IN ORDER TO SHARE QUIZ LINK WITH FRIENDS VIA EMAIL
    $("#viewQuizQueDiv, #createdQuizQuestions").on('click', '#shareQuizSend', function(e){
        e.preventDefault();
        
        var emailAddresses = $("#shareQuizEmails").val();
        var subject = $("#shareQuizSub").val();
        var msg = $("#shareQuizMsg").val();
        var name = $("#shareQuizName").val();
        var quizId = $(this).siblings("input[type=hidden]").val();
        
        if(emailAddresses && msg){
            //validate email address(es)
            if(!validateEmail(emailAddresses)){
                $("#shareProgMsg").css({color:'red'}).html("Please crosscheck email address(es)");
                return;
            }

            //append link to message if it doesn't contain the link
            if(msg.search(appRoot+"quiz/tq/"+quizId) === -1){
                msg = msg + "\n\n"+appRoot+"quiz/tq/"+quizId;
            }
        
            $("#shareProgMsg").css({color:'black'}).html("<i class='"+spinnerClass+" fa-lg'></i> Sending...");
            
            $.post(appRoot+"quiz/sh", {e:emailAddresses, s:subject, m:msg, n:name}).done(function(returnedData){
                if(returnedData.status === 1){
                    $("#shareProgMsg").css({color:'green'}).html("Quiz sent to recipients").fadeOut(6000);
                    
                    //reset form
                    document.getElementById("shareQuizForm").reset();
                    
                    //Dimiss modal after a while
                    setTimeout(function(){$("#shareQuizModal").modal("hide");}, 2000);
                }
                
                else{
                    $("#shareProgMsg").css({color:'red'}).html("We're unable to complete your request at this time. Pls try again later");
                }
            }).fail(function(){
                checkBrowserOnline(false);
            });
        }
        
        else{
            !emailAddresses ? $("#shareQuizEmails").css({borderColor:'red'}) : $("#shareQuizEmails").css({borderColor:''});
            !msg ? $("#shareQuizMsg").css({borderColor:'red'}) : $("#shareQuizMsg").css({borderColor:''});
        }
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
 * call function "functionToCall" if document has focus
 * Check Andy E's answer: https://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active
 * @param {type} functionToCall
 * @returns {undefined}
 */
function checkDocumentVisibility(functionToCall){
    var hidden = "hidden";
    
    //detect if page has focus and call "functionToCall" if it does
    if(hidden in document){//for browsers that support visibility API
        $(document).on("visibilitychange", functionToCall);
    }
    
    else if ((hidden = "mozHidden") in document){
        document.addEventListener("mozvisibilitychange", functionToCall);
    }

    else if ((hidden = "webkitHidden") in document){
        document.addEventListener("webkitvisibilitychange", functionToCall);
    }

    else if ((hidden = "msHidden") in document){
        document.addEventListener("msvisibilitychange", functionToCall);
    }

    // IE 9 and lower:
    else if ("onfocusout" in document){
        document.onfocusin = document.onfocusout = functionToCall;
    }

    // All others:
    else{
      window.onpageshow = window.onpagehide = window.onfocus = window.onblur = functionToCall;
    }
}


/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

/**
 * Check user's log in status (when page has focus) and trigger login modal if user is not logged in
 * @returns {undefined}
 */
function checkLogin(callback, textToDisplay){
    $.ajax({
        url: appRoot+"misc/cl_",
        method: "GET"
    }).done(function(returnedData){
        //if a callback was sent, call it.
        if(typeof callback === "function"){
            callback(returnedData.status);
        }

        else{//else, trigger the modal to allow user to log in
            if(returnedData.status === 0){
                var msg = textToDisplay || "Your session has expired. Please log in to continue";

                triggerLoginForm(msg, {'color':'red'});//trigger log in form

                changePageToGuestView();
            }
        }
    });
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
 * @param {type} email
 * @param {type} password
 * @param {type} callback function to callback after execution
 * @returns {undefined}
 */
function handleLogin(email, password, callback){
    var jsonToReturn = "";
    
    $.ajax(appRoot+'access/login', {
        method: "POST",
        data: {email:email, password:password}
    }).done(function(returnedData){
        if(returnedData.status === 1){
            jsonToReturn = {status:1, msg:"Authenticated."};
            typeof callback === "function" ? callback(jsonToReturn) : "";
        }

        else{
            //display error messages
            jsonToReturn = {status:0, msg:"Invalid email/password combination"};
            typeof callback === "function" ? callback(jsonToReturn) : "";
        }
    }).fail(function(){
        //set error message based on the internet connectivity of the user
        var msg = (navigator.onLine) ? "Unable to log you in at the moment. Please try again later." 
            : "Log in failed. Please check your internet connection and try again later.";
        
        //display error messages
        jsonToReturn = {status:0, msg:msg};
        typeof callback === "function" ? callback(jsonToReturn) : "";
    });
}

/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

/**
 * Change the class name of elements
 * @param {type} elementId
 * @param {type} newClassName
 * @returns {String}
 */
function changeClassName(elementId, newClassName){
    
    //just change value if it's a single element
    if(typeof elementId === "string"){
        $("#"+elementId).attr('class', newClassName);
    }
    
    //loop through if it's an array
    else{
        var i;
    
        for(i in elementId){
            $("#"+elementId[i]).attr('class', newClassName);
        }
    }
    return "";
}


/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

/**
 * Change the innerHTML of elements
 * @param {type} elementId
 * @param {type} newValue
 * @returns {String}
 */
function changeInnerHTML(elementId, newValue){
    //just change value if it's a single element
    if(typeof elementId === "string"){
        $("#"+elementId).html(newValue);
    }
    
    //loop through if it's an array
    else{
        var i;
    
        for(i in elementId){
            $("#"+elementId[i]).html(newValue);
        }
    }
    
    
    return "";
}


/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/


/**
 * Function to handle the display of messages
 * @param {type} msg
 * @param {type} iconClassName
 * @param {type} color
 * @param {type} time
 * @param {type} hideCloseBtn
 * @returns {undefined}
 */
function displayFlashMsg(msg, iconClassName, color, time, hideCloseBtn){
    changeClassName('flashMsgIcon', iconClassName);//set spinner class name
    
    $("#flashMsg").css('color', color);//change font color
    
    changeInnerHTML('flashMsg', msg);//set message to display
    
    hideCloseBtn ? $("#closeFlashMsg").addClass('hidden') : $("#closeFlashMsg").removeClass('hidden');
    
    $("#flashMsgModal").modal('show');//display modal
    
    //hide the modal after a specified time if time is specified
    if(time){
        setTimeout(function(){$("#flashMsgModal").modal('hide');}, time);
    }
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
 * @returns {undefined}
 */
function hideFlashMsg(){
    changeClassName('flashMsgIcon', "");//set spinner class name
    $("#flashMsg").css('color', '');//change font color
    changeInnerHTML('flashMsg', "");//set message to display
    $("#flashMsgModal").modal('hide');//hide modal
}


/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

/**
 * Change message being displayed and hide the modal if time is set
 * @param {type} msg
 * @param {type} iconClassName
 * @param {type} color
 * @param {type} time
 * @param {type} hideCloseBtn
 * @returns {undefined}
 */
function changeFlashMsgContent(msg, iconClassName, color, time, hideCloseBtn){
    changeClassName('flashMsgIcon', iconClassName);//set spinner class name
    
    $("#flashMsg").css('color', color);//change font color
    
    changeInnerHTML('flashMsg', msg);//set message to display
    
    hideCloseBtn ? $("#closeFlashMsg").addClass('hidden') : $("#closeFlashMsg").removeClass('hidden');
    
    //hide the modal after a specified time if time is specified
    if(time){
        setTimeout(function(){$("#flashMsgModal").modal('hide');}, time);
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


function getExamInfoFromServer(examBody, course, year){
    if(examBody && course && year){
        
        changeFlashMsgContent("Please wait...", spinnerClass, '', '');
        
        $.ajax(appRoot+'questions/get_info', {
            method: "POST",
            data: {exam_body:examBody, subject:course, year:year}
        }).done(function(returnedData){
            if(returnedData.status === 1){
                hideFlashMsg();
                
                //paste the instructions
                $("#pageContent").html(returnedData.instructionPage);
                
                //change the url to appRoot/instruction
                changeURL("Instruction", "/exam/instruction/"+examBody+"/"+year+"/"+course);
                
                //scroll to the top of the page
                scrollPageToTop();
            }
            
            else{
                //display error message
                changeFlashMsgContent("No questions found for your selected exam", '', 'red', 1000);
            }
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


function getExamQuestionsFromServer(examBody, subject, year, doNotTimeMe){
    if(examBody && subject && year){
        
        displayFlashMsg("Please wait while we set up the questions", spinnerClass, '', '');
        
        $.ajax(appRoot+'questions/start_test', {
            method: "POST",
            data: {exam_body:examBody, subject:subject, year:year, do_not_time_me:doNotTimeMe}
        }).done(function(returnedData){
            if(returnedData.status === 1){
                hideFlashMsg();
                
                //display the questions
                $("#pageContent").html(returnedData.examQuestions);
                
                //scroll to the top of the page
                scrollPageToTop();
                
                //change the url appRoot/questions/start_test/exam_body/exam_year/subject
                var urlPath = "/questions/start_test/"+examBody+"/"+year+"/"+subject+"/"+doNotTimeMe;
                
                changeURL(returnedData.pageTitle, urlPath);
            }
            
            else{
                //display error message
                changeFlashMsgContent("No questions found for your selected exam", '', 'red', 2000);
            }
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


/**
 * Handles the logging in of users with social media accounts
 * @param {type} email
 * @param {type} firstName
 * @param {type} lastName
 * @param {type} socialLoginType type of social media account used (Facebook, gmail etc)
 * @param {type} callback function to callback once the logging in is done
 * @returns {undefined}
 */
function handleSocialLogIn(email, firstName, lastName, socialLoginType, callback){
    changeFlashMsgContent("Logging in....", spinnerClass, 'green', '');
    
    //check route for controller/method to call when the url below is matched
    $.ajax(appRoot+'access/socsignup', {
        method: "POST",
        data: {email:email, first_name:firstName, last_name:lastName, soc_type:socialLoginType}
    }).done(function(returnedData){
        if(callback && (typeof callback === "function")){
            callback(returnedData);
        }
        
        else if(returnedData.status === 1){

            changeFlashMsgContent("Logged in", '', 'green', '');
            
            //location.reload(true);
            
            changePageToLoggedInView();
            
            setTimeout(function(){
                hideFlashMsg();
            }, 1000);
        }
        
        else{//if returnedData.status is not equal to 1
            hideFlashMsg();
            
            $("#logInFMsg").css({'color':'red', 'fontSize':'11px'}).html("Operation Failed");
            
            $("#signLogModal").modal('show');
        }
        
    });
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
 * @param {type} arrOfOptions array of values to set as the select dropdon options
 * @param {type} elementId Id of the select element to display the options in
 * @param {type} defaultOptionText the default option to display
 * @returns {undefined}
 */
function setSelectOptions(arrOfOptions, elementId, defaultOptionText){
    var options = "<option value=''>"+defaultOptionText+"</option>";
    var optionsLength = arrOfOptions.length;
    
    for(var i = 0; i < optionsLength; i++){
        options += "<option value='"+arrOfOptions[i]+"'>"+arrOfOptions[i]+"</option>";
    }
    
    //now set the options
    $("#"+elementId).html(options);
    
    return "";
}

/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

function changeCurrQueNumberToActive(currQueNum, nxtOrPrevQueNum){
    //remove the active class from all pagination li
    //and add it to currQueNum (question we are navigating to)
    $("#pageQueNumber-"+nxtOrPrevQueNum).addClass('activeQue');
    $("#paginationOfQueNum > ul > li").not("#pageQueNumber-"+nxtOrPrevQueNum).removeClass("activeQue");
}

/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

/**
 * Get info about questions and user's answers to each question
 * @returns {undefined}
 */
function getQIdsAndAnswers(){
    var jsonObjToSend = {};
    
    //clear timer interval
    clearInterval(displayTimer);
           
    //get each question ID and the value of the selected option
    //Each Question's main div has class "currTestQue"
    $(".currTestQue").each(function(){
        var questionId = $(this).find('.qId').prop('id').split("-")[1];//get question ID
        var optionsElem = $(this).find('.checkMe');
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
    
    //checklogin status, if good, proceed. else user must login or reg
    //checkLogin(callback, textToDisplay)
    checkLogin(function(status){
        
        if(status === 1){//user is logged in
            //now send the answers to the server
            submitAnswersToServer(jsonObjToSend);
        }

        else{
            triggerLoginForm("You appear to be logged out. Pls Log in or Register to continue", {'color':'red'});
        }
    });
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
function submitAnswersToServer(jsonObjToSend){
    displayFlashMsg("Please wait while your result is being generated", spinnerClass, "", "", true);
    
    var questionGroup = $("#qGrp").val();
    var doNotTimeMe = $("#doNotTimeMe").val();
    
    $.ajax(appRoot+"questions/submit", {
        data: {qAndAnswers:jsonObjToSend, qGrp:questionGroup, timeSpentInSec:g.timeSpentOnTestInSec, do_not_time_me:doNotTimeMe},
        method: "POST"
    }).done(function(returnedData){
        hideFlashMsg();//hide flash msg
        $("#submitQue").remove();//remove the submit button
        
        //hide "showAll"
        $("#showAllRow").addClass("hidden");
        
        //display the score
        $("#myTestScore").html(returnedData.score);
        $("#dispScore").removeClass('hidden');
        $("#timerDiv").addClass("hidden");
        $(".timer-sm").addClass("hidden");
        
        //change  content of the pagination div on top
        $("#paginationOfQueNum").html("<br><b>Below is the result of your just concluded test: </b>");
        
        //remove "next" and "previous" buttons
        $(".nextQue").remove();
        $(".previousQue").remove();
        
        for(var i=0; i < returnedData.result.length; i++){
            var qId = returnedData.result[i].qId;
            var UA = returnedData.result[i].UA;
            var CA = returnedData.result[i].CA;
            
            //change the font color of the correct answer to green
            //append a green mark in front of the option text if user chose the right answer
            //else, append a red times icon
            
            $(".opText-"+qId).each(function(){
                //change the font color of the correct answer to green
                $(this).text() === CA ? $(this).css({'color':'green', 'fontSize':'16px'}) : "";
                
                //if current element's text is the user's answer, check if it's the correct answer and take necessary actions
                $(this).text() === UA ? ($(this).text() === CA ? $(this).append(" <i class='fa fa-check text-success'></i>") : $(this).css('color', 'red').append(" <i class='fa fa-times text-danger'></i>")) : "";
            });
        }
        
        //show all the questions by removing the hiddenclass on them
        $(".currTestQue").removeClass('hidden');
        
        
        //append div to enable sharing
        var shareDiv = "<div class='col-sm-3'>\
                <button class='btn btn-primary shareResultOnFB'>\
                    <i class='fa fa-facebook-official'></i> Share on Facebook\
                </button>\
            </div>\
            <br class='visible-sm visible-xs'>\
            <div class='col-sm-9 form-group form-inline'>\
                <label class='control-label' for='emailsToShareTo'>Send to Email</label>\
                <input type='email' class='form-control emailsToShareTo' multiple placeholder='Comma-separated Email'>\
                <br class='visible-sm visible-xs'>\
                <button class='btn btn-primary sendShareEmail'>Send</button>\
            </div>";
    
        $(".shareDiv").html(shareDiv);
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


function changeURL(pageTitle, url){
    //add the folder name if script is on localhost
    var attachFolderNameOnLocalHost = appRoot === "http://localhost/practa/" ? "/practa" : "";
    
    var newURL = attachFolderNameOnLocalHost+url;
    
    window.history.pushState({"pageTitle":pageTitle}, "", newURL);
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
 * @param {type} whereToScrollTo position to scroll to
 * @param {type} speed scroll speed
 * @returns {undefined}
 */
function scrollToPosition(whereToScrollTo, speed){
    $('html, body').animate({
        scrollTop: $(whereToScrollTo).offset().top
    }, speed);
}


/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

function getParameterByName(name, url, callback) {
    var stringToReturn = "";
    
    url = url ? url : window.location.href;//set url to current url if url is not set
    
    url = url.toLowerCase(); // This is just to avoid case sensitiveness  
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);

    if (!results){
        stringToReturn = null;
    }
    
    else if (!results[2]){
        stringToReturn = '';
    }
    
    else{
        stringToReturn = decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    
    callback(stringToReturn);
}


/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/


function getParamByName(paramName, callback){
    var urlParams;
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query)){
        urlParams[decode(match[1])] = decode(match[2]);
    }
    
    callback(urlParams[paramName]);
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
 * @param {type} timeInMin
 * @returns {undefined}
 */
function showTimerInMin(timeInMin){
    var hr = (timeInMin < 60) ? 0 : parseInt(timeInMin/60);
    var min = (timeInMin > 60) ? parseInt(timeInMin%60) : (timeInMin < 60 ? timeInMin : 0);
    var sec = 0;
    
    $(".countHr").html(hr < 10 ? "0"+hr : hr);
    $(".countMin").html(min < 10 ? "0"+min : min);
    $(".countSec").html(sec < 10 ? "0"+sec : sec);
    
    startCounter(hr, min, sec);
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
 * @param {type} timeInSec total time to be spent in secs
 * @param {type} timeSpentObj obj holding the time spent. The obj is required in order to be able to modify the global counter itself
 * @param {type} funcToPassToCounter function to call when the time elapse
 * @returns {undefined}
 */
function showTimerInSec(timeInSec, timeSpentObj, funcToPassToCounter){
    //get the number of hours in 'timeInSec'
    var hr = (timeInSec < 3600) ? 0 : parseInt(timeInSec/3600);
	
    //get the number of seconds left after getting the hour
    var numOfSecsLeft = timeInSec >= 3600 ? parseInt(timeInSec%3600) : timeInSec;

    //now get the number of minutes we have in 'numOfSecsLeft'
    var min = numOfSecsLeft > 60 ? parseInt(numOfSecsLeft/60) : 0;

    //get the number of secs we have left based on the value in 'numOfSecsLeft'
    var sec = numOfSecsLeft <= 60 ? numOfSecsLeft : parseInt(numOfSecsLeft%60);
    
    $(".countHr").html(hr < 10 ? "0"+hr : hr);
    $(".countMin").html(min < 10 ? "0"+min : min);
    $(".countSec").html(sec < 10 ? "0"+sec : sec);
    
    startCounter(hr, min, sec, timeSpentObj, funcToPassToCounter);
}


/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/


function startCounter(hr, min, sec, timerIncrementorObj, funcToCallForSubmission){
        
    displayTimer = setInterval(function(){
        //display seconds and decrement it by a sec
        sec--;
        $(".countSec").html(sec < 1 ? "59" : sec);
        
        //increment time spent
        timerIncrementorObj.timeSpentOnTestInSec++;
        
        if(sec < 1){
            //decrease minute and reset secs to 59 if min is not yet zero
            if(min >= 1 || hr >= 1){
                sec = 59;//set secs to 59 if less than 1
                min--;//decrease minute
                $(".countMin").html(min < 1 ? "59" : min);//and decrement min by 1
            }
            
            else{
                $(".countSec").html("00");//set secs to 00
            }
        }
        
        else if(min < 1){
            //decrease hour and set min to 59 if hour is not yet zero
            //else just decrease hour and do nothing to hour
            
            if(hr >= 1){
                min = 59;//reset min to 59 since we have at least one hour left
                $(".countMin").html(min);
                hr--;//decrease hour
                $(".countHr").html(hr);
            }
            
            else{
                $(".countMin").html("00");//set minute as zero if there is no hour left i.e. this is the last minute
            }
        }
        
        if((hr < 1) && (min < 1) && (sec < 1)){
            //time is up
            //submit questions
            typeof funcToCallForSubmission === "function" ? funcToCallForSubmission() : "";//getQIdsAndAnswers();
        }
        
    }, 1000);
}




/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/


function scrollPageToTop(time){
    time = time ? time : 100;//set 100 as default time
    
    //scrolls to top of page
    $('html, body').animate({
        scrollTop: $("html").offset().top
    }, time);
}

/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

function setAppRoot(devFolderName, prodFolderName){
    var hostname = window.location.hostname;

    /*
     * set the appRoot
     * This will work for both http, https with or without www
     * @type String
     */
    
    //attach trailing slash to both foldernames
    var devFolder = devFolderName ? devFolderName+"/" : "";
    var prodFolder = prodFolderName ? prodFolderName+"/" : "";
    
    var baseURL = hostname === "localhost" ? window.location.origin+"/"+devFolder : window.location.origin+"/"+prodFolder;
    
    return baseURL;
}

/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/


function changePageToLoggedInView(){
    //get just the menu from server
    $("#pageMenu").load(appRoot+"misc/gm #pageMenuUL");
    
    //then dismiss log in modal
    setTimeout(function(){
        $("#signLogModal").modal('hide');
    }, 500);
}

/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/


function changePageToGuestView(){
    //get just the menu from server
    $("#pageMenu").load(appRoot+"misc/gm #pageMenuUL");
}

/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

function triggerLoginForm(msg, cssObj){
    $("#logInFMsg").css(cssObj).html(msg);
                    
    $("#signUpDiv").addClass('hidden');//hide sign up form
    $("#logInDiv").removeClass('hidden');//display log in form

    //launch the login/signup modal
    $("#signLogModal").modal('show');
}

/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

function triggerSignUpForm(msg, cssObj){
    $("#logInFMsg").css(cssObj).html(msg);
                    
    $("#signUpDiv").removeClass('hidden');//display sign up form
    $("#logInDiv").addClass('hidden');//hide log in form

    //launch the login/signup modal
    $("#signLogModal").modal('show');
}


/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

function returnAlphabet(indexToReturn){
    var alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
        "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    
    return alpha[indexToReturn];
}


/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

function scrollToDiv(divElem, speed){
    
    $('html, body').animate({
        scrollTop: $(divElem).position().top
    }, speed||1000);
}


/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

/**
 * Checks if changes are made to a form
 * credits to Craig Buckler "http://www.sitepoint.com/javascript-form-change-checker/"
 * @param {type} formName
 * @returns {Array|formChanges.changed}
 */
function formChanges(formName) {
    if (typeof(formName) === "string"){
        formName = document.getElementById(formName);
    }
    
    if (!formName || !formName.nodeName || formName.nodeName.toLowerCase() !== "form"){
        return null;
    }
    
    var changed = [], n, c, def, o, ol, opt;
    
    for (var e = 0, el = formName.elements.length; e < el; e++) {
        n = formName.elements[e];
        c = false;
        
        switch (n.nodeName.toLowerCase()) {

            // select boxes
            case "select":
                def = 0;
                
                for (o = 0, ol = n.options.length; o < ol; o++) {
                    opt = n.options[o];
                    c = c || (opt.selected !== opt.defaultSelected);
                    if (opt.defaultSelected){
                        def = o;
                    }
                }
                
                if (c && !n.multiple){
                    c = (def !== n.selectedIndex);
                }
                break;
                
            //input/textarea
            case "textarea":
            case "input":

                switch (n.type.toLowerCase()) {
                    case "checkbox":
                    case "radio":
                    
                    // checkbox / radio
                    c = (n.checked !== n.defaultChecked);
                    break;
                    
                    default:
                    // standard values
                    c = (n.value !== n.defaultValue);
                    break;
                }
                
                break;
        }

        if (c){
            changed.push(n);
        }
    }
    
    
    //return true or false based on the length of variable "changed"
    if(changed.length > 0){
        return true;
    }
    
    else{
        return false;
    }
}


/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/


/**
 * Check if browser is connected to the internet (if not on localhost) when an ajax req failed
 * @param {bool} changeFlashContent whether to display a new flash message or change the content if one is displayed
 * @returns {undefined}
 */
function checkBrowserOnline(changeFlashContent){
    if((!navigator.onLine) && (appRoot.search('localhost') === -1)){
        var msg = "Network Error! Please check your internet connection and try again";
        
        changeFlashContent ? 
            changeFlashMsgContent(msg, '', 'red', '', false) 
            : 
            displayFlashMsg(msg, '', 'red', '', false);
    }
    
    else{
        var msg = "Unable to process your request. Please try again or report error";
        
        changeFlashContent ? 
            changeFlashMsgContent(msg, '', 'red', '', false) 
            : 
            displayFlashMsg(msg, '', 'red', '', false);
    }
}



/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/



/**
 * Thanks to https://stackoverflow.com/questions/46155/validate-email-address-in-javascript
 * @param {type} email
 * @returns {undefined}
 */
function validateEmail(email){
    var err = 0;
    var regExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    
    var singleEmail = email.split(",");
    var lengthOfEmail = singleEmail.length;

    //loop through and validate each email in case email is more than one
    for(var i=0; i < lengthOfEmail; i++){
        //increment err if email fail test
        regExp.test(singleEmail[i].trim()) ? "" : err++;
    }
    
    return (err > 0) ? false : true;
}

/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

/**
 * To preview the image that's about to be uploaded
 * @param {type} fileInput file input elem
 * @param {type} imgTagElem id/class of img tag to display the image in
 * @returns {undefined}
 */
function previewImage(fileInput, imgTagElem){
    if (fileInput.files) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(imgTagElem).attr('src', e.target.result);
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}

/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/


/**
 * Re-arranges the option letters of the options of a question
 * @param opMotherElem
 * @param {type} opElem element holding all options belonging to that particular question
 * @param opValElem
 * @returns {undefined}
 */
function rearrangeOptionLetterQuiz(opMotherElem, opElem, opValElem){
    var a = $(opMotherElem).find(opElem);//get all options div
    
    //loop through each option and rearrange the letters    
    $(a).each(function(i){
        $(this).find(opValElem).attr('placeholder', "Option "+returnAlphabet(i));
    });
}

/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/


function rearrangeQuestionNumbQuiz(numbMainElem, numberTextElem){
    $(numbMainElem).each(function(i){
        var num = i + 1;
        
        $(this).find(numberTextElem).html("Question "+num);
        $(this).find("input[type=radio]").attr("name", "op"+num+"Pub");
    });
    
}

/*
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
*/

/**
 * Function will display file if it's an image and its size is within the max allowed
 * @param {type} fileInputElem the file input element
 * @param {type} file the file to upload
 * @param {type} elemToDisplayImage the elem class/id/tagName where the image will b displayed
 * @param {type} maxFileSizeInBytes max allowed size for file
 * @param function callback
 * @returns {undefined}
 */
function displayImgIfAllIsWell(fileInputElem, file, elemToDisplayImage, maxFileSizeInBytes, callback){
    var maxFileSizeInKB = parseFloat(maxFileSizeInBytes/1000)+"kb";
    
    var allowedImgType = /^image\//;
    var status = 0;//default value for status
    
    //show image preview if file is an image and it's within the allowed size
    if((allowedImgType.test(file.type)) && (file.size <= maxFileSizeInBytes)){
        previewImage(fileInputElem, elemToDisplayImage);
        
        status = 1;
    }

    else{
        var msg = file.size > maxFileSizeInBytes ? "File too large. Maximum size allowed is "+maxFileSizeInKB : "File type not allowed";

        displayFlashMsg(msg, '', 'red', '');
    }
    
    
    //Call the callback function
    if(typeof callback === "function"){
        callback(status);
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
});