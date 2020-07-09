var userTable = "";
var cDTable = "";
var membershipTable = "";
$(function () {

    eventHandler();
    getCDType();
    getMembershipType();
    addValidation();
    restrictDate();
});

function eventHandler() {
    //Home Button
    $("#Home").click(function (e) {
        e.preventDefault();
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        $("#HomeSection").show();
        $("#CDSection").hide();
        $("#UserSection").hide();
        $("#cdViewSection").hide();
        $("#usrViewSection").hide();
        $("#MembershipSection").hide();
        emptyTextBoxes();
    });
    //CD Section    
    $("#CD").click(function (e) {
        e.preventDefault();
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        $("#CDSection").show();
        $("#HomeSection").hide();
        $("#UserSection").hide();
        $("#cdViewSection").hide();
        $("#usrViewSection").hide();
        $("#MembershipSection").hide();
        displayCDData();
    });
    //User Section
    $("#Customer").click(function (e) {
        e.preventDefault();
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        $("#UserSection").show();
        $("#CDSection").hide();
        $("#HomeSection").hide();
        $("#cdViewSection").hide();
        $("#usrViewSection").hide();
        $("#MembershipSection").hide();
        displayUserData();
        emptyTextBoxes();
    });
    //Membership Section
    $("#MembershipRequest").click(function (e) {
        e.preventDefault();
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        $("#HomeSection").hide();
        $("#CDSection").hide();
        $("#cdViewSection").hide();
        $("#UserSection").hide();
        $("#usrViewSection").hide();
        $("#MembershipSection").show();
        displayRequestedMembership();
        emptyTextBoxes();
    });
    //User Registration Button
    $("#userRegisterBtn").click(function (e) {
        e.preventDefault();
        var id = $("#userHdInput").val();
        var name = $("#uName").val().trim();
        var email = $("#uEmail").val().trim();
        var pass = $("#uPassword").val();
        var phone = $("#uPhone").val().trim();
        var dob = $("#uDOB").val().trim();
        var address = $("#uAddress").val().trim();
        var membershipTypeId = $("#MembershipType").val();
        var userObj = {
            Id: id,
            Name: name,
            Email: email,
            Password: pass,
            Phone: phone,
            DOB: dob,
            Address: address
        }

        addEditUser(userObj, membershipTypeId);
    });
    //
    $("#CDType").change(function () {
        var value = $(this).val();
        if (value == 1 || value == 3) {
            $("#musicType").show();
            $("#gameType").hide();
            $('#gameMode').val("");
            $('#developer').val("");

            $('#CDType').css('border', '1px solid #ced4da');
            $('#errorCDtype').text("");
        } else if (value == 2) {
            $("#gameType").show();
            $("#musicType").hide();
            $('#artist').val("");
            $('#composer').val("");
            $('#language').val("");
            $('#CDType').css('border', '1px solid #ced4da');
            $('#errorCDtype').text("");
        } else {
            $("#gameType").hide();
            $("#musicType").hide();
            $('#CDType').css('border', '2px solid red');
            $('#errorCDtype').text("Please Select an CD Type.").css('color', 'red');
        }
    });
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    $("#MembershipType").change(function () {
        var value = $(this).val();
        var cost = $('option:selected', this).attr("cost");
        if (value == 1) {
            $("#memCost").show();
            $("#uCost").val(cost);
        } else {
            $("#memCost").hide();
        }
    });
    $("#cdRegisterBtn").click(function (e) {
        e.preventDefault();
        var id = $("#cdHdInput").val();
        var title = $("#title").val();
        var publisher = $("#publisher").val();
        var genre = $("#genre").val();

        var type = $("#CDType").val();
        var mode = $("#gameMode").val();
        var developer = $("#developer").val();
        var artist = $("#artist").val();
        var composer = $("#composer").val();
        var language = $("#language").val();
        var cost = $("#cost").val();
        var totalCD = $("#totalCD").val();

        var cdObj = {
            Id: id,
            Title: title,
            Publisher: publisher,
            Genre: genre,
            //Image: image,
            CDTypeId: type,
            GameMode: mode,
            Developer: developer,
            Artist: artist,
            Composer: composer,
            Language: language,
            Cost: cost,
            TotalCD: totalCD
        }
        addEditCD(cdObj);
    });
    $('#addUsrBtn, #addCDBtn').click(function (e) {
        e.preventDefault();
        $("#passSection").show();
        emptyTextBoxes();
    });

    $('#adminLogOut').click(function (e) {
        e.preventDefault();
        logoutUser();
    });

    userTableHandler();
    cdTableHandler();
    MemberShipEventHandler();
}
function displayCDData() {

    cDTable = $("#CDTable").DataTable({
        "bServerSide": true,
        "filter": true,
        "orderMulti": false,
        "destroy": true,
        "bAutoWidth": true,
        "ordering": true,
        "ajax": {
            "url": '/cd/getCDData',
            "DataProp": "data"
            //success: function (result) {
            //    console.log(result);
            //    }
        },
        "bProcessing": true,
        "aoColumns": [
            { "data": "Title", "name": "Title" },
            { "data": "Publisher", "name": "Publisher" },
            { "data": "Genre", "name": "Genre" },
            { "data": "Type", "name": "Type" },
            { "data": "Cost", "name": "Cost" },
            {
                "data": "Id",
                render: function (data) {

                    return "<span data-cd-id=" + data + " class='js-cd-edit mr-2'><i class=' far fa-edit'></i></span>"
                        + "<span data-cd-id=" + data + " class='js-cd-view mr-2'><i class='far fa-eye'></i></span>"
                        + "<span data-cd-id=" + data + " class='js-cd-delete'><i class=' fas fa-trash-alt'></i></span>";
                }
            }
        ]
    });

}
function cdTableHandler() {


    $('#CDTable').off().on('click', '.js-cd-delete', function (event) {
        event.preventDefault();
        var buttonId = $(this).attr("data-cd-id");
        bootbox.confirm("Are you sure you want to delete?", function (result) {
            if (result) {
                $.ajax({
                    url: '/CD/DeleteCD',
                    "dataType": "json",
                    "contentType": "application/json; charset=utf-8",
                    "type": "GET",
                    data: {
                        Id: buttonId
                    },
                    success: function (response) {
                        if (response.responseText == "Success") {
                            cDTable.row($(this).parents("tr")).remove().draw();
                            toastr.success(" Deleted Successfully");
                        }
                    },
                    error: function () {
                        toastr.error("Something Went Wrong.");
                    }
                });
            }
        });
    });
    $('#CDTable').on('click', '.js-cd-view', function (event) {
        event.preventDefault();
        $("#cdViewSection").show();
        $("#CDSection").hide();
        $("#HomeSection").hide();
        $("#UserSection").hide();
        $("#MembershipSection").hide();
        var buttonId = $(this).attr("data-cd-id");
        setDataInView(buttonId);
    });
    $('#CDTable').on('click', '.js-cd-edit', function (event) {
        event.preventDefault();
        //emptyTextBoxes();
        var buttonId = $(this).attr("data-cd-id");
        $.ajax({
            url: '/CD/FindCDById',
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "type": "GET",
            data: { Id: buttonId },
            success: function (response) {
                console.log(response);

                if (response.responseText == "Success") {
                    var cd = response.cd;
                    $('#addCDModal').modal('show');
                    $("#cdHdInput").val(cd.Id);
                    $("#title").val(cd.Title);
                    $("#publisher").val(cd.Publisher);
                    $("#genre").val(cd.Genre);
                    $("#CDType").val(cd.CDTypeId);
                    if (cd.CDTypeId == 2) {
                        $("#musicType").hide();
                        $("#gameType").show();
                        $("#gameMode").val(cd.GameMode);
                        $("#developer").val(cd.Developer);
                    } else if (cd.CDTypeId == 1 || cd.CDTypeId == 3) {
                        $("#musicType").show();
                        $("#gameType").hide();
                        $("#artist").val(cd.Artist);
                        $("#composer").val(cd.Composer);
                        $("#language").val(cd.Language);
                    }
                    $("#cost").val(cd.Cost);
                    $("#totalCD").val(cd.TotalCD);

                } else {
                    toastr.success("Failure");
                }
            },
            error: function () {
                toastr.error("Something Went Wrong.");
            }
        });
    });
}
function displayUserData() {

    userTable = $("#CustomerTable").DataTable({
        "bServerSide": true,
        "filter": true,
        "orderMulti": false,
        "destroy": true,
        "bAutoWidth": true,
        "ordering": true,
        "ajax": {
            "url": '/api/getCustomers',
            "DataProp": "data"
            //success: function (result) {
            //    console.log(result);
            //    }
        },
        "bProcessing": true,
        "aoColumns": [
            { "data": "Name", "name": "Name" },
            { "data": "Email", "name": "Email" },
            { "data": "Phone", "name": "Phone" },
            { "data": "DOB", "name": "DOB" },
            { "data": "Address", "name": "Address" },
            {
                "data": "Id",
                render: function (data) {
                    return "<span data-user-id=" + data + " class='js-edit m-1'><i class=' far fa-edit'></i></span>"
                        + "<span data-user-id=" + data + " class='js-user-view mr-2'><i class='far fa-eye'></i></span>"
                        + "<span data-user-id=" + data + " class='js-delete'><i class=' fas fa-trash-alt'></i></span>";
                }
            }
        ]
    });

}
function userTableHandler() {
    $('#CustomerTable').off().on('click', '.js-delete', function (event) {
        event.preventDefault();
        var buttonId = $(this).attr("data-user-id");
        bootbox.confirm("Are you sure you want to delete?", function (result) {
            if (result) {
                $.ajax({
                    url: '/User/DeleteUser',
                    "dataType": "json",
                    "contentType": "application/json; charset=utf-8",
                    "type": "GET",
                    data: {
                        Id: buttonId
                    },
                    success: function (response) {
                        if (response.responseText == "Success") {
                            userTable.row($(this).parents("tr")).remove().draw();
                            toastr.success(" Deleted Successfully");
                        }
                    },
                    error: function () {
                        toastr.error("Something Went Wrong.");
                    }
                });
            }
        });
    });
    $('#CustomerTable').on('click', '.js-user-view', function (event) {
        event.preventDefault();
        $("#usrViewSection").show();
        $("#cdViewSection").hide();
        $("#CDSection").hide();
        $("#HomeSection").hide();
        $("#UserSection").hide();
        $("#MembershipSection").hide();
        var buttonId = $(this).attr("data-user-id");
        setUserData(buttonId);
    });
    $('#CustomerTable').on('click', '.js-edit', function (event) {
        event.preventDefault();
        //emptyTextBoxes();
        var buttonId = $(this).attr("data-user-id");
        $.ajax({
            url: '/User/findUserById',
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "type": "GET",
            data: { Id: buttonId },
            success: function (response) {
                console.log(response);
                if (response.responseText == "Success") {
                    var user = response.user;
                    $('#addUserModal').modal('show');
                    $("#uName").val(user.Name);
                    $("#uEmail").val(user.Email);
                    $("#passSection").hide();
                    //$("#uPassword").val(user.Password);
                    $("#uPhone").val(user.Phone);
                    $("#uDOB").val(user.DOB);
                    $("#uAddress").val(user.Address);
                    $("#userHdInput").val(user.Id);
                    if (user.membership != null) {
                        if (user.membership.IsExpired == false || user.membership.IsRequested == false)
                            $("#selectMemberShipType").hide();
                    } else {
                        $("#selectMemberShipType").show();
                    }
                } else {
                    toastr.success("Failure");
                }
            },
            error: function () {
                toastr.error("Something Went Wrong.");
            }
        });
    });
}
function addEditUser(userObj, membershipTypeId) {
    if ($("#userRegistrationForm").valid()) {
        //$("#HeadError").val("");
        $.ajax({
            url: '/User/Create',
            type: 'POST',
            data: {
                user: userObj,
                membershipTypeId: membershipTypeId
            },
            success: function (data) {
                console.log(data);
                toastr.success("Successfully Inserted!!");
                $('#addUserModal').modal('hide');
                $('#userHdInput').val("");
                displayUserData();
                emptyTextBoxes();
            },
            error: function (ex) {
                toastr.error("Something Went Wrong.");
                console.log('Error in Operation' + ex);
            }
        });
    } else {
        return false;
    }
}
function addEditCD(cdObj) {
    var cdType = $('#CDType').val();
    if ($("#cDRegistrationForm").valid() && cdType > 0) {

        $.ajax({
            url: '/CD/CreateUpdateCD',
            type: 'POST',
            data: {
                cdOb: cdObj
            },
            success: function (data) {
                console.log(data);
                toastr.success("Successfully Inserted!!");
                $('#addCDModal').modal('hide');
                $('#cdHdInput').val("");
                displayCDData();
                emptyTextBoxes();
            },
            error: function (ex) {
                toastr.error("Something Went Wrong.");
                console.log('Error in Operation' + ex);
            }
        });

    } else {
        $('#CDType').css('border', '2px solid red');
        $('#errorCDtype').text("Please Select an CD Type").css('color', 'red');
        return false;
    }
}
function uploadImage(cdId) {
    var file = $("#image").get(0).files;
    if (file != null) {
        var data = new FormData;
        data.append("ImageFile", file[0]);
        data.append("Id", cdId);
        $.ajax({
            url: '/CD/UploadImage',
            type: 'POST',
            contentType: false,
            processData: false,
            data: {
                data: data
            },
            success: function (data) {
                console.log(data);
                if (data.cd != null) {
                    uploadImage(data.cd.Id);
                }
                toastr.success("Successfully Inserted!!");
                $('#addCDModal').modal('hide');
                $('#cdHdInput').empty();
                displayCDData();
                //emptyTextBoxes()
            },
            error: function (ex) {
                toastr.error("Something Went Wrong.");
                console.log('Error in Operation' + ex);
            }
        });
    }
}

