var IsMemberShip = false;
var addedCdArray = new Array();
var orderObj = null;
var rentedCdIds = new Array();
const DISCOUNT = 0.30;
const MEMBERDISCOUNT = 0.10;
const STARTINGVALUE = 0;
const SECURITY = 5;
const MINRENTDAY = 4;
const TOTALDAYS = 3;

$(function () {
    //Event Handler
    eventHandlerHome();
    //filter Cd
    filterCDs("");
    //Check Session
    checkSession();
    //
    restrictDate();
});

function eventHandlerHome() {
    //Filter Cd Data
    $("#filterCd").keyup(function (e) {
        e.preventDefault();
        var filterText = $(this).val();
        filterCDs(filterText);
    });
    //login User
    $("#signInUserBtn").click(function (e) {
        e.preventDefault();
        var email = $("#usrName").val().trim();
        var password = $("#usrPassword").val().trim();
        var obj = {
            Email: email,
            Password: password
        };
        userLogin(obj);
    });
    //SignUp Modal
    $("#signUp").click(function (e) {
        e.preventDefault();
        $("#registerModal").find('#rName').focus();
        $("#LogInModal").modal("hide");
    });
    //Register user
    $("#userRegisterBtn").click(function (e) {
        e.preventDefault();
        var name = $("#rName").val();
        var email = $("#rEmail").val();
        var password = $("#rPassword").val();
        var dob = $("#rDOB").val();
        var phone = $("#rPhone").val();
        var address = $("#rAddress").val();
        var obj = {
            Name: name,
            Email: email,
            Password: password,
            Phone: phone,
            DOB: dob,
            Address: address
        }
        userRegistration(obj);
    });
    $("#memberShip").click(function (e) {
        e.preventDefault();
        checkMemberShip();
        $('#membershipModal').modal('show');
    });
    //Apply Now for Membership
    $('#ApplyNow').click(function (e) {
        e.preventDefault();
        applyForMembership();
    });
    //Add CD for Rent
    $('#cdDataDiv').off().on('click', '.addToCart', function (e) {
        e.preventDefault();
        var id = $(this).attr('id');
        getCDById(id);
        $(this).prop('disabled', true);
        $('#rentingSection').show();
        $('#instructionSection').hide();
    });
    //Delete CD from rent
    $('#rentItDiv').off().on('click', '.deleteRentCd', function (e) {
        e.preventDefault();
        var id = $(this).attr('id');
        $(this).closest(".rentedCD").remove();
        $('#' + id + '').attr("disabled", false);
        addedCdArray = $.grep(addedCdArray, function (value) {
            return value.Id != id;
        });
        if (addedCdArray.length == 0) {
            $('#rentingSection').hide();
            $('#instructionSection').show();
        }
    });
    //Logout
    $('#logOutList').click(function (e) {
        e.preventDefault();
        logoutUser();
    });
    //Rent It 
    $('#rentIt').click(function (e) {
        e.preventDefault();
        var sessionVal = $('#sessionHdInput').val();
        if (sessionVal != "" && sessionVal != undefined) {
            calculateRent();
        } else {
            $("#LogInModal").modal("show");
        }
    });
    //Purchase 
    $('#Purchase').click(function (e) {
        e.preventDefault();
        purchaseCDs();
    });
    //Forgot Password Modal
    $('#forgotPasswordBtn').click(function (e) {
        e.preventDefault();
        $("#LogInModal").modal("hide");
        $("#forgetPasswordModal").modal("show");
        //emptyTextBoxe();
    });
    $('#userForgotPasswordBtn').click(function (e) {
        e.preventDefault();
        var email = $('#UserEmailFP').val();
        checkEmail(email);
    });
    $('#EnterOtpBtn').click(function (e) {
        e.preventDefault();
        var otp = $("#OTP").val();
        if (otp != "" && otp != undefined) {
            var genOtp = $("#forgorPasswordHF").val();
            var enteredOtp = $("#OTP").val();
            if (genOtp == enteredOtp) {
                $("#OtpSection").hide();
                $("#forgetPasswordForm").show();
                $('#forgetPasswordModal').modal('hide');
                $('#changePasswordModal').modal('show');
                $("#OTP").val("");
                $("#UserEmailFP").val("");
                emptyTextBoxe();
            } else {
                $('#OTP').addClass('errorEmail');
                $('#OTP').siblings('.field-validation-valid').text("OTP Doesn't Match.").css('color', 'red');
            }
        } else {
            $('#OTP').addClass('errorEmail');
            $('#OTP').siblings('.field-validation-valid').text("OTP Must Not be Empty.").css('color','red');
        }
    });
    $('#userChangePassBtn').click(function (e) {
        e.preventDefault();
        if ($('#changePasswordForm').valid()) {
            var pass = $("#changePass").val();
            var reEnteredPassword = $("#ReEnterPass").val();
            var email = $("#forgorPasswordEmailHF").val();
            changePassWord(pass, email);
            emptyTextBoxe();
        } else {
            return false;
        }
    });
    $('#LoginUser').click(function (e) {
        e.preventDefault();
        emptyTextBoxe();
    });
    $('#usrName').blur(function (e) {
        e.preventDefault();
        var value = $(this).val();
        $('#UserEmailFP').val(value);
    });
    $('#rEmail, #usrPassword, #OTP').keyup(function (e) {
        e.preventDefault();
        $(this).removeClass('errorEmail');
        $(this).siblings('.field-validation-valid').text("");
    });


}
//User Register
function userRegistration(obj) {
    if ($("#userRegistrationForm").valid()) {
        $.ajax({
            url: '/Home/UserRegistration',
            type: "POST",
            data: obj,
            success: function (response) {
                console.log(response);
                if (response.responseText == "Success") {
                    toastr.success("Success");
                    $("#registerModal").modal("hide");
                    $("#LoginUser").hide();
                    $("#memberShip, #logOutList").show();
                    $('#sessionHdInput').val(response.Id);
                    emptyTextBoxe();
                } else if (response.responseText == "NotFound") {
                    toastr.warning("Not Found");
                } else if (response.responseText == "AlreadyExist") {
                    $('#rEmail').addClass('errorEmail');
                    $("#rEmail").siblings('.field-validation-valid').text("Email Already Exists.").css('color', 'red');
                    toastr.error("Email Already Exists!!");
                } else {
                    toastr.warning("Failure");
                }

            },
            error: function () {
                toastr.error("Something Went Wrong.");
            }
        });
    } else {
        return false;
    }
}
//User Login 
function userLogin(obj) {
    if ($("#userLoginForm").valid()) {
        $.ajax({
            url: '/Home/LogInUser',
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "type": "GET",
            data: obj,
            success: function (response) {
                console.log(response);
                if (response.responseText == "Success") {
                    toastr.success("Success");
                    $("#LogInModal").modal("hide");
                    $("#LoginUser").hide();
                    $("#memberShip, #logOutList").show();
                    $('#sessionHdInput').val(response.Id);
                    emptyTextBoxe();
                } else if (response.responseText == "NotFound") {
                    toastr.warning("User Not Found. Please SignUp.");
                    emptyTextBoxe();
                } else if (response.responseText == 'PassWordIncorrect') {
                    $('#usrPassword').addClass('errorEmail').focus();
                    $('#usrPassword').siblings('.field-validation-valid').text('PassWord Incorrect!').css('color', 'red');
                } else {
                    toastr.warning("Failure");
                }
            },
            error: function () {
                toastr.error("Something Went Wrong.");
            }
        });
    } else {
        return false;
    }
}
// Filter CDs
function filterCDs(filterText) {
    $.ajax({
        url: '/Home/FilterCDs',
        "dataType": "json",
        "contentType": "application/json; charset=utf-8",
        "type": "GET",
        data: { FilterText: filterText },
        success: function (response) {
            console.log(response);
            if (response.responseText == "Success") {
                var cdData = response.cd;
                setCDData(cdData);
            } else {
                toastr.success("Failure");
            }
        },
        error: function () {
            toastr.error("Something Went Wrong.");
        }
    });
}
//Set CD Data 
function setCDData(cdData) {
    $("#cdDataDiv").empty();
    $.each(cdData, function (index, cd) {

        var cdHtml = '<div class="card col-md-5 col-sm-6 p-0  card-margin mb-4">'
            + '<div class="card-header h4 my-0">'
            + cd.Title
            + '</div>'
            + '<div class="card-body d-flex">';
        if (cd.CDTypeId == 1 || cd.CDTypeId == 3) {
            cdHtml += '<div class="col-sm-8 p-0=">'
                + '<p>Artist :' + cd.Artist + '</p>'
                + '<p>Composer :' + cd.Composer + '</p>'
                + '</div>'
        } else {
            cdHtml += '<div class="col-sm-8 p-0">'
                + '<p>Game Mode :' + cd.GameMode + '</p>'
                + '<p>Developer :' + cd.Developer + '</p>'
                + '</div>'
        }
        cdHtml += '<div class="col-sm-4 p-0 d-block">'
            + '<p>Type :' + cd.TypeName + '</p>'
            + '<p>Genre :' + cd.Genre + '</p>'
            + '</div></div>'
            + '<div class="card-footer">'
            + '<span class="fontCustomSize">$' + cd.Cost + '</span>/day<small> (' + cd.CDLeft + ' CD Left)</small>'
            + '<button class="btn btn-primary float-right addToCart" id="' + cd.Id + '">Add</button>'
            + '</div></div>'
        $("#cdDataDiv").append(cdHtml);
    });
}
//Check Membership
function checkMemberShip() {
    $.ajax({
        url: '/Home/CheckMemberShip',
        "dataType": "json",
        "contentType": "application/json; charset=utf-8",
        "type": "GET",
        success: function (response) {
            console.log(response);
            $('#memberShipMessage').empty();
            if (response.responseText == "Success") {
                $('#notMember').hide();
                var member = response.mem;
                var haveMemberhtml = ' <h5>Membership Number : </h5><p>' + member.MembershipNumber + '</p>'
                    + '<h5> Valid From : </h5><p>' + member.DateCreated + '</p>'
                    + '<h5> Valid To  : </h5><p>' + member.DateExpired + '</p>';
                $('#memberShipMessage').append(haveMemberhtml);
                $('#ApplyNow').hide();
                IsMemberShip = true;
            } else if (response.responseText == "NotFound") {
                $('#notMember').show();
            } else if (response.responseText == "Expired") {
                $('#notMember').hide();
                $('#memberShipMessage').html("<h4> Your Membership is Decline/Expired.</h4>");
            } else if (response.responseText == "InProgress") {
                $('#notMember').hide();
                $('#memberShipMessage').html("<h4> Your Membership is InProgress.</h4>");
                $('#ApplyNow').hide();
            }

        },
        error: function () {
            toastr.error("Something Went Wrong.");
        }
    });
}
//Apply For MemberShip
function applyForMembership() {
    $.ajax({
        url: '/Home/ApplyForMemberShip',
        "dataType": "json",
        "contentType": "application/json; charset=utf-8",
        "type": "GET",
        success: function (response) {
            console.log(response);
            if (response.responseText == "Success") {
                toastr.success("Successfully Apply for Membership.");
            }
            $('#membershipModal').modal('hide');
        },
        error: function () {
            toastr.error("Something Went Wrong.");
        }
    });
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
                $("#LoginUser").show();
                $("#memberShip, #logOutList").hide();
                $('#sessionHdInput').val("");
            }
        },
        error: function () {
            toastr.error("Something Went Wrong.");
        }
    });
}
//Get Cd By Id
function getCDById(id) {
    $.ajax({
        url: '/Home/GetCDById',
        "dataType": "json",
        "contentType": "application/json; charset=utf-8",
        "type": "GET",
        data: { Id: id },
        success: function (response) {
            console.log(response);
            if (response.responseText == "Success") {
                var cd = response.cd;
                addedCdArray.push(cd);
                var html = getAddedCDHtml(cd);
                $('#rentItDiv').append(html);
            }
        },
        error: function () {
            toastr.error("Something Went Wrong.");
        }
    });
}
//Check Session
function checkSession() {
    var userId = $('#sessionHdInput').val();
    if (userId != "" && userId != undefined) {
        $("#LoginUser").hide();
        $("#memberShip, #logOutList").show();
    } else {
        $("#LoginUser").show();
        $("#memberShip, #logOutList").hide();
    }
}
//
function getAddedCDHtml(cd) {
    var html = '<div class="border rounded bg-secondary text-white rentedCD p-3 mb-3">'
        + '<div class="d-flex " >'
        + '<span class="h4">Title : ' + cd.Title + '</span>'
        + '<span class="ml-auto">Price : $' + cd.Cost + '/day</span>'
        + '</div >'
        + '<span class="d-flex justify-content-end"><i class="fas fa-trash-alt deleteRentCd" id="' + cd.Id + '"></i></span>'
        + '</div>';
    return html;
}

