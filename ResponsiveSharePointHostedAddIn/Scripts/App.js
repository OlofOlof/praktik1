'use strict';
var RestUrl = "../_api/lists/getbytitle('SemesterList')/items?$select=ID,EndDate,StartDate,AssignedId,AssignedTo/Title,AssignedTo/Id&$expand=AssignedTo/Title";
var tableContent;
var e = [];
$(document).ready(function () {
	getCurrentGroupId();
	PopulateGrid();
	loading();
	$('#fileFormSubmit').click(function (e) {
		//Check for edit or new and call update or add function
		if ($('#myModalLabel').html() === 'Add New Vacation') {
			addFile($('#assignedToH').val(), $('#startDate').val(), $('#endDate').val());
		} else {
			UpdateFiles($('#fileId').val());
		}
	});
});
function PopulateGrid() {
	//Clear datatables
	$('#FilesGrid').empty();
	//Get File list items
	$.ajax({
		url: RestUrl,
		method: "GET",
		headers: {
			"accept": "application/json;odata=verbose"
		},
		success: function (data) {
			if (data.d.results.length > 0) {
				//construct HTML Table from the JSON Data
				$('#FilesGrid').append(GenerateTableFromJson(data.d.results));
				//Bind the HTML data with Jquery DataTable
				var oTable = $('#FilesTable').dataTable({
					//control which datatable options available
					dom: 'Bfrltip',
					//add select functionality to datatable
					select: true,
					//adjust column widths
					"columns": [
						null,
						null,
						null,
						null,
						null,

						{ "width": "8%" }
					],
					//remove sort icon from actions column
					"aoColumnDefs": [
						{ "bSortable": false, "aTargets": [5] }
					]
				});
			} else {
				$('#FilesGrid').append("<span>No Files Found.</span>");
			}
		},
		error: function (data) {
			$('#FilesGrid').append("<span>Error Retreiving Item. Error : " + JSON.stringify(data) + "</span>");
		}
	});
}
//Generate html table values
function GenerateTableFromJson(objArray) {
	tableContent =
		'<table id="FilesTable" class="table table-striped table-bordered" cellspacing="0" width="100%">' +
		'<thead><tr>' + '<th>ID</th>' + '<th>Assingnet To</th>' + '<th>Start Date</th>' + '<th>End Date</th>' +
		'<th id="idShow1">Assigned Id</th>' + '<th>Actions</th>' + '</tr></thead>';
	for (var i = 0; i < objArray.length; i++) {
		var timeEndDate = objArray[i].EndDate;
		var lastEditEndDate = timeEndDate.substring(0, timeEndDate.indexOf('T'));
		var timeStartDate = objArray[i].StartDate;
		var lastEditStartDate = timeStartDate.substring(0, timeStartDate.indexOf('T'));
		tableContent += '<tr>';
		tableContent += '<td>' + objArray[i].Id + '</td>';
		tableContent += '<td>' + objArray[i].AssignedTo.Title + '</td>';
		tableContent += '<td>' + lastEditStartDate + '</td>';
		tableContent += '<td>' + lastEditEndDate + '</td>';
		tableContent += '<td id="idShow">' + objArray[i].AssignedId + '</td >';
		//console.log(objArray[i].AssignedId + '</td>')
		tableContent += "<td><a id='" + objArray[i].Id + "' href='#' style='color: orange' class='confirmEditFileLink'>" +
			"<i class='glyphicon glyphicon-pencil' title='Edit Item'></i></a>&nbsp&nbsp";
		tableContent += "<a id='" + objArray[i].Id + "' href='#' style='color: red' class='confirmDeleteFileLink'>" +
			"<i class='glyphicon glyphicon-remove' title='Delete File'></i></a>&nbsp&nbsp";
		tableContent += "<a id='" + objArray[i].Id + "' href='#' class='confirmListItemDetailsLink'>" +
			"<i class='glyphicon glyphicon-cog' title='Link to List Item'></i></a></td>";
		tableContent += '</tr>';
		e.push({ start: lastEditStartDate, end: lastEditEndDate, resource: objArray[i].AssignedId.toString(), text: objArray[i].AssignedTo.Title });
	}
	return tableContent;
}
// Edit button click event
$(document).on('click', '.confirmEditFileLink', function (e) {
	e.preventDefault();
	var id = this.id;
	var requestUri = "../_api/web/lists/getByTitle('SemesterList')/items(" + id + ")";
	$.ajax({
		url: requestUri,
		method: "GET",
		contentType: "application/json;odata=verbose",
		headers: { "accept": "application/json;odata=verbose" },
		success: function (data) {
			function editStartDate() {
				return data.d.StartDate;
			}
			editStartDate();
			var timeStartDate = editStartDate();
			var lastEditStartDate = timeStartDate.substring(0, timeStartDate.indexOf('T'));
			function editEndDate() {
				return data.d.EndDate;
			}
			editEndDate();
			var timeEndDate = editEndDate();
			var lastEditEndDate = timeEndDate.substring(0, timeEndDate.indexOf('T'));

			$('#assignedToH').val(data.d.AssignedToId);
			$('#startDate').val(lastEditStartDate);
			$('#endDate').val(lastEditEndDate);
			$('#fileId').val(data.d.Id);
			$('#myModalLabel').html('Edit Item');
			$('#myModalNorm').modal('show');
			$("#etag").val(data.d.__metadata.etag);
		}
	});
});
//Assigned to Edit button click event
$(document).on('click', '.confirmEditFileLink', function (e) {
	e.preventDefault();
	var id = this.id;
	var requestUri = "../_api/web/lists/getByTitle('SemesterList')/items(" + id + ")?$select=ID,EndDate,StartDate,AssignedTo/Title,AssignedTo/Id&$expand=AssignedTo/Title";
	$.ajax({
		url: requestUri,
		method: "GET",
		contentType: "application/json;odata=verbose",
		headers: { "accept": "application/json;odata=verbose" },
		success: function (data) {
			$('#assignedTo').val(data.d.AssignedTo.Title);
		}
	});
});
//Link to files list item
$(document).on('click', '.confirmListItemDetailsLink', function (e) {
	e.preventDefault();
	var id = this.id;
	var requestUri = "../Lists/SemesterList/DispForm.aspx?ID=" + id;
	window.location.href = requestUri;
});
// Delete button click event
$(document).on('click', '.confirmDeleteFileLink', function (e) {
	e.preventDefault();
	var id = this.id;
	BootstrapDialog.show({
		size: BootstrapDialog.SIZE_SMALL,
		type: BootstrapDialog.TYPE_DANGER,
		title: "Delete confirmation",
		message: "Are you sure you want to Delete this Item?",
		buttons: [
			{
				label: "Confirm",
				cssClass: 'btn-primary',
				action: function (dialog) {
					dialog.close();
					var restUrl = "../_api/web/lists/GetByTitle('SemesterList')/items(" + id + ")";
					jQuery.ajax({
						url: restUrl,
						type: "DELETE",
						headers: {
							Accept: "application/json;odata=verbose",
							"X-RequestDigest": $("#__REQUESTDIGEST").val(),
							"IF-MATCH": "*"
						}
					});
					toastr.success("Successfully Deleted.", "Success");
					PopulateGrid();
					location.reload();
				}
			},
			{
				label: "Cancel",
				action: function (dialog) {
					dialog.close();
				}
			}
		]
	});
});
//Update Model Label
function updateFormLabel() {
	$('#myModalLabel').html('Add New Vacation');
}
//Populate then display model dialog for add file button clicked
function addNewFile() {
	$('#myModalLabel').html('Add New Vacation');
	$('#assignedToH').val('');
	$('#startDate').val('');
	$('#endDate').val('');
	$('#fileId').val('');
	$('#myModalNorm').modal('show');
}
//Edit item function
function UpdateFiles(id) {
	var assignedTo = $("#assignedToH").val();
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var eTag = $("#etag").val();
	var requestUri = "../_api/web/lists/getByTitle('SemesterList')/items(" + id + ")";
	var requestHeaders = {
		"accept": "application/json;odata=verbose",
		"X-HTTP-Method": "MERGE",
		"X-RequestDigest": $('#__REQUESTDIGEST').val(),
		"If-Match": eTag
	};
	var fileData = {
		__metadata: { "type": "SP.Data.SemesterListListItem" },
		AssignedToId: assignedTo,
		StartDate: startDate,
		EndDate: endDate

	};
	var requestBody = JSON.stringify(fileData);

	return $.ajax({
		url: requestUri,
		type: "POST",
		contentType: "application/json;odata=verbose",
		headers: requestHeaders,
		data: requestBody
	});
}
//Add File function
var addFile = function (assignedTo, startDate, endDate) {
	var requestUri = "../_api/web/lists/getByTitle('SemesterList')/items";
	var requestHeaders = {
		"accept": "application/json;odata=verbose",
		"content-type": "application/json;odata=verbose",
		"X-RequestDigest": $('#__REQUESTDIGEST').val(),
		'If-Match': '*',// --> Use an etag value if you want to ensure consistency
		'X-HttpMethod': 'POST' //
	};
	var fileData = {
		__metadata: { "type": "SP.Data.SemesterListListItem" },
		AssignedToId: assignedTo,
		StartDate: startDate,
		EndDate: endDate,
		AssignedId: assignedTo
	};
	var requestBody = JSON.stringify(fileData);
	return $.ajax({
		url: requestUri,
		type: "POST",
		headers: requestHeaders,
		data: requestBody
	});

};
$(function () {
	$("#startDate").datepicker();
});
$(function () {
	$("#endDate").datepicker();
});
//Assigne To Function
var hostweburl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
var appweburl =
	decodeURIComponent(
		getQueryStringParameter("SPAppWebUrl")
	);