function setUserData(id) {
    $.ajax({
        url: '/User/findUserById',
        "dataType": "json",
        "contentType": "application/json; charset=utf-8",
        "type": "GET",
        data: { Id: id },
        success: function (response) {
            console.log(response);
            if (response.responseText == "Success") {
                var user = response.user;
                $("#usrName").text(user.Name);
                $("#usrEmail").text(user.Email);
                $("#usrPhone").text(user.Phone);
                $("#usrDOB").text(user.DOB);
                $("#usrAddress").text(user.Address);
                $("#userHdInput").text(user.Id);
            } else {
                toastr.success("Failure");
            }
        },
        error: function () {
            toastr.error("Something Went Wrong.");
        }
    });
}

function setDataInView(id) {
    $.ajax({
        url: '/CD/FindCDById',
        "dataType": "json",
        "contentType": "application/json; charset=utf-8",
        "type": "GET",
        data: { Id: id },
        success: function (response) {
            console.log(response);
            if (response.responseText == "Success") {
                var cd = response.cd;
                $("#cdTitle").text(cd.Title);
                $("#cdPublisher").text(cd.Publisher);
                $("#cdGenre").text(cd.Genre);
                if (cd.CDTypeId == 2) {
                    $(".cdMusic").hide();
                    $("#CDTypeId").text("Game");
                    $("#cdGameMode").text(cd.GameMode);
                    $("#cdDeveloper").text(cd.Developer);
                } else if (cd.CDTypeId == 1 || cd.CDTypeId == 3) {
                    $(".cdGame").hide();
                    $("#CDTypeId").text("Music/Video");
                    $("#cdArtist").text(cd.Artist);
                    $("#cdComposer").text(cd.Composer);
                    $("#cdLanguage").text(cd.Language);
                }
                $("#cdCost").text(cd.Cost);
                $("#cdTotal").text(cd.TotalCD);
                $("#cdLeft").text(cd.CDLeft);
            } else {
                toastr.success("Failure");
            }
        },
        error: function () {
            toastr.error("Something Went Wrong.");
        }
    });
}

