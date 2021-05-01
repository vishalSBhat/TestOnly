$(document).ready(function () {
    $('#card-holder').height($('.card-active').outerHeight());
});

$('.login-signup-button').click(function (e) {
    const parent = $(e.target).attr('data-parent');
    console.log(parent)
    $('body').addClass('noscroll');
    $('#' + parent + '-holder').removeClass('d-none');
    $('#signup-box').height($('.signup-active').outerHeight());
    $('#' + parent + '-holder').animate({
        opacity: 1
    }, 400);
    $('#' + parent).removeClass('Modal-close').addClass('Modal-open').css('transform', 'translateY(0)');
});

$('.Close').click(function (e) {
    const parent = $(e.target).attr('data-parent');
    $('body').removeClass('noscroll');
    $('#' + parent).removeClass('Modal-open').addClass('Modal-close').css('transform', 'translateY(-100vh)');
    $('#' + parent + '-holder').animate({
        opacity: 0
    }, 700, function () {
        $('#' + parent + '-holder').addClass('d-none');
    });
});

function slideLeft(ele) {
    let next = 'card' + (parseInt(ele.slice(4)) + 1);
    if (next == 'card' + ($('#card-holder >  div').length))
        $('#carousel-nav-right').addClass('d-none');
    $('#card-holder').height($('#' + next).outerHeight());
    $('#' + ele).removeClass('card-active').addClass('slide-left');
    $('#' + next).removeClass('slide-right').addClass('card-active');
    $('#carousel-nav-left').removeClass('d-none');
}

function slideRight(ele) {
    let prev = 'card' + (parseInt(ele.slice(4)) - 1);
    if (prev == 'card1')
        $('#carousel-nav-left').addClass('d-none');
    $('#card-holder').height($('#' + prev).outerHeight());
    $('#' + ele).removeClass('card-active').addClass('slide-right');
    $('#' + prev).removeClass('slide-left').addClass('card-active');
    $('#carousel-nav-right').removeClass('d-none');
}

$('.carousel-nav').click(function (e) {
    let active = $('.card-active').attr('id');
    if (e.target.id == 'carousel-nav-right')
        slideLeft(active);
    else
        slideRight(active);
});

$('.signup-next').click(function () {
    const active = $('.signup-active').attr('id');
    const next = 'signup' + (parseInt(active.slice(6)) + 1);
    $('#' + active).removeClass('signup-active').addClass('slide-left');
    setTimeout(function () {
        $('#' + next).removeClass('slide-right').addClass('signup-active');
        $('#signup-box').height($('#' + next).outerHeight());
        $('.back-arrow').removeClass('d-none');
    }, 200);
});

$('.back-arrow').click(function () {
    const active = $('.signup-active').attr('id');
    const prev = 'signup' + (parseInt(active.slice(6)) - 1);
    if (prev == 'signup1')
        $('.back-arrow').addClass('d-none');
    $('#' + active).removeClass('signup-active').addClass('slide-right');
    setTimeout(function () {
        $('#' + prev).removeClass('slide-left').addClass('signup-active');
        $('#signup-box').height($('#' + prev).outerHeight());
    }, 200);
});
