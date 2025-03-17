var offer_tick = 0;
var zz;
var wall_data = [];
var data = {};
var source = "";

$(function () {
  loadWall();
  initialLoad();
});

function $_GET(key) {
  var s = decodeURIComponent(window.location.search);
  s = s.match(new RegExp(key + "=([^&=]+)"));
  return s ? s[1] : false;
}

function initialLoad() {
  source = $_GET("target") || "netflix";
  data = window[source];

  if (data["includePushNotif"]) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://api.pushnami.com/scripts/v1/pushnami-adv/5ff35823da33df0010081e50";
    script.onload = function () {
      Pushnami.update({
        clickid: $_GET("clickid"),
      }).prompt();
    };
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  buildMainScreen(data);
  buildQuestionScreens(data);
  buildTermsHtml(data);
  setTheme(data.theme);

  $("#btn-accept").on("click", function (e) {
    e.preventDefault();
    $that = $(this);

    $("#intro").fadeOut(function () {
      $("#questions").show();
      $("#btn-accept").hide();
      $(this).remove();
    });
  });

  $questionsForm = $("form#questions");
  $activeQuestion = $questionsForm.find(".question.active");
  $nextQuestion = null;
  var data = {};
  var z;
  var wall_loaded = false;

  $questionsForm.find("button").on("click", function (e) {
    e.preventDefault();
    if (!$activeQuestion.find('input[type="radio"]').is(":checked")) {
      return false;
    }
    $nextQuestion = $activeQuestion.next(".question");

    if ($nextQuestion.length > 0) {
      $activeQuestion.fadeOut(function () {
        $(this).removeClass("active");
        $activeQuestion = $nextQuestion;
        $activeQuestion.addClass("active");
      });
    } else {
      if (wall_loaded) return;
      wall_loaded = true;
      $("#sur-modal").modal("toggle");
      $("#offer-modal").modal({
        backdrop: "static",
        keyboard: false,
      });
    }
  });
}

function setTheme(theme) {
  $(".action-button").css("background", theme.primary);
  $(".action-button").css("box-shadow", "0 1px 0 1px " + theme.shadow);
  $(".dday").css("background", theme.primary);
  $(".modal .modal-footer button").css("background", theme.primary);
  $("#btn-accept").css("box-shadow", "0 1px 0 1px " + theme.shadow);
  $("#main").css("background-image", "url(images/" + theme.image + ".jpg)");
}

function setWallTheme(theme) {
  $(".a-button .a-button-inner").css(
    "background",
    "linear-gradient(to bottom, " + theme.shadow + ", " + theme.primary + ")"
  );
  $(".a-button-primary .a-button-inner ").css(
    "background",
    "linear-gradient(to bottom, " + theme.shadow + ", " + theme.primary + ")"
  );
}

function isQuestionActive(index) {
  return index == 1 ? "active" : "";
}

function buildQuestionScreens(data) {
  var questionForm = $("#questions");
  questionForm.append(`
        <div class="content">
            ${data.title == "Online" ? "" : "<h2><b>FEATURED OFFERS:</b></h2>"}
            <h1 style="margin-top:0px;">
                <span style="color:${data.theme.primary}">${data.title}</span>
            </h1>
		</div>
    `);
  questionForm.append(
    `<div class="dday">Online Shopper Survey: ${getCurrentDate()}</div>`
  );

  var questionCount = data.questions.length;
  data.questions.forEach(function (data, index) {
    var questionIndex = index + 1;
    questionForm.append(`
            <div data-count="${questionIndex}" style="padding: 0 24px;" class="question text-center ${isQuestionActive(questionIndex)}">
                <div class="q-count">Question: ${questionIndex} of ${questionCount}</div>
                <p class="q">${data.question}</p>
                <div class="form-inline">
                    <input type="radio" id="radio-q-${questionIndex}" style="display:none;">					
                    ${buildAnswerHtml(questionIndex, data)}
                </div>
            </div>
        `);
  });
  $("#email-error").hide();
  $("#email-success").hide();
}

