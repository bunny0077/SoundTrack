$(function () {

    eventHandlerAdminLogin();
});

function eventHandlerAdminLogin() {
    //Hide Navbar Fields
    $("#memberShip, #logOutList, #LoginUser, #filterCd").hide();
    //Sign In Button
    $("#signInBtn").click(function (e) {
        e.preventDefault();
        var email = $("#userName").val().trim();
        var password = $("#userPassword").val().trim();
        var dataObj = {
            Email: email,
            Password: password
        };
        adminLogin(dataObj);
    });
    $('#forgotPasswordAdminBtn').click(function (e) {
        e.preventDefault();
        var email = $('#adminEmailFP').val();

        checkAdminEmail(email);
    });
    $('#OtpBtn').click(function (e) {
        e.preventDefault();
        var otp = $("#UserAdminOTP").val();
        if (otp != "" && otp != undefined) {
            var genOtp = $("#forgorPassAdminHF").val();
            var enteredOtp = $("#UserAdminOTP").val();
            if (genOtp == enteredOtp) {
                $("#OtpAdminSection").hide();
                $("#forgetAdminPasswordForm").show();
                $('#forgetPasswordAdminModal').modal('hide');
                $('#changePasswordAdminModal').modal('show');
                $("#UserAdminOTP").val("");
                $("#adminEmailFP").val("");
            } else {
                $('#UserAdminOTP').addClass("errorEmail");
                $('#UserAdminOTP').siblings('.field-validation-valid').text("OTP Doesn't Match.").css('color', 'red');
            }
        } else {
            $('#UserAdminOTP').addClass("errorEmail");
            $('#UserAdminOTP').siblings('.field-validation-valid').text("Please Enter OTP.").css('color', 'red');
        }
    });
    $('#changeAdminPassBtn').click(function (e) {
        e.preventDefault();
        if ($('#chngeAdminPasswordForm').valid()) {
            var pass = $("#passAdmin").val();
            var reEnteredPassword = $("#ReEnterAdmin").val();
            var email = $("#forgorPassAdminEmailHF").val();
            changeAdminPassWord(pass, email);
        } else {
            return false;
        }
    });
    //
    $('#userName').blur(function (e) {
        e.preventDefault();
        var value = $(this).val();
        $('#adminEmailFP').val(value);
    });
    //Forgot Password button
    $('#fpBtn').click(function (e) {
        e.preventDefault();
        $("#UserAdminOTP").val("");
        //$("#adminEmailFP").val("");
        $("#passAdmin").val("");
        $("#ReEnterAdmin").val("");
        $("#OtpAdminSection").hide();
        $("#forgetAdminPasswordForm").show();
        emptyTextBox();
    });
    $('#userPassword, #UserAdminOTP').keyup(function (e) {
        e.preventDefault();
        $(this).removeClass("errorEmail");
        $(this).siblings('.field-validation-valid').text('');
    });
}
function adminLogin(dataObj) {
    if ($('#adminLoginForm').valid()) {
        $.ajax({
            url: '/Admin/Login',
            type: 'POST',
            data: dataObj,
            success: function (data) {
                if (data.responseText == "Failure") {
                    toastr.error("Please Enter A valid userName And Password!!");
                } else if (data.responseText == "PasswordIncorrect") {
                    $('#userPassword').addClass("errorEmail");
                    $('#userPassword').siblings('.field-validation-valid').text("Inccorect Password").css('color','red');
                } else {
                    toastr.success("User Login Success");
                    window.location.href = "/Admin/Home";
                }
            },
            error: function (ex) {
                console.log('Error in Operation' + ex);
                toastr.error("Something Went Wrong.");
            }
        });
    } else {
        return false;
    }
}
function checkAdminEmail(email) {
    if ($('#forgetAdminPasswordForm').valid()) {
        $.ajax({
            url: '/Home/CheckEmail',
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "type": "GET",
            data: { Email: email },
            success: function (data) {
                if (data.responseText == "Success") {
                    $("#OtpAdminSection").show();
                    $("#forgetAdminPasswordForm").hide();

                    $("#forgorPassAdminHF").val(data.genratedOtp);
                    $("#forgorPassAdminEmailHF").val(email);
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
function changeAdminPassWord(pass, email) {
    $.ajax({
        url: '/Home/ChangePassword',
        "type": "POST",
        data: {
            Email: email,
            Password: pass
        },
        success: function (data) {
            console.log(data);
            $("#changePasswordAdminModal").modal("hide");
            $("#passAdmin").val("");
            $("#ReEnterAdmin").val("");
            $("#forgorPassAdminEmailHF").val("");
            toastr.success("Password Changed SuccessFully.");
        },
        error: function (ex) {
            console.log('Error in Operation' + ex);
            toastr.error("Something Went Wrong.");
        }
    });
}
function emptyTextBox() {
    $('.field-validation-error').text("");
    $('.input-validation-error').addClass('input-validation-valid');
    $('.input-validation-error').removeClass('input-validation-error');
    //Removes validation message after input-fields
    $('.field-validation-error').addClass('field-validation-valid');
    $('.field-validation-error').removeClass('field-validation-error');
    //Removes validation summary 
    $('.validation-summary-errors').addClass('validation-summary-valid');
    $('.validation-summary-errors').removeClass('validation-summary-errors');
}