//navbar

$(window).on('load', () => {
    const navElements = document.querySelector('.navbar-nav').children,
        liElements = Array.from(navElements);
    liElements.forEach(ele => {
        if (window.location.pathname === $(ele.children).attr('href'))
            $(ele.children).addClass('nav-link-active');
    });
});

$('.navbar-toggler').click(() => {
    $('.nav-items-container').addClass('navbar-open-animate')
    setTimeout(() => $('.nav-items-container').addClass('navbar-open').removeClass('navbar-open-animate'), 1000);
});

$(document).click(e => {
    if (window.matchMedia('(max-width: 767px)').matches)
        if (!($(e.target).hasClass('navbar-no-toggle')) && !($(e.target).hasClass('navbar-toggler')) && !($(e.target).hasClass('nav-items-container')))
            if ($('.nav-items-container').hasClass('navbar-open')) {
                $('.nav-items-container').addClass('navbar-close-animate').removeClass('navbar-open');
                setTimeout(() => $('.nav-items-container').removeClass('navbar-close-animate'), 1000);
            }
});

//end navbar

//button click styling

$('.button').on('click', e => {
    $(e.target).addClass('button-click');
});

$('.button').mouseout(e => $(e.target).removeClass('button-click'));

//text field validator

$('.text-field').on('blur', e => {
    if (e.target.value.trim() === '')
        $(e.target).nextAll(':not(.text-field-placeholder)').css('visibility', 'visible');
});

$('.text-field').on('keyup', e => {
    if (e.which === 13) {
        $('button[type="submit"]').click();
        return;
    }
    if (e.target.value.trim() === '') {
        setTimeout(() => {
            if (e.target.value.trim() === '')
                $(e.target).nextAll(':not(.text-field-placeholder)').css('visibility', 'visible');
        }, 500);
    } else
        $(e.target).nextUntil('.password-toggler', ':not(.text-field-placeholder)').css('visibility', 'hidden');
});

$('.number-text-field').on({
    'keydown': e => {
        if (isNaN(e.key) && e.which !== 8 && e.which !== 9)
            e.preventDefault();
    },
    'blur': e => numberTextFieldValidator($(e.target))
});

$('button[type="submit"]').on('click', e => {
    e.preventDefault();
    $('#' + $(e.target.form).attr('id')).submit();
});

function textFieldValidator(e) {
    e.preventDefault();
    let validated = true;
    $('.text-field').each(function () {
        if ($(this).val().trim() === '') {
            validated = false;
            $(this).keyup();
            $("html, body").animate({
                scrollTop: $(this).offset().top - 11 * $(window).height() / 100
            }, 500);
            $(this).focus();
            return false;
        } else if ($(this).hasClass("number-text-field")) {
            if (!numberTextFieldValidator($(this))) {
                validated = false;
                return false;
            }
        }
        return true;
    });
    if (!validated)
        return true;
    return false;
}

function numberTextFieldValidator(ele) {
    const value = ele.val().length,
        name = ele.attr('name');
    if (name === 'phNo') {
        if (value < 10 && value > 0) {
            ele.nextAll('.error-message').html('Enter valid 10 digit phone number').css('visibility', 'visible');
            $("html, body").animate({
                scrollTop: ele.offset().top - 11 * $(window).height() / 100
            }, 500);
            return false;
        } else {
            ele.nextAll('.error-message').html('This field is required').css('visibility', 'hidden');
            $(ele).keyup();
            return true;
        }
    } else if (name === 'pinCode') {
        if (value < 6 && value > 0) {
            $('.address-field-container .error-message').text('Enter valid 6 digit pin code').css('visibility', 'visible');
            $("html, body").animate({
                scrollTop: ele.offset().top - 11 * $(window).height() / 100
            }, 500);
            return false;
        } else {
            $('.address-field-container .error-message').text('Address cannot be blank').css('visibility', 'hidden');
            $(ele).keyup();
            return true;
        }
    }
    return true;
}

//address validator

function validateAddress() {
    $('.address-field-container .error-message').text('Address cannot be blank');
    let valid = false;
    const requiredFields = ['Pin-Code', 'Taluk', 'District', 'State'],
        addressFields = Array.from($('.address-field-container').children(':not(.error-message)', 'input'));

    //if all fields are blank then don't check 
    //for each field
    //if any 1 field is filled then check for 
    //each field and if is in required fields 
    //then change error message and display

    if (!(addressFields.filter(ele => $(ele).val().trim() !== '').length === 0))
        addressFields.every((ele, i, arr) => {
            if ($(ele).val().trim() === '') {
                const placeholder = $(ele).attr('placeholder');
                if (requiredFields.includes(placeholder)) {
                    $('.address-field-container .error-message').text(`${placeholder} cannot be blank`);
                    valid = false;
                    return false;
                } else if (placeholder === 'Street/Road Name') {
                    if ($(arr[i + 1]).val().trim() === '') {
                        $('.address-field-container .error-message').text(`Both ${placeholder} and Area Name cannot be blank`);
                        valid = false;
                        return false;
                    }
                }
            } else if ($(ele).hasClass('.number-text-field')) {
                if (!numberTextFieldValidator($(ele))) {
                    valid = false;
                    return false;
                }
            }
            valid = true;
            return true;
        });
    if (!valid) {
        $('.address-field-container .error-message').css('visibility', 'visible');
        $("html, body").animate({
            scrollTop: $('.address-field-container').offset().top - 11 * $(window).height() / 100
        }, 500);
        return false;
    } else {
        $('.address-field-container .error-message').css('visibility', 'hidden');
        return true;
    }
}

