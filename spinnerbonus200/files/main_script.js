function show5tipspop() {
    $('#5tips1').hide();
    $('#5tips2').show();
}

function show5tipspop1() {
    $('#5tips2').hide();
    $('#5tips3').show();
}

function show5tipspop2() {
    $('#5tips3').hide();
    $('#5tips4').show();
}

function show5tipspop3() {
    $('#5tips4').hide();
    $('#5tips5').show();
}

function show5tipspop4() {
    $('#5tips5').hide();
    $('#5tips6').show();
}

function show5tipspop5() {
    $('#5tips6').hide();
    $('#5tips7').show();
}

$(document).ready(function () {

    var $wheelBtn = document.querySelector(".wheel_btn"),
        $wheelBlock = document.querySelector(".wheel_block"),
        $tryCount = document.querySelector(".try_count"),
        $popUp = document.querySelector(".pop_up"),
        $spinBox = document.querySelector(".pop_up__box--spin"),
        $formBox = document.querySelector(".pop_up__box--form"),
        $btnAgin = document.querySelector(".pop_btn--agin"),
        tryCount = 2,
        isSpin = !1;
    $wheelBtn.addEventListener("click", function (t) {
        isSpin || ($wheelBlock.classList.add("first"), isSpin = !0, $wheelBtn.classList.add("btn-dis"), tryCount--, $tryCount.textContent = tryCount + "", setTimeout(function () {
            $popUp.classList.add("pop_up__open"), $spinBox.classList.add("active")
        }, 3500))
    }), $btnAgin.addEventListener("click", function (t) {
        $wheelBlock.classList.add("second"), $popUp.classList.remove("pop_up__open"), tryCount--, $tryCount.textContent = tryCount + "", setTimeout(function () {
            $popUp.classList.add("pop_up__open"), $spinBox.classList.remove("active"), $formBox.classList.add("active")
        }, 3500)
    });

});