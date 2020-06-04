$(document).ready(() => {
    radioButtons()
})
const admin = 4

function toggleFilters(){
    let filters = $('#searchFilters')
    if($(filters).hasClass('hidden')){
        $(filters).removeClass('hidden')
    }else{
        $(filters).addClass('hidden')
    }
}



function radioButtons(){
    let fields = {
        'rg' : 'Rg',
        'contact' : 'Contato',
        'name' : 'Nome',
        'adress' : 'Endereço',
        'org': 'Org',
        'friends' : 'Afiliação',
        'others' : 'Outros',
        'plates.plate_number' : 'Placa',
        'plates.plate_description' : 'Carro'
    }

    let div = $('#searchFilters')
    Object.keys(fields).forEach(
        element => {
           let label = document.createElement('label')
           let input = document.createElement('input')
           input.setAttribute('type', 'radio')
           input.setAttribute('name', 'field')
           input.setAttribute('value', element)
           $(label).append(input)
           let inner = $(label).html() 
           $(label).html( inner + fields[element])
           $(div).append(label)
        }
    )
}

function showParcial(element){
    let result_info = $(element).siblings('.result_info')
    $(result_info).hasClass('hidden')? 
    result_info.removeClass('hidden') 
    : result_info.addClass('hidden')
}

function clearResults(){
    $('.result').remove()
}

function createResult(object){
    let results = $('#searchResults')
    let template = $('#result_template')[0]
    let clone = template.content.cloneNode(true)
    $(clone).find('.rg').text(object.rg || '-')
    $(clone).find('.name').text(object.name || '-')
    $(clone).find('.contact').text(object.contact || '-')
    $(clone).find('.org').text(object.org || '-')
    $(clone).find('.profile_link').attr('id', object._id)
    $(clone).find('.result_img').attr('src', object.avatar_url)
    $(results).append(clone)
}

function noResults(){
    // verificar se existem resultados (.result)
    // caso não haja e no_results estiver oculto, remover a classe hidden.
    // caso haja, adicionar a classe hidden a no_results.
    let hasResults = $('.result').length > 0 ? true : false
    let no_results_hidden = $('#no_results').hasClass('hidden')
    if(!hasResults && no_results_hidden){
        return $('#no_results').removeClass('hidden')
    }else if(hasResults && !no_results_hidden){
        return $('#no_results').addClass('hidden')
    }
}

function createPerson(){
    clearPage('profileEdit')
    $('#profileEdit').find('.voltar').attr('onclick', 'showPage("search")')
    $('#profileEdit').find('.cancel').attr('onclick', 'showPage("search")')
    $('#profileEdit').find('.save').removeAttr('id')
    $('#profileEdit').find('.delete').addClass('hidden')
    showPage('profileEdit')
}

function showPage(page){
    $('.page').addClass('hidden')
    $(`.page.${page}`).removeClass('hidden')
}

// createResult({rg : '1', avatar : 'https://image.prntscr.com/image/Mp0D-nUOQpyXiyloAKfdgg.png', name : 'Jorge', contact : '2', org : 'SAMU', id : '123456'})

// working.
// const Url = 'http://localhost:3333/people';
// $.ajax({
//     url : Url,
//     type : "GET",
//     success : function(result){
//         console.log(result[0].name)
//     },
//     error : (error) => {
//         console.log(error)
//     }
// })
//