//qualification operations

$("#advocate-sign-up-qualification").on({
    'click': $('#advocate-sign-up-qualification').removeAttr('readonly'),
    'keydown': e => e.preventDefault()
});

function updateQualification(checked, value) {
    let qualification = $('#advocate-sign-up-qualification'),
        list = qualification.val();
    if (checked) {
        list += `${value}, `;
        qualification.val(list);
        qualification.nextAll().css('visibility', 'hidden');
    } else {
        list = list.split(', ').slice(0, -1).filter(val => val !== value).sort();
        list.push('');
        qualification.val(list.join(', '));
    }
}

$('.qualification-selector-item').on('click', e => {
    let checked;
    if ($(e.target).hasClass('qualification-selector-item-selected'))
        checked = false;
    else
        checked = true;
    updateQualification(checked, $(e.target).text());
    $(e.target).toggleClass('qualification-selector-item-selected');
});

function validateQualification() {
    let qualification = $("#advocate-sign-up-qualification");
    if (qualification.val().trim() === '') {
        qualification.nextAll().css('visibility', 'visible');
        $("html, body").animate({
            scrollTop: qualification.offset().top - 11 * $(window).height() / 100
        }, 500);
        return false;
    }
    return true;
}

//password operations

$('.password-toggler').on('click', e => {
    const ele = $(e.target).attr('data-for');
    if ($(ele).attr('type') === 'password') {
        $(ele).attr('type', 'text');
        $(e.target).attr('src', './icons/icons/eye-slash-fill.svg')
    } else {
        $(ele).attr('type', 'password');
        $(e.target).attr('src', './icons/icons/eye-fill.svg')
    }
});

function validatePassword() {
    let p = $('#advocate-sign-up-password'),
        cp = $('#advocate-sign-up-confirmPassword');

    if (p.val() !== cp.val()) {
        cp.nextUntil('.password-toggler', ':not(.text-field-placeholder)').css('visibility', 'visible');
        $("html, body").animate({
            scrollTop: p.offset().top - 11 * $(window).height() / 100
        }, 500);
        return false;
    } else {
        cp.nextUntil('.password-toggler', ':not(.text-field-placeholder)').css('visibility', 'hidden');
        return true;
    }
}

$('#advocate-sign-up-confirmPassword').on('keyup', () => {
    if (!$('#advocate-sign-up-password').val().includes($('#advocate-sign-up-confirmPassword').val()))
        validatePassword()
});

$('#advocate-sign-up-password').on('keyup', () => {
    if ($('#advocate-sign-up-confirmPassword').val() !== '' || $('#advocate-sign-up-password').val() === '')
        validatePassword()
});

$('#advocate-sign-up-confirmPassword').on('blur', () => validatePassword());

// start home.ejs

$("#advocate-login").submit((e) => {
    if (textFieldValidator(e)) {
        $("#advocate-server-validation-error").text('Error').css("visibility", "hidden");
        return;
    }
    $.ajax({
        url: '/validate',
        type: 'POST',
        data: {
            mail: $("#advocate-mail").val(),
            password: $("#advocate-password").val()
        },
        success: function (response) {
            if (response === 'success') {
                $("#advocate-login").unbind('submit').submit();
            } else
                $("#advocate-server-validation-error").text(response).css("visibility", "visible");
        }
    });
});

// end home.ejs
// start signUp.ejs

$('#advocate-sign-up').submit(function (e) {
    if (!textFieldValidator(e)) {
        if (!validateAddress() || !validateQualification() || !validatePassword()) {
            $("#advocate-server-validation-error").text('Error').css("visibility", "hidden");
            return;
        }
    } else {
        $("#advocate-server-validation-error").text('Error').css("visibility", "hidden");
        return;
    }
    $.ajax({
        url: '/sign-up/validate',
        type: 'POST',
        data: {
            mail: $("#advocate-sign-up-mail").val(),
            phNo: $("#advocate-sign-up-phNo").val()
        },
        success: function (response) {
            if (response === 'validated')
                $("#advocate-sign-up").unbind('submit').submit();
            else
                $("#advocate-server-validation-error").text(response).css("visibility", "visible");
        }
    });
});

// end signUp.ejs
//start dashboard

$('#profile-icon-holder').click(() => {
    if ($('.profile').hasClass('profile-open'))
        return;
    $(".profile").addClass('profile-display');
    setTimeout(() => $(".profile").addClass('profile-open').removeClass("profile-display"), 800);
    $('.dashboard').fadeOut(600);
});

$('#profile-back-button-holder').click(() => {
    $(".profile").addClass('profile-hide');
    setTimeout(() => {
        $(".profile").removeClass('profile-open profile-hide');
        $('.dashboard').fadeIn();
    }, 700);
});
