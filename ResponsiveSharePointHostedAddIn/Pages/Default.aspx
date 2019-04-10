<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <!-- CSS styles added to the following file -->

	<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"/>
    <link type="text/css" href="../Content/App.css" rel="Stylesheet"/>
    <link type="text/css" href="../Content/toastr.css" rel="stylesheet" />
    <link type="text/css" href="../Content/bootstrap.css" rel="stylesheet" />
    <link type="text/css" href="../Content/bootstrap-dialog.css" rel="stylesheet" />
    <link type="text/css" href="../Content/DataTables/css/select.bootstrap.min.css" rel="stylesheet" />
    <link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.8/css/jquery.dataTables.css"/>
     <!-- javascript references added to the following file -->
	<script src="../Scripts/moment.js"></script>
	<script src="../Scripts/daypilot-all.min.js"></script>
    <script type="text/javascript" src="../Scripts/jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap-dialog.js"></script>
    <script type="text/javascript" src="../Scripts/toastr.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/1.10.8/js/jquery.dataTables.min.js"></script>
	<script type="text/javascript"  src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script type="text/javascript" src="../Scripts/DataTables/dataTables.select.min.js"></script>
	<script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class="container-fluid">
	 <div class="row">
        <div id="toolbar" class="col-sm-12">
            <button type="button" value="Files" class="btn btn-info" id="spList" onclick="Javascript: location.href = '../Lists/SemesterList'">
                <span class='glyphicon glyphicon-upload'></span>
                SP List
            </button>
            <button type="button" class="btn btn-success" id="adNew" onclick='addNewFile();'>
                <span class='glyphicon glyphicon-plus'></span>
                Add New Vacation
            </button>
        </div>
   <p></p>
 <div id="FilesPanel"  class="col-sm-3">
   <table >
   <tr>
      <td>
         <div id="FilesGrid"></div>
      </td>
   </tr>
  </table>
 </div>
  <div id="dp"  class="col-sm-9"></div>
 </div>

 <!-- Bootstrap Modal Dialog-->
<div class="modal fade" id="myModalNorm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                       <span aria-hidden="true">&times;</span>
                       <span class="sr-only">Close</span>
                </button>
                <h4 class="modal-title" id="myModalLabel">
                    Add New vacation
                </h4>
            </div>
            <!-- Modal Body -->
            <div class="modal-body" id="modalBody">
                <form role="form" id="fileForm">
                  <div class="form-group">
                    <label>Assingned To</label>
                      <input class="form-control" id="assignedTo"/>
                  </div>
                  <div class="form-group">
                    <label>Start Date</label>
                      <input type="text" class="form-control" id="startDate"/>
                  </div>
                     <div class="form-group">
                    <label>End Date</label>
                      <input type="text" class="form-control" id="endDate"/>
                  </div>
                      <!-- hidden controls -->
                  <div style="display: none">
                      <input id="etag" />
                      <input id="fileId" />
					  <input type="text" id="assignedToH" class="form-control"/>
                  </div>
                  </form>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-danger" data-dismiss="modal" onclick='updateFormLabel();'>
                        Cancel
                      </button>
                      <button type="submit" class="btn btn-primary" id="fileFormSubmit">
                        Submit
                      </button>
                  </div>
            </div>
        </div>
    </div>
</div>
</div>
<script type="text/javascript" src="../Scripts/App.js"></script>
</asp:Content>
