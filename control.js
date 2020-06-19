//set navbar active

$(window).on('load', () => {
    const navElements = document.querySelector('.navbar-nav').children,
        liElements = Array.from(navElements);
    liElements.forEach(ele => {
        if (window.location.pathname === $(ele.children).attr('href'))
            $(ele).addClass('active');
    })
});

//button click styling

$('.button').hover(e => $(e.target).addClass('button-hover'),
    e => $(e.target).removeClass('button-hover'));

$('.button').on('click', e => {
    $(e.target).removeClass('button-hover');
    $(e.target).addClass('button-click');
    setTimeout(() => $(e.target).removeClass('button-click'), 150);
    $(e.target).addClass('button-hover'); //trigger('mouseover');
});

//text field validator

$('.number-text-field').on({
    'keydown': e => {
        if (isNaN(e.key) && e.which !== 8)
            e.preventDefault();
    },
    'blur': e => numberTextFieldValidator($(e.target))
});

$('.text-field').on('blur', e => {
    if (e.target.value.trim() === '' && (!$(e.target).hasClass('number-text-field')))
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
        if (value < 10) {
            ele.nextAll('.error-message').html('Enter valid 10 digit phone number').css('visibility', 'visible');
            $("html, body").animate({
                scrollTop: ele.offset().top - 11 * $(window).height() / 100
            }, 500);
            return false;
        } else {
            ele.nextAll('.error-message').html('This field is required').css('visibility', 'hidden');
            return true;
        }
    } else if (name === 'pinCode') {
        if (value < 6) {
            $('.address-field-container .error-message').text('Enter valid 6 digit pin code').css('visibility', 'visible');
            $("html, body").animate({
                scrollTop: ele.offset().top - 11 * $(window).height() / 100
            }, 500);
            return false;
        } else {
            $('.address-field-container .error-message').text('Address cannot be blank').css('visibility', 'hidden');
            return true;
        }
    }
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

$('.qualification-selector-item input').on('click', e => {
    updateQualification(e.target.checked, $(e.target).parent().text());
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
        $(e.target).attr('src', 'eye-slash-fill.svg')
    } else {
        $(ele).attr('type', 'password');
        $(e.target).attr('src', 'eye-fill.svg')
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
// start accountPage.ejs

var list, temp1;

function accountPage() {
    list = JSON.parse($(".contactList").attr("data-value"));
}


$(".clientName").keydown((event) => {
    $(".contactList").empty();
    setTimeout(() => {
        temp1 = [];
        var phNo = $(".clientName").val();
        if (phNo === "")
            temp1 = [];
        else {
            list.forEach((item, index) => {
                if (item.name.search(new RegExp(phNo, "i")) !== -1) //in js u have indexof method instead of includes
                    temp1.push(item);
            });
        }
        for (let i = 0; i < temp1.length; ++i) {
            $(".contactList").append('<input type="text" class="dBlock mAuto contactListItems" value="' + temp1[i].name + '" onclick=autoFill(' + i + ') readonly/>');
        }
    }, 10);
});

function autoFill(value) {
    $(".contactList").empty();
    $(".clientName").val(temp1[value].name).focus();
    $("form input:last-of-type").val(temp1[value]._id);
    $("form").submit();
}

// end accountPage.ejs

// start clientSignUp.ejs

// $('#client-sign-up').submit(function (e) {
//     e.preventDefault();
//     $.ajax({
//         url: '/client/sign-up/validate',
//         type: 'POST',
//         data: {
//             mail: $("#mail").val(),
//             phNo: $("#ph-no").val(),
//             advocateId: $('#client-sign-up').attr('data-id')
//         },
//         success: res => {
//             if (res === 'validated')
//                 $("#client-sign-up").unbind('submit').submit();
//             else
//                 alert(JSON.parse(res).value);
//         },
//         complete: () => console.log('done')
//     });
// });

//end clientSignUp.ejs

// start clientData.ejs


function openCase(id) {
    data = JSON.stringify({
        advocateId: $("#advocate-id").html(),
        clientId: parseInt($("#client-id").html()),
        active: parseInt(id)
    });
    $.ajax({
        url: '/client-data/case/open/' + data,
        type: "POST",
        success: res => window.location.pathname = res.redirect
    });
}

function newCase() {
    data = JSON.stringify({
        advocateId: $("#advocate-id").html(),
        clientId: parseInt($("#client-id").html())
    });
    $.ajax({
        url: "/client-data/case/new/" + data,
        type: "POST",
        data: {
            caseTitle: $('#new-case-title').val(),
            caseDesc: $('#new-case-desc').val()
        },
        success: res => window.location.pathname = res.redirect
    });
}

//record operations

function recOperation(path, data, callback) {
    paramData = JSON.stringify({
        advocateId: $("#advocate-id").html(),
        clientId: parseInt($("#client-id").html()),
        caseId: parseInt($("#case-id").html())
    });
    $.ajax({
        url: "/client-data/record/" + path + paramData,
        type: "POST",
        data,
        success: res => callback()
    });
}

function newRec() {
    $("#amount-validity-err").remove();

    const date = $("#new-rec-date").val(),
        purpose = $("#new-rec-purpose").val(),
        amount = parseInt($("#new-rec-amount").val()),
        paid_by = $('#paid-by').attr('data-paid_by');

    if (isNaN($("#new-rec-amount").val()) || $("#new-rec-amount").val().trim() === "") {
        $("#new-rec-amount").after("<span id='amount-validity-err' class='mx-4 mt-2 dBlock' style='color: red;'>Enter valid amount !!</span>");
        return;
    }
    const recDate = '<div class="col-3 titem">' + date + '</div>',
        recPurpose = '<div class="col-6 titem">' + purpose + '</div>',
        recAmount = '<div class="col-3 titem"><b>' + amount + '</b><img src="/images/trash.png" alt="Delete" class="delete"></div>';
    new_record = ' <div class="row mAuto tbody">' + recDate + recPurpose + recAmount + '</div>',
        data = {
            date,
            purpose,
            amount,
            paid_by
        };
    let balance;

    recOperation('new/', data, () => {
        if (paid_by == 0) {
            balance = parseInt($("#recordBalance b").html()) + amount;
            $(".advocateRec button").before(new_record);
        } else {
            balance = parseInt($("#recordBalance b").html()) - amount;
            $(".clientRec button").before(new_record);
        }
        justClose();
        $("#recordBalance b").html(balance);
        if (!($(".advocateRec").find(".tbody") === null))
            $("#noRecordShow1").css("display", "none");
        if (!($(".clientRec").find(".tbody") === null))
            $("#noRecordShow2").css("display", "none");
    });
}

function alertDelete(id, of ) {
    $(".deleteAlert").css("display", "block").attr('data-recordId', id).attr('data-recordOf', of );
    $("body > *:not(.c)").css("filter", "blur(1px)");
}

$(".deleteAlert div button").on("click", (e) => {
    const _id = $('.deleteAlert').attr('data-recordId'),
        of = $('.deleteAlert').attr('data-recordOf');
    if ($(e.target).html() === "Yes") {

        recOperation('delete/', {
            _id
        }, () => {
            let bal;
            if ( of == 0)
                bal = parseInt($("#recordBalance b").html()) - parseInt($(`#${_id} .rec-amount`).text());
            else
                bal = parseInt($("#recordBalance b").html()) + parseInt($(`#${_id} .rec-amount`).text());
            $("#recordBalance b").html(bal);
            $("#" + _id).remove();
        });
    }
    $(".deleteAlert").css("display", "none");
    $("body > *:not(.c)").css("filter", "");
    if ($(".advocateRec").find(".tbody").length === 0)
        $("#noRecordShow1").css("display", "block");
    if ($(".clientRec").find(".tbody").length === 0)
        $("#noRecordShow2").css("display", "block");
});

$(".a").on("click", () => {
    justClose();
    $(".a").css("background-color", "#f1f3f4");
    $(".b").css("background-color", "");
    $(".clientRec").slideUp();
    $(".advocateRec").slideDown();
    $("html, body").animate({
        scrollTop: $(".recDisplay").offset().top
    }, 500);
});

$(".b").on("click", () => {
    justClose();
    $(".b").css("background-color", "#f1f3f4");
    $(".a").css("background-color", "");
    $(".advocateRec").slideUp();
    $(".clientRec").slideDown();
    $("html, body").animate({
        scrollTop: $(".recDisplay").offset().top
    }, 500);
});

function justClose() {
    $(".newRec").slideUp();
}

function justOpen(heading, value) {
    $(".newRec input[type='text'], .newRec textarea").val("");
    $("#paid-by").html(heading);
    $("#paid-by").attr('data-paid_by', value);
    $(".newRec").slideDown();
    $("html, body").animate({
        scrollTop: $(document).height()
    }, 500);
}

$(".advocateRec button").on("click", () => {
    justOpen("My expense", 0);
});

$(".clientRec button").on("click", () => {
    justOpen("Client Payment", 1);
});

$(".newRec img").on("click", () => {
    justClose();
});

$(".advocateRec, .clientRec").on("mouseenter", ".tbody", (e) => {
    if (!(window.matchMedia('(max-width: 768px)').matches))
        $($(e.target).parent()).find(".delete").show();
});

$(".advocateRec, .clientRec").on("mouseleave", ".tbody", (e) => {
    if (!(window.matchMedia('(max-width: 768px)').matches))
        $($(e.target).parent()).find(".delete").hide();
});

//document operations

function documentOperation(docName, docStatus, callback) {
    data = JSON.stringify({
        advocateId: $("#advocate-id").html(),
        clientId: parseInt($("#client-id").html()),
        caseId: parseInt($("#case-id").html())
    });
    $.ajax({
        url: '/client-data/document/' + data,
        type: "POST",
        data: {
            docName,
            docStatus
        },
        success: res => {
            console.log(res);
            callback();
        }
    });
}

function addNewDoc() {
    const id1 = "remDoc" + ($("#docList div").length + 1),
        id2 = "div" + ($("#docList div").length + 1),
        docName = $('#docList input'),
        newDoc = '<div class="m-2"><p style="display: inline-block" id=' + id2 + ' class="my-2 mx-lg-3" data-status="0"><img src="/images/arrow.png" class="mr-lg-5 mr-2">' + docName.val() + '</p><img id=' + id1 + ' class="removeDoc" src="/images/minus.png" alt="Remove"></div>'
    $("#docList input").before(newDoc);
    docName.val("");
}

function newDoc() {
    let docName = $("#docList input");
    if (docName.val() === "")
        docName.addClass("box-empty-red inline").after('<img src="/images/error.jpg" class="error-img mr-0" id="error" alt="Error">');
    else
        documentOperation(docName.val(), 2, addNewDoc);
}

$("#docList input").click((e) => {
    $(e.target).removeClass("box-empty-red inline");
    $("#error").remove();
});

$("#docList").on("click", "div p", (e) => {
    let target, status;
    if (e.target.nodeName === "IMG")
        target = $(e.target).parent();
    else
        target = $(e.target);
    status = target.attr("data-status");
    documentOperation($(target).text(), (status === "true" ? 0 : 1), () => updateDocStatus(target, status));
});

function updateDocStatus(target, status) {
    if (status === 'true') {
        $(target).attr("data-status", "false");
        $(target).find("img:last-child").remove();
    } else {
        $(target).attr("data-status", "true");
        $(target).append('<img class="check ml-2 mb-2" src="/images/check.png">');
    }
}

$("#docList").on("mouseenter", "div p", (e) => {
    const temp = e.target.id.slice(-1);
    if (!(window.matchMedia('(max-width: 768px)').matches))
        $("#remDoc" + temp).css("display", "inline");
});

$("#docList").on("mouseleave", "div", (e) => {
    if (e.target.nodeName === "DIV") {
        const temp = $(e.target).children("p").attr("id").slice(-1);
        if (!(window.matchMedia('(max-width: 768px)').matches))
            $("#remDoc" + temp).css("display", "none");
    }
});

$("#docList").on("click", ".removeDoc", (e) => {
    const temp = $(e.target).attr("id").slice(-1),
        docName = $("#div" + temp).text();
    documentOperation(docName, -1, () => $("#div" + temp).parent().remove());
});