function checkEmail(email) {
    if ($('#forgetPasswordForm').valid()) {
        $.ajax({
            url: '/Home/CheckEmail',
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "type": "GET",
            data: { Email: email },
            success: function (data) {
                if (data.responseText == "Success") {
                    $("#OtpSection").show();
                    $("#forgetPasswordForm").hide();

                    $("#forgorPasswordHF").val(data.genratedOtp);
                    $("#forgorPasswordEmailHF").val(email);
                } else if (data.responseText == "UserNotFound") {
                    toastr.warning("User Not Found. Please Register!!");
                }
                else {
                    toastr.warning("Something Went Wrong!!");
                }
                console.log(data);
            },
            error: function (ex) {
                console.log('Error in Operation' + ex);
                toastr.error("Something Unexpected!!");
            }
        });
    }
}
//Change Password
function changePassWord(pass, email) {
    $.ajax({
        url: '/Home/ChangePassword',
        "type": "POST",
        data: {
            Email: email,
            Password: pass
        },
        success: function (data) {
            console.log(data);
            $("#changePasswordModal").modal("hide");
            //emptyTextBoxes();
            toastr.success("Password Changed SuccessFully.");
        },
        error: function (ex) {
            console.log('Error in Operation' + ex);
            toastr.error("Something Went Wrong.");
        }
    });
}
//Purchase Cds
function purchaseCDs() {
    $.ajax({
        url: '/Home/PurchaseCd',
        "type": "POST",
        data: {
            Order: orderObj,
            CdIds: rentedCdIds
        },
        success: function (response) {
            console.log(response);
            toastr.success("Success.");
            if (response.responseText == "Success") {
                $('#RentItModal').modal('hide');
                rentedCdIds = new Array();
                $('#rentItDiv').trigger('click', '.deleteRentCd');
                $('#rentItDiv').empty();
                $('#rentingSection').hide();
                $('#instructionSection').show();
                filterCDs("");
            }
        },
        error: function () {
            toastr.error("Something Went Wrong.");
        }
    });
}
//Rent Calculation
function calculateRent() {
    rentedCdIds = new Array();
    var totalDays = $('#rentDays').val();
    var days = parseInt(totalDays);
    var totalitems = STARTINGVALUE;
    var membershipDiscount = STARTINGVALUE;
    var discount = STARTINGVALUE;
    var price = STARTINGVALUE;
    var totalPrice = STARTINGVALUE;
    var security = SECURITY;
    checkMemberShip();
    if (days >= MINRENTDAY) {
        $.each(addedCdArray, function (index, value) {
            price += value.Cost;
            totalitems++;
            rentedCdIds.push(value.Id);
        });
        price = price * days;
    } else {

    }
    if (IsMemberShip) {
        membershipDiscount = price * MEMBERDISCOUNT;
    }
    if (totalitems >= TOTALDAYS) {
        discount = price * DISCOUNT;
    }
    security = totalitems * security;
    var totalDiscount = membershipDiscount + discount;
    totalPrice = (price + security) - totalDiscount;

    orderObj = {
        NumberOfItems: totalitems,
        TotalCost: totalPrice,
        TotalDays: days,
        Discount: totalDiscount,
        Security: security
    }
    purchaseModal(totalitems, price, discount, membershipDiscount, days, security, totalPrice);
}
//Purchase Modal
function purchaseModal(totalitems, price, discount, membershipDiscount, days, security, totalPrice) {
    $('#rentItModalDiv').empty();
    var html = '<div class="d-flex flex-wrap">'
        + '<p class="col-sm-8">Total Cds : </p>'
        + '<p class="col-sm-4" > ' + totalitems + '</p>'
        + '<p class="col-sm-8">Price : </p>'
        + '<p class="col-sm-4">$' + price + ' </p>'
        + '<p class="col-sm-8">Discount : </p>'
        + '<p class="col-sm-4">$' + discount + '</p>'
        + '<p class="col-sm-8">Membership Discount : </p>'
        + '<p class="col-sm-4">$' + membershipDiscount + ' </p>'
        + '<p class="col-sm-8">Total days : </p>'
        + '<p class="col-sm-4">' + days + ' </p>'
        + '<p class="col-sm-8">Security : </p>'
        + '<p class="col-sm-4">$' + security + ' </p>'
        + '<p class="col-sm-8">Total Price : </p>'
        + '<p class="col-sm-4">$' + totalPrice + ' </p>'
        + '</div>';
    $('#rentItModalDiv').append(html);
    $('#RentItModal').modal('show');
}
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
    $('#rDOB').attr('max', maxDate);
}
function emptyTextBoxe() {
    $('.field-validation-error').text("");
    $('.input-validation-error').addClass('input-validation-valid');
    $('.input-validation-error').removeClass('input-validation-error');
    //Removes validation message after input-fields
    $('.field-validation-error').addClass('field-validation-valid');
    $('.field-validation-error').removeClass('field-validation-error');
    //Removes validation summary 
    $('.validation-summary-errors').addClass('validation-summary-valid');
    $('.validation-summary-errors').removeClass('validation-summary-errors');

    $("#rName").val("");
    $("#rEmail").val("");
    $("#rPassword").val("");
    $("#rDOB").val("");
    $("#rAddress").val("");
    $("#changePass").val("");
    $("#ReEnterPass").val("");
    $("#forgorPasswordEmailHF").val("");
    $("#usrName").val("");
    $("#usrPassword").val("");
    $("#changePass").val("");
    $("#ReEnterPass").val("");
    $("#forgorPasswordEmailHF").val("");
    $('#UserEmailFP').val('');
    $('#rPhone').val('');
    $('#rEmail').removeClass('errorEmail');
    $("#rEmail").siblings('.field-validation-valid').text("");
}

//////////////// Ends Here/////////////////////////
