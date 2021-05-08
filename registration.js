$('input').click(function(e){
    const q = $('.disable-sub-question');
    if(q.length == 0)
    return;


    const id = q.attr('data-id'), a = $(e.target), value = $("label[for="+a.attr('id')+"]").text();

    if(id == a.attr('name'))
    if(value == 'Yes'){
    $("div[data-main-question='"+id+"']").removeClass('disable-input');
    $("div[data-main-question='"+id+"'] input").prop('required', true);
    }
    else{
    $("div[data-main-question='"+id+"']").addClass('disable-input');
    $("div[data-main-question='"+id+"'] input").val('').removeAttr('required');
    }
    
});