function buildAnswerHtml(questionIndex, data) {
  var answerHtml = "";
  var isForYesNoRedirect = "yesNoRedirect" in data ? data.yesNoRedirect : false;
  var isForEmail = "email" in data ? data.email : false;

  if (isForYesNoRedirect) {
    var redirectUrl = "redirectUrl" in data ? data.redirectUrl : "#";
    answerHtml += `
		<a name="q${questionIndex}" href="${redirectUrl}" target="_blank" class="btn btn-default action-button q${questionIndex}-radio" type="button">
			Yes
		</a>
		<button name="q${questionIndex}" onclick="$('#radio-q-${questionIndex}').attr('checked',true);" class="btn btn-default action-button q${questionIndex}-radio" type="button">
			No
		</button>
	`;
  } else if (isForEmail) {
    answerHtml += `
		<div id="email-error"></div>
		<div id="email-success">Success</div>
        <input class="form-control ans-email" id="email" name="email" placeholder="Enter email" type="email" autocorrect="off" autocapitalize="off" value="">
    `;
    answerHtml += `
		<button name="q${questionIndex}" onclick="subscribe('#radio-q-${questionIndex}', true);" class="btn btn-default action-button q${questionIndex}-radio" type="button">
			Continue
		</button>
		<button name="q${questionIndex}" onclick="subscribe('#radio-q-${questionIndex}', false);" class="btn btn-default action-button q${questionIndex}-radio" type="button">
			Skip
		</button>
	`;
  } else {
    var answers = "answers" in data ? data.answers : [];
    answers.forEach(function (answerValue, index) {
      answerHtml += `
				  <button name="q${questionIndex}" onclick="$('#radio-q-${questionIndex}').attr('checked',true);" class="btn btn-default action-button q${questionIndex}-radio" type="button">
					  ${answerValue}
				  </button>
			  `;
    });
  }

  return answerHtml;
}

function redirect(url) {
  location.href = url;
}

function subscribe(id, subscribe) {
  $("#email-error").hide();
  $("#email-success").hide();

  if (subscribe) {
    var email = $("#email").val();

    if (validateEmail(email)) {
      $.ajax({
        url: "https://1o82afhqg8.execute-api.us-east-1.amazonaws.com/PROD/subscribe",
        method: "POST",
        data: {
          email: email,
          source: source,
        },
        contentType: "application/json",
        dataType: "json",
        success: function (result) {
          console.log("success");
        },
        error: function (err) {
          $("#email-error").text("Error");
        },
      });
    } else {
      $("#email-error").text("Invalid email");
      $("#email-error").show();
    }
  }

  $(id).attr("checked", true);
}

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function buildMainScreen(data) {
  var html = `
    <h2>Dear ${data.title}</h2>
    <strong>Congratulations!</strong>
    <p>
		${data.description}
    </p>
    <p>
        This special is available until
        <strong>${getCurrentDate()}</strong>
    </p>
    <p>
        <b>
            TIME REMAINING:
            <span id="countdown_1" style="background-color: #ffff00; color: #ff0000">6:53</span>
        </b>
    </p>
   `;
  $(".main-screen").html(html);
  $("#sur-modal").modal("show");
}

function loadWall() {
  $.ajax({
    method: "GET",
    url: "https://t5.elvergadura.com/aff_c",
    data: {
      offer_id: 667,
      aff_id: 1491,
      aff_sub2: $_GET("clickid") || "{clickid}",
    },
    success: function (response) {
      wall_data = JSON.parse(response);
      buildOfferWall(wall_data);
      var data = window[$_GET("target") || "walgreens"];
      setWallTheme(data.theme);
    },
    error: function (err) {
      console.log(err);
    },
  });
}