function displayRequestedMembership() {
    membershipTable = $("#MembershipTable").DataTable({
        "bServerSide": true,
        "filter": true,
        "orderMulti": false,
        "destroy": true,
        "bAutoWidth": true,
        "ordering": true,
        "ajax": {
            "url": '/api/getRequested',
            "DataProp": "data"
            //success: function (result) {
            //    console.log(result);
            //    }
        },
        "bProcessing": true,
        "aoColumns": [
            { "data": "Name", "name": "Name" },
            { "data": "Email", "name": "Email" },
            { "data": "DOB", "name": "DOB" },
            { "data": "MembershipNumber", "name": "MembershipNumber" },
            {
                "data": "MemberShipId",
                render: function (data) {
                    return "<span data-user-id=" + data + " class='js-accepted btn btn-success m-1'>Accept</span>"
                        + "<span data-user-id=" + data + " class='js-decline btn btn-warning'>Decline</span>";
                }
            }
        ]
    });
}
function MemberShipEventHandler() {
    membershipTable = $('#MembershipTable').off().on('click', '.js-decline', function (event) {
        event.preventDefault();
        var buttonId = $(this).attr("data-user-id");
        var mdata = {
            Id: buttonId,
            IsExpired: true
        }
        bootbox.confirm("Are you sure you want to Decline?", function (result) {
            if (result) {
                handleMembershipRequest(mdata);
                toastr.success("Request Declined");
            }
        });
    });
    $('#MembershipTable').on('click', '.js-accepted', function (event) {
        event.preventDefault();
        //emptyTextBoxes();
        var buttonId = $(this).attr("data-user-id");
        var mdata = {
            Id: buttonId,
            IsRequested: false
        }
        handleMembershipRequest(mdata);
        toastr.success("Request Accepted");
    });
}
function handleMembershipRequest(mdata) {
    $.ajax({
        url: '/MemberRequest/HandleMemberRequest',
        "dataType": "json",
        "contentType": "application/json; charset=utf-8",
        "type": "GET",
        data: mdata,
        success: function (response) {
            if (response.responseText == "Success") {
                membershipTable.row($(this).parents("tr")).remove().draw();
            }
        },
        error: function () {
            toastr.error("Something Went Wrong.");
        }
    });
}
function getCDType() {
    $.ajax({
        url: '/User/GetCDType',
        type: 'GET',
        "dataType": "json",
        "contentType": "application/json; charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data.responseText == "Success") {
                $.each(data.cdType, function (index, value) {
                    var option = '<option value="' + value.Id + '"> ' + value.Name + '</option>';
                    $("#CDType").append(option);
                });
            } else {

            }
        },
        error: function (ex) {
            toastr.error("Something Went Wrong.");
            console.log('Error in Operation' + ex);
        }
    });
}
function getMembershipType() {
    $.ajax({
        url: '/User/GetMembershipType',
        "dataType": "json",
        "contentType": "application/json; charset=utf-8",
        type: 'GET',
        success: function (data) {
            console.log(data);
            if (data.responseText = "Success") {
                $.each(data.membershipType, function (index, value) {
                    var option = '<option cost="' + value.Cost + '" value="' + value.Id + '"> ' + value.Title + '</option>';
                    $("#MembershipType").append(option);
                });
            } else {

            }
        },
        error: function (ex) {
            toastr.error("Something Went Wrong.");
            console.log('Error in Operation' + ex);
        }
    });
}