function getQueryStringParameter(paramToRetrieve) {
	var params = document.URL.split("?")[1].split("&");
	var strParams = "";
	for (var i = 0; i < params.length; i = i + 1) {
		var singleParam = params[i].split("=");
		if (singleParam[0] === paramToRetrieve)
			return singleParam[1];
	}
}
function getCurrentGroupId() {
	var scriptbase = hostweburl + "/_layouts/15/";
	// Load the js files and continue to the successHandler
	$.getScript(scriptbase + "SP.RequestExecutor.js", function () { execCrossDomainRequestIdFromUri(); });
}
var toDay = moment().format();
var shortToday = toDay.substring(0, toDay.indexOf('T'));
var users = [];
function execCrossDomainRequestIdFromUri() {
	var executor = new SP.RequestExecutor(appweburl);
	executor.executeAsync(
		{
			url: appweburl + "/_api/SP.AppContextSite(@target)/web/siteusers?@target='" + hostweburl + "'",
			method: "GET",
			headers: { "Accept": "application/json; odata=verbose" },
			success: function (data) {
				var jsonObject = JSON.parse(data.body);
				var allResults = jsonObject.d.results;
				users;
				users.push({
					name: "Personal", id: "G1", expanded: true, children: []
				});
				for (var i = 0; i < allResults.length; i++) {
					var id = allResults[i].Id;
					var idString = id.toString();
					users[0].children.push({ name: allResults[i].Title, id: idString });
				}
				var usersObject1 = [];
				for (var j = 0; j < allResults.length; j++) {
					usersObject1.push({ label: allResults[j].Title, value: allResults[j].Id });
				}
				$("#assignedTo").autocomplete({
					source: usersObject1,
					minLength: 3,
					select: function (event, ui) {
						event.preventDefault();
						$("#assignedTo").val(ui.item.label);
						$("#assignedToH").val(ui.item.value);

					},
					focus: function (event, ui) {
						event.preventDefault();
						$("#assignedTo").val(ui.item.label);
					}

				});
			},
			error: function () {
			}
		});
}
function loading() {
	setTimeout(function () {
		var dp = new DayPilot.Scheduler("dp");
		dp.startDate = shortToday;
		dp.days = 366;
		dp.scale = "Day";
		dp.resources = users;
		dp.timeHeaders = [
			{ groupBy: "Month", format: "MMM yyyy" },
			{ groupBy: "Cell", format: "d" }
		];
		dp.treeEnabled = true;
		dp.events.list = [];
		for (var i = 0; i < e.length; i++) {
			dp.events.list.push(e[i]);
		}

		dp.onBeforeEventRender = function (args) {
			args.data.bubbleHtml = "<div><b>" + args.data.text + "</b></div><div>Start: " + new DayPilot.Date(args.data.start).toString("yyyy/M/d") + "</div><div>End: " + new DayPilot.Date(args.data.end).toString("yyyy/M/d") + "</div>";
		};
		dp.init();
		$(".scheduler_default_corner").css({
			"background": "rgb(243, 243, 243)", "font-size": "24px", "text-align": "-webkit-center"
		});
		$(".scheduler_default_corner").html("Semester List");
	}, 1000);
}