function buildOfferWall(wall_json) {
  var countDownDateAjax;
  var endDateAjax = Array();
  var currentTimeAjax;

  $.each(wall_json, function (i, v) {
    var vprofTag = "";
    if (v && typeof v[14] != "undefined") {
      vprofTag = v[14];
    }

    // if no tag defined for offer or
    // the tag is included in the visitor's profile
    if (
      vprofTag == "" ||
      (typeof vprof != "undefined" && vprof.indexOf(vprofTag) >= 0)
    ) {
      if (offer_tick % 2 == 0)
        $("#offer-modal")
          .find("#offers .row-parent")
          .append('<div class="row">');
      offer = buildOfferHtml(v, "primary_offer_btn", "offer_del", i);
      $("#offer-modal").find("#offers .row-parent").append(offer);
      if (offer_tick % 2 == 1)
        $("#offer-modal").find("#offers .row-parent").append("</div>");
      offer_tick++;
    }
  });

  $("#offer-modal")
    .find("#offers .row-parent")
    .append(
      '<div class="col-md-12 offer_class offer_del apple_offer_vis"><div class="box"><div class="row"><div class="col-md-3"><img src="images/beats2.png" alt="" class="img-responsive" style="width: 60%; padding: 9px 16px 9px 16px; border: none; margin-left: auto; margin-right: auto; width: 90%;"><div align="center" style="margin-bottom: 5px;"><img src="images/4-5.png" style="border: none; height: 20px; margin-top: -4px;"> (536)</div></div><div class="col-md-4"><div class="offer-desc"><span class="offer-name"><strong>Beats™ Studio³ Wireless Noise Cancelling Headphones</strong></span><span class="offer-regular-price"><b>Regular Price:</b> $359.95</span><span class="offer-price-today" style="background-color: #FFFF00"><b>Your Price Today:</b> <span style="background-color: #FFFF00">$0.00</span></span><span class="offer-quantity"><b>Quantity left:</b> <span>Expired</span></span></div></div><div class="col-md-5" style="padding-top: 10px;" id="apple_offer_btn_zone"><center><span style="color: #ff0000"><b>Expires In:</b></span> <span class="offer_countdown" id="countdown-final">0:07</span></center><br /><div class="a-button-stack" id="apple_offer_stack"><span class="a-button a-spacing-small a-button-primary a-button-icon"><span class="a-button-inner"><span style="font-family: \'PT Sans\', sans-serif; color: #fff" class="a-button-text" ><!--<i class="a-icon a-icon-cart"></i>--><b>Claim Reward</b></span></span></span></div></div></div></div></div>'
    );

  //set timers...
  console.log("offer_tick: " + offer_tick);
  //first set the base time...
  currentTimeAjax = Date.parse(new Date());
  //now set random end times and init the counters
  for (var j = 0; j <= offer_tick; j++) {
    var timeInMinutesAjax = getRandomInt(7, 10);
    var timeInSecondsAjax = getRandomInt(0, 59);
    endDateAjax[j] = new Date(
      currentTimeAjax + timeInMinutesAjax * 60 * 1000 + timeInSecondsAjax * 1000
    );
    //init counters...
    var distance = endDateAjax[j] - currentTimeAjax;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (seconds <= 9) seconds = "0" + seconds;
    $("#countdown-" + j).html(minutes + ":" + seconds);
  }
  //now count em down, 500ms updates!
  z = setInterval(function () {
    var nowTime = Date.parse(new Date());
    var valid = 0;
    for (var k = 0; k <= offer_tick; k++) {
      var distance = endDateAjax[k] - nowTime;
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (seconds <= 9) seconds = "0" + seconds;
      if (distance < 0) {
        endDateAjax[k] = new Date(nowTime + 1000 * 60 * 2); //reset to 2 mins.
        $("#countdown-" + k).html("2:00");
        valid++;
      } else {
        $("#countdown-" + k).html(minutes + ":" + seconds);
        valid++;
      }
    }
    if (valid == 0) {
      clearInterval(z);
      console.log("All timers complete.");
    }
  }, 500);

  var zzz;

  zz = setInterval(function () {
    if ($(".apple_offer_vis").is(":visible")) {
      var nowTime = Date.parse(new Date());
      var endTime = nowTime + 1000 * 3;

      zzz = setInterval(function () {
        nowTime = Date.parse(new Date());
        var distance = endTime - nowTime;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (seconds <= 9) seconds = "0" + seconds;
        if (distance <= 0) {
          //expire!
          clearInterval(zzz); //stop the timer
          $("#apple_offer_btn_zone").html(
            '<center><span style="color: #f00"><b>Offer Expired!</b></span><br /><br /><div class="a-button-stack" id="apple_offer_stack"><span class="a-button a-spacing-small a-button-dis-primary a-button-icon"><span class="a-button-dis-inner"><span style="font-family: \'PT Sans\', sans-serif; color: #fff" class="a-button-text" ><!--<i class="a-icon a-icon-cart"></i>--><b>Expired</b></span></span></span></div>'
          );
        } else {
          $("#countdown-final").html(minutes + ":" + seconds);
        }
      }, 500);
      clearInterval(zz);
    }
  }, 200);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function buildOfferHtml(offer, btn_class, offer_del, i) {
  var html = "";
  html += '<div class="col-md-12 offer_class ' + offer_del + '">';
  html += '<div class="box">';
  html += '<div class="row">';
  html += '<div class="col-md-3">';
  html +=
    '<img src="' +
    offer[6] +
    '" alt="" class="img-responsive" style="width: 90%; padding: 9px 16px 9px 16px; border: none; margin-left: auto; margin-right: auto; width: 90%;" onclick="try { logClick(); } catch (e) {}; window.open(\'' +
    offer[7] +
    "');\">";
  var rand_star = Math.random();
  if (rand_star <= 0.5)
    var rand_star_img =
      '<img src="images/4-5.png" style="border: none; height: 20px; margin-top: -4px;" />';
  else
    rand_star_img =
      '<img src="images/5.png" style="border: none; height: 20px; margin-top: -4px;">';
  // console.log(rand_star);
  // console.log(rand_star_img);
  html +=
    '<div align="center" style="margin-bottom: 5px;">' +
    rand_star_img +
    " (" +
    getRandomInt(90, 990) +
    ")</div>";
  html += "</div>";
  html += '<div class="col-md-4">';
  html += '<div class="offer-desc">';
  html +=
    '<img src="' +
    offer[13] +
    '" style="display:none;" width="1" height="1" border="0" />';
  html += '<span class="offer-name"><strong>' + offer[0] + "</strong></span>";
  html += '<br><span class="offer-name">' + offer[1] + "</span>";
  html +=
    '<span class="offer-regular-price"><b>Regular Price:</b> ' +
    offer[2] +
    "</span>";
  html +=
    '<span class="offer-price-today" style="background-color: #FFFF00" ><b>Your Price Today:</b> ' +
    offer[3] +
    "</span>";
  html +=
    '<span class="offer-quantity"><b>Quantity left:</b> <span>' +
    offer[5] +
    "</span></span>";
  html += "</div>";
  html += "</div>";

  html +=
    '<div class="col-md-5" style="padding-top: 10px;"><center><span style="color: #ff0000"><b>Expires In:</b></span> <span class="offer_countdown" id="countdown-' +
    i +
    '">COUNTDOWN</span></center><br />';
  html +=
    '<a style="text-decoration: none;" onclick="try { logClick(); } catch (e) {}" data-shipping="' +
    offer[4] +
    '" data-offer="' +
    offer[0] +
    '" target="_blank" class="reward_alert" href="' +
    offer[7] +
    '">';
  html +=
    '<div class="a-button-stack"><span class="a-button a-spacing-small a-button-primary a-button-icon"><span class="a-button-inner"><!--<i class="a-icon a-icon-cart"></i>--><span style="font-family: \'PT Sans\', sans-serif;" class="a-button-text"><b>Claim Reward</b></span></span></span></div>';
  html += "</a>";
  html += "</div>";
  html += "</div>";
  html += "</div>";
  html += "</div>";
  return html;
}

function getCurrentDate() {
  var mydate = new Date();
  mydate.setDate(mydate.getDate());
  var year = mydate.getYear();
  if (year < 1000) year += 1900;
  var day = mydate.getDay();
  var month = mydate.getMonth();
  var daym = mydate.getDate();
  if (daym < 10) daym = "0" + daym;
  var dayarray = new Array(
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  );
  var montharray = new Array(
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  );
  return "" + montharray[month] + " " + daym + ", " + year + "";
}

function buildTermsHtml(data) {
  var termsMenuHtml = `
		<center>
			<a href="${data.terms_link}" style="color: #DDDDDD;">Terms and Conditions</a> | 
			${
        data.title == "Online"
          ? ""
          : `<a href="mailto:surveyreactor@protonmail.ch?subject=Regarding Survey ${data.survey_id}" style="color: #DDDDDD;">Contact Us</a>`
      }
		</center>
	`;

  $("#modal-dialog-question").append("<br></br>");
  $("#modal-dialog-question").append(termsMenuHtml);
  $("#modal-dialog-question").append("<br></br>");
  $("#modal-dialog-question").append(data.terms);
}

function getLeftBannerUrl() {
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  return "./images/" + year + "-months/" + year + "-" + month + ".png";
}

$(document).ready(function () {
  $("#top-left-banner").attr("src", getLeftBannerUrl());
  $("#comment_box").on("keyup", function (e) {
    e.preventDefault();
    if (e.key === "Enter" || e.keyCode === 13) {
      $("#commentform .form-group").html("<div class='loader'></div>");
      setTimeout(function () {
        $("#commentform .form-group").html(
          "Thanks for your feedback!  Your comment is now in our moderation queue, and will appear shortly!"
        );
      }, 2500);
    }
  });

  $(".like").click(function () {
    $(this).toggleClass("liked");
  });

  // Set the date we're counting down to
  var currentTime = Date.parse(new Date());
  var timeInMinutes = getRandomInt(6, 10);
  var countDownDate = new Date(currentTime + timeInMinutes * 60 * 1000);
  $("#countdown_1").html(timeInMinutes + ":00");

  var x = setInterval(function () {
    var now = new Date().getTime();
    var distance = countDownDate - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (seconds <= 9) seconds = "0" + seconds;

    $("#countdown_1").html(minutes + ":" + seconds);

    if (distance < 0) {
      clearInterval(x);
      $("#countdown_1").html("EXPIRED");
    }
  }, 500);
});