const Urls = {
    create : { 
        Url : 'http://localhost:3333/people',
        type : 'POST'
    },
    list : { 
        Url : 'http://localhost:3333/people',
        type : 'GET'
    },
    find : { 
        Url : 'http://localhost:3333/search', 
        type : 'GET'
    },
    findinField : { 
        Url : 'http://localhost:3333/searchField',
        type : 'GET'
    },
    getById :{
        Url : 'http://localhost:3333/getById',
        type : 'GET'
    },
    update :{
        Url : 'http://localhost:3333/updateOrAdd',
        type : 'POST',
        dataType : 'json',
        contentType: "application/json"
    },
    delete :{
        Url : 'http://localhost:3333/delete',
        type : 'POST',
        dataType : 'json',
        contentType: "application/json"
    },
    login : {
        Url : 'http://localhost:3333/login',
        type : 'POST',
        dataType : 'json',
        contentType: "application/json"
    },
    check : {
        Url : 'http://localhost:3333/check',
        type : 'GET',
        dataType : 'json',
        contentType: "application/json"
    }
}
function request(route, callbackFunction, errorMessage, data = null){
    if(route.dataType == 'json'){
        data = JSON.stringify(data)
    }
    $.ajax({
        url : route.Url,
        type : route.type,
        data : data,
        dataType : route.dataType,
        contentType : route.contentType,
        processData : route.processData,
        success : (result) => {
            callbackFunction(result)
        },
        error : (error) => {
            
            errorMessage(error)
        },
        headers : {
            "x-access-token" : sessionStorage.getItem('token')
        }
    })
}

function populateResults(results){
    if(results && results.length > 0){
        clearResults()
        results.forEach( result => {
            createResult(result)
        })
        noResults()
    }else{        
        clearResults()
        noResults()
    }
}

function httpError(error){
    console.log(error)
    if(!error.loggedIn){
        showPage('login')
    }else{
        console.log('Erro:', error.message)
    }
}


/*
=============================================================================
=============================================================================
Create/edit screen
=============================================================================
=============================================================================
*/
function deletePlate(element){
    $($(element).parent()).remove()
}

function newPlate(){
    var div = $('#profileEdit').find('.plates_container')
    var temp = $('#profileEdit').find('.template_plate')[0]
    var clone = temp.content.cloneNode(true)
    $(clone).find('.placa').val('')
    $(clone).find('.descricao').val('')
    $(div).prepend(clone)
}



function newImage(){
    var div = $('#profileEdit').find('.image_container')
    var temp = $('#profileEdit').find('.template_image')[0]
    var clone = temp.content.cloneNode(true)
    $(div).append(clone)
}

function deleteImage(element){
    $($(element).parent()).remove()
}

function save(id = null){
    let newFolder = $('#profileEdit')
    let name = $(newFolder).find('.name').val() || null
    let rg = $(newFolder).find('.rg').val() || null
    let contact = $(newFolder).find('.contact').val() || null
    if(!name && !rg && !contact) return alert('Você precisa preencher ao menos um dos seguintes campos: Nome, RG, Contato')
    let person = {}
    person.name = name
    person.rg = rg
    person.contact = contact
    person.org = $(newFolder).find('.org').val()
    person.avatar_url = $(newFolder).find('.avatar').val()
    person.adress = $(newFolder).find('.adress').val()

    let friends = $('.friends_info textarea').val() || ''
    friends = friends.split('\n').map(element => element.trim())
    
    let others = $('.others_info textarea').val() || ''
    others = others.split('\n').map(element => element.trim())
    person.friends = friends
    person.others = others

    let plates = []
    let placas = Array.from($('.item_placa'))
    if(placas.length > 0){
        placas.forEach(element => {
            let _placa = {'plate_number': $(element).find('.placa').val().trim(), 'plate_description': $(element).find('.descricao').val().trim()}
            plates.push(_placa)
        })
    }
    person.plates = plates
    let images = [] 
    let images_ = Array.from($('#profileEdit').find('.item_image'))

    if(images_.length > 0){
        images_.forEach(element => {
            let image = [$(element).find('.img_link').val(), $(element).find('.img_description').val()]
            images.push([...image])
        })
    }
    person.images = images

    if(id){
        person._id = id
        updatePerson(person)
    }else{
        createAddPerson(person)
    }
}


function updatePerson(data){
    // validate
    
    // s["data"] = JSON.stringify(data)
    request(Urls.update, showProfile, httpError, data)
}

function createAddPerson(data){
    // validate
    request(Urls.update, showNewProfile, httpError, data)
}


function clearSpace(element){
    let withoutSpace = $(element).val().replace(/\s/g, '')
    $(element).val(withoutSpace) 
}

/*
=============================================================================
=============================================================================
Populate Fields
=============================================================================
=============================================================================
*/