function addValidation() {
    $('#cDRegistrationForm').validate({
        rules: {
            cdType: {
                required: true,
                selectcheck: true
            }
        }
    });

    $.validator.addMethod('selectcheck', function (value) {
        return (value != '-1');
    }, "Please Select An Option.");
}
function emptyTextBoxes() {
    $('.field-validation-error').text("");
    $('.input-validation-error').addClass('input-validation-valid');
    $('.input-validation-error').removeClass('input-validation-error');
    //Removes validation message after input-fields
    $('.field-validation-error').addClass('field-validation-valid');
    $('.field-validation-error').removeClass('field-validation-error');
    //Removes validation summary 
    $('.validation-summary-errors').addClass('validation-summary-valid');
    $('.validation-summary-errors').removeClass('validation-summary-errors');


    $('#artist').val("");
    $('#composer').val("");
    $('#language').val("");
    $('#gameMode').val("");
    $('#developer').val("");
    $("#cdHdInput").val("");
    $("#title").val("");
    $("#publisher").val("");
    $("#genre").val("");

    $("#cost").val("");
    $("#totalCD").val("");
    $("#userHdInput").val("");
    $("#uName").val("");
    $("#uEmail").val("");
    $("#uPassword").val("");
    $("#uPhone").val("");
    $("#uDOB").val("");
    $("#uAddress").val("");
    $('#CDType').css('border', '1px solid #ced4da');
    $('#CDTypeDiv option').removeAttr('selected').filter('[value=-1]').attr('selected', true);
    $('#memberShipDiv option').removeAttr('selected').filter('[value=-1]').attr('selected', true);
    $('#errorCDtype').text("");
    $("#gameType").hide();
    $("#musicType").hide();
    $("#selectMemberShipType").show();
    $('#memCost').hide();
}
//Logout User
function logoutUser() {
    $.ajax({
        url: '/Home/LogOut',
        "dataType": "json",
        "contentType": "application/json; charset=utf-8",
        "type": "GET",
        success: function (response) {
            console.log(response);
            if (response.responseText == "Success") {
                toastr.success("Successfully LogOut.");
                $("#memberShip, #logOutList, #LoginUser, #filterCd").hide();
                $('#sessionHdInput').val("");
                window.location.href = "/Admin/Index";
            }
        },
        error: function () {
            toastr.error("Something Went Wrong.");
        }
    });
}
//Restrict Date Function
function restrictDate() {
    var dtToday = new Date();

    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if (month < 10)
        month = '0' + month.toString();
    if (day < 10)
        day = '0' + day.toString();

    var maxDate = year + '-' + month + '-' + day;
    $('#uDOB').attr('max', maxDate);
}