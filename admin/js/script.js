/*global $*/

// READ recods on page load
$(document).ready(function () {
    readRecords(); // calling function
});

// READ records
function readRecords(){
    $.get("/associations", {}, function (data, status) {
        data.forEach(function(value){
            var row= '<tr id="row_id_'+ value.id +'">'
                         + displayColumns(value)
                         + '</tr>';
            $('#associations').append(row);
        });
    });
}


function displayColumns(value) {
    return 	'<td>'+value.id+'</td>'
            + '<td class="nr_apt">'+value.nr_apt+'</td>'
			+ '<td class="name">'+ value.name+ '</td>'
			+ '<td class="surname">'+ value.surname +'</td>'
			+ '<td class="number of people">'+ value.number_of_people +'</td>'
			+ '<td align="center">'
			+	'<button onclick="viewRecord('+ value.id +')" class="btn btn-edit">Update</button>'
			+ '</td>'
			+ '<td align="center">'
			+	'<button onclick="deleteRecord('+ value.id +')" class="btn btn-danger">Exclude</button>'
			+ '</td>';
}

//show the modal window
function addRecord() {
    $('#nr_apt').val('');
    $('#name').val('');
    $('#nurname').val('');
    $('#number_of_people').val('');
    
    
    $('#myModalLabel').html('Add New Product');
    $('#add_new_record_modal').modal('show');
}
//get one record
function viewRecord(id) {
    var url = "/associations/" + id;
    
    $.get(url, {}, function (data, status) {
        //bind the values to the form fields
        $('#nr_apt').val(data.nr_apt);
        $('#name').val(data.name);
        $('#surname').val(data.surname);
        $('#number_of_people').val(data.number_of_people);
        
        $('#id').val(id);
        $('#myModalLabel').html('Edit List');
        
        $('#add_new_record_modal').modal('show');
    });
}

//create and update records
function saveRecord() {
    var formData = $('#record_form').serializeObject();
    if(formData.id) {
        updateRecord(formData);
    } else {
        createRecord(formData);
    }
}

function createRecord(formData) {
    $.ajax({
        url: '/associations/',
        type: 'POST',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#add_new_record_modal').modal('hide');
            
            var row = '<tr id="row_id_'+ data.id +'">'
            			+ displayColumns(data)
        				+ '</tr>';
            $('#associations').append(row);
        } 
    });
}

function updateRecord(formData) {
    $.ajax({
        url: '/associations/'+formData.id,
        type: 'PUT',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#row_id_'+formData.id+'>td.nr_apt').html(formData.nr_apt);
            $('#row_id_'+formData.id+'>td.name').html(formData.name);
            $('#row_id_'+formData.id+'>td.surname').html(formData.surname);
            $('#row_id_'+formData.id+'>td.number_of_people').html(formData.number_of_people);
            $('#add_new_record_modal').modal('hide');
        } 
    });
}

//delete record
function deleteRecord(id) {
    $.ajax({
        url: '/associations/'+id,
        type: 'DELETE',
        success: function(data) {
            $('#row_id_'+id).remove();
        }
    });
}

//extending jQuery with a serializeObject method so that form values can be retrieved as JSON objects
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