function populateImages(array, page){
    var div = $(`#${page}`).find('.image_container')
    var temp = $(`#${page}`).find('.template_image')[0]
    array.forEach( image => {
        var clone = temp.content.cloneNode(true)
        let link = image[0]
        let description = image[1]
        if(page !== 'profile'){
            $(clone).find('.img_link').val(link)
            $(clone).find('.img_description').val(description)
            $(clone).find('.img_show').attr('src', link)
        }else{
            $(clone).find('.img_description').text(description)
            $(clone).find('.img_show').attr('src', link)
        }
        $(div).append(clone)
    })
}

function populatePlates(array, page){
    var div = $(`#${page}`).find('.plates_container')
    var temp = $(`#${page}`).find('.template_plate')[0]
    array.forEach(key => {
        var clone = temp.content.cloneNode(true)
        if(page == 'profile'){
            $(clone).find('.placa').text(key.plate_number)
            $(clone).find('.descricao').text(key.plate_description)
        }else{
            $(clone).find('.placa').val(key.plate_number)
            $(clone).find('.descricao').val(key.plate_description)
        }
        $(div).append(clone)
    })
}

function populateBasic(data, page){
    $(`#${page}`).find('.info.name').text(data.name)
    $(`#${page}`).find('.info.name').val(data.name)
    $(`#${page}`).find('.info.rg').text(data.rg)
    $(`#${page}`).find('.info.rg').val(data.rg)
    $(`#${page}`).find('.info.contact').text(data.contact)
    $(`#${page}`).find('.info.contact').val(data.contact)
    $(`#${page}`).find('.info.org').text(data.org)
    $(`#${page}`).find('.info.org').val(data.org)
    $(`#${page}`).find('.info.adress').text(data.adress)
    $(`#${page}`).find('.info.adress').val(data.adress)
    $(`#${page}`).find('.info.avatar').val(data.avatar_url)
    $(`#${page}`).find('.person_pic').attr('src', data.avatar_url)
}

function populate_array(array, field, page){
    var div = $(`#${page}`).find(`.${field}_info`)
    if(page !== 'profile'){
        var text = ''
        array.forEach(line => {
            text += `${line}\n`
        })
        $(div).find('textarea').val(text)
    }else{
        var container = document.createElement('div')
        $(container).addClass('label_container')
        array.forEach(line => {
            var label = document.createElement('label')
            $(label).text(line)
            $(container).append(label)
        })
        $(div).append(container)
    }
}

function populatePage(data,page){
    clearPage(page)
    if(!data){
        clearResults()
        return noResults()
    }
    const {rg = '',name = '',contact = '',org= '', adress = '', avatar_url= 'https://i.imgur.com/5MVu5DZ.jpg',plates = [{}],images = [],friends = [], others = []} = data
    $(`#${page}`).find('.edit').attr('id', data._id)
    $(`#${page}`).find('.cancel').attr('id', data._id)
    $(`#${page}`).find('.voltar').attr('id', data._id)
    $(`#${page}`).find('.delete').attr('id', data._id)
    $(`#${page}`).find('.delete').removeClass('hidden')
    $(`#${page}`).find('.save').attr('id', data._id)
    populateBasic({rg,name,contact,org,avatar_url, adress}, page)
    populatePlates(plates, page)
    populateImages(images, page)
    populate_array(friends,'friends', page)
    populate_array(others,'others', page)
}


/*
=============================================================================
=============================================================================
Clear Fields
=============================================================================
=============================================================================
*/

function clearBasic(page){
    $(`#${page}`).find('.info.name').text('')
    $(`#${page}`).find('.info.name').val('')
    $(`#${page}`).find('.info.rg').text('')
    $(`#${page}`).find('.info.rg').val('')
    $(`#${page}`).find('.info.contact').text('')
    $(`#${page}`).find('.info.contact').val('')
    $(`#${page}`).find('.info.org').text('')
    $(`#${page}`).find('.info.org').val('')
    $(`#${page}`).find('.info.avatar').val('')
}

