$(document).ready(function() {
    console.log('hello');
    const q = $('.disable-sub-question');
    if(q.length == 0)
    return;

    const id = q.attr('data-id');
    $(`div[data-main-question='${id}']`).addClass('disable-input');
});

$('input').click(function(e){
    console.log('input');
    const q = $('.disable-sub-question');
    if(q.length == 0)
    return;


    const id = q.attr('data-id'), a = $(e.target), value = $(`label[for=${a.attr('id')}]`).text();

    if(id == a.attr('name'))
    if(value == 'Yes')
    $(`div[data-main-question='${id}']`).removeClass('disable-input');
    else{
    $(`div[data-main-question='${id}']`).addClass('disable-input');
    $(`div[data-main-question='${id}'] input`).val('')}
    
});