function clearMore(page){
    $(`#${page}`).find('.others_info textarea').val('')
    $(`#${page}`).find('.friends_info textarea').val('')
    $(`#${page}`).find('.plates_container').children().remove()
    $(`#${page}`).find('.image_container').children().remove()
    $(`#${page}`).find('.friends_info .label_container label').not('.title').remove()
    $(`#${page}`).find('.label_container label').remove()
    $(`#${page}`).find('.label_container label').remove()
}

function clearPage(page){
    clearBasic(page)
    clearMore(page)
}

function backTo(page, before){
    showPage(page)
    clearPage(before)
}
/*
=============================================================================
=============================================================================
Requests and handling response
=============================================================================
=============================================================================
*/

function getProfile(id, page){
    if(page == 'profile'){
        request(Urls.getById, showProfile, httpError, {id})
    }else{
        // request(Urls.getById, validate, editProfile, httpError, {id})
        request(Urls.getById, editProfile, httpError, {id})
    }
}

function showProfile(profile){
    clearPage('profile')
    populatePage(profile, 'profile')
    $('#profile').find(".voltar").attr('onclick', 'showPage("search")')
    if(sessionStorage.getItem('access_level') < admin){
        $('#profile').find('.edit').addClass('hidden')
    }
    showPage('profile')
    //get the $('.result').attr('id)
    //ask for the specific id to the database
    //loads another screen
}
function showNewProfile(profile){
    clearPage('profile')
    populatePage(profile, 'profile')
    $('#profile').find(".voltar").attr('onclick', 're_search()')
    showPage('profile')
}

function editProfile(array){
    let profile = array
    clearPage('profileEdit')
    populatePage(profile, 'profileEdit')
    $('#profileEdit').find('.voltar').attr('onclick', 'getProfile(this.id, "profile")')
    $('#profileEdit').find('.cancel').attr('onclick', 'getProfile(this.id, "profile")')
    showPage('profileEdit')
    //get the $('.result').attr('id)
    //ask for the specific id to the database
    //loads another screen
}

function deleteProfile(id){
    if (window.confirm('Deseja realmente deletar este perfil?')){
    // delete profile with this id
    // delete
    let data = {_id : id, "term": last_search.term, "field" : last_search.field}
    request(Urls.delete, re_search, httpError, data)
    // They clicked Yes
    }else{
    alert('cancelado')
    // They clicked no
    }
}

let last_search = {}
function search(){
    let field = $("input[type='radio']:checked").val()
    let term = $("#searchBar").val()
    last_search = {field, term}
    if(field){
        request(Urls.findinField, populateResults, httpError, {term, field})
    }else{
        request(Urls.find, populateResults, httpError, {term})
    }
    // end
    $('#mainDiv').addClass('searched')
    $("input[type='radio']:checked").prop('checked', false)
    $("#searchBar").val('')
    $('#searchFilters').addClass('hidden')
}

function re_search(){
    let field = last_search.field
    let term = last_search.term
    if(field){
        request(Urls.findinField, populateResults, httpError, {term, field})
    }else{
        request(Urls.find, populateResults, httpError, {term})
    }
    // end
    $('#mainDiv').addClass('searched')
    $("input[type='radio']:checked").prop('checked', false)
    $("#searchBar").val('')
    $('#searchFilters').addClass('hidden')
    showPage('search')
}




/*
=============================================================================
=============================================================================
Login System
=============================================================================
=============================================================================
*/

function loginError(){
    $('#loginBox').find('#loginError').removeClass('hidden')
}

function clearErrorLogin(){
    $('#loginBox').find('#loginError').addClass('hidden')
}

function clearLoginInputs(){
    $('#usernameInput').val('')
    $('#passwordInput').val('')
}

function login(){
    clearErrorLogin()
    const username = $('#usernameInput').val()
    const password = $('#passwordInput').val()
    if(!username || !password){
        return loginError()
    }
    request(Urls.login, (response) => {
        sessionStorage.setItem('token', response.token)
        sessionStorage.setItem('access_level', response.level)
        showPage('search')
    } , loginError, {username, password})
}


showPage('search')