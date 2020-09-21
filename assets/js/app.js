$(document).ready(function () {
    let selectedProvince="";
    let selectedCity="";
    let selectedDistrict="";

    // Env Dev
    // let baseUrl = "https://api-dev.myorbit.id";
    
    // Env Preprod
    // let baseUrl = "https://api-preprod.myorbit.id";
    
    // Env Prod
    let baseUrl = "https://api.myorbit.id";
    
    get_provinsi();
    $("#dropdown-provinsi-mobile, #dropdown-provinsi-desktop").change(function(event){    
        selectedProvince = event.target.value;
        get_kota();
    });
    $("#dropdown-kota-mobile, #dropdown-kota-desktop").change(function(event){
        selectedCity = event.target.value;
        get_kecamatan();
    });
    $("#dropdown-kecamatan-mobile, #dropdown-kecamatan-desktop").change(function(event){
        selectedDistrict = event.target.value;
    });
    
    $('.carousel').slick({
        infinite: true,
        speed: 500,
        fade: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 2000
    });
    $(function(){
        $("input[name='phone']").on('input', function (e) {
            $(this).val($(this).val().replace(/[^0-9]/g, ''));
        });
    });
    $("#form-submit-mobile").click(function () {
        submitFormMobile();
    });
    $("#form-submit-desktop").click(function () {
        submitFormDekstop();
    });
    $(".registration-popup-close").click(function () {
        $(".registration-popup-wrapper").hide();
        location.reload(true); 
    });
    
    function get_provinsi() {
        $.get({
            url: baseUrl+"/coverage/v1/coverages/lacima", 
            success: function (returnDataProvinsi) {
                let htmlElements = "<option value='' disabled selected hidden>Silakan Pilih Provinsi Anda</option>";
                $.each(returnDataProvinsi.data, function (i, item) {
                    htmlElements = htmlElements + "<option value=" + item.attributes.province.replace(" ","_") + ">" + item.attributes.province +"</option>"
                });
                $('#dropdown-provinsi-mobile, #dropdown-provinsi-desktop').html(htmlElements);
                $('#dropdown-kota-mobile, #dropdown-kota-desktop').html("<option value='' disabled selected hidden>Silakan Pilih Kota Anda</option>");
                $('#dropdown-kecamatan-mobile, #dropdown-kecamatan-desktop').html("<option value='' disabled selected hidden>Silakan Pilih Kecamatan Anda</option>");
            } // close success handler
        });
    }
    function get_kota() {
        $.get({
            url: baseUrl+"/coverage/v1/coverages/lacima/"+selectedProvince.replace("_"," "),
            success: function (returnDataKota) {
                let htmlElements = "<option value='' disabled selected hidden>Silakan Pilih Kota Anda</option>";
                $.each(returnDataKota.data, function (i, item) {
                    htmlElements = htmlElements + "<option value=" + item.attributes.district.replace(" ","_") + ">" + item.attributes.district +"</option>"
                });
                $('#dropdown-kota-mobile, #dropdown-kota-desktop').html(htmlElements);
                $('#dropdown-kecamatan-mobile, #dropdown-kecamatan-desktop').html("<option value='' disabled selected hidden>Silakan Pilih Kecamatan Anda</option>");
            } // close success handler
        });
    }
    function get_kecamatan() {
        $.get({
            url: baseUrl+"/coverage/v1/coverages/lacima/"+selectedProvince.replace("_"," ")+"/"+selectedCity.replace("_"," "),
            success: function (returnDataKecamatan) {
                let htmlElements = "<option value='' disabled selected hidden>Silakan Pilih Kecamatan Anda</option>";
                $.each(returnDataKecamatan.data, function (i, item) {
                    htmlElements = htmlElements + "<option value=" + item.attributes.subdistrict.replace(" ","_") + ">" + item.attributes.subdistrict +"</option>"
                });
                $('#dropdown-kecamatan-mobile, #dropdown-kecamatan-desktop').html(htmlElements);
            } // close success handler
        });
    }

    function submitFormMobile() {

        // Array fill with id input
        let mandatoryArray = ['#input-nama-mobile','#input-email-mobile','#input-phone-mobile',
        '#dropdown-provinsi-mobile','#dropdown-kota-mobile','#dropdown-kecamatan-mobile','#input-adress-mobile'];
        
        const isValid = conditionValidation(mandatoryArray)
        if(isValid) {
            let inputNama = $("#input-nama-mobile").val();
            let inputEmail = $("#input-email-mobile").val();
            let inputPhone = $("#input-phone-mobile").val();
            let inputProvinsi = selectedProvince.replace("_"," ");
            let inputKota = selectedCity.replace("_"," ");
            let inputKecamatan = selectedDistrict.replace("_"," ");
            let inputAdress = $("#input-adress-mobile").val();

            let formData = {
                "name": inputNama,
                "email" : inputEmail,
                "msisdn" : inputPhone,
                "province" : inputProvinsi,
                "district" : inputKota,
                "subdistrict" : inputKecamatan,
                "address" : inputAdress
            };
            sendForm(formData);
        }
    }
   
    function submitFormDekstop() {

        // Array fill with id input
        let mandatoryArray = ['#input-nama-desktop','#input-email-desktop','#input-phone-desktop',
        '#dropdown-provinsi-desktop','#dropdown-kota-desktop','#dropdown-kecamatan-desktop','#input-adress-desktop'];

        const isValid = conditionValidation(mandatoryArray)
        if(isValid) {
            let inputNama = $("#input-nama-desktop").val();
            let inputEmail = $("#input-email-desktop").val();
            let inputPhone = $("#input-phone-desktop").val();
            let inputProvinsi = selectedProvince.replace("_"," ");
            let inputKota = selectedCity.replace("_"," ");
            let inputKecamatan = selectedDistrict.replace("_"," ");
            let inputAdress = $("#input-adress-desktop").val();

            let formData = {
                "name": inputNama,
                "email" : inputEmail,
                "msisdn" : inputPhone,
                "province" : inputProvinsi,
                "district" : inputKota,
                "subdistrict" : inputKecamatan,
                "address" : inputAdress
            };
            sendForm(formData);

        }
    }

    function sendForm(formData) {
        $.ajax({
            url: baseUrl+"/content/v1/subscription",
            method: 'POST',
            data: JSON.stringify(formData),
            dataType: 'json',
            headers: {
                "x-api-Key": "awjd9810u29h9u1j2iue1",
                "channel": "web"
            },
            contentType: 'application/json',
            success: function (result) {
                console.log(result);
                if(result.code == "CONTENTSUBSCRIPTION00"){
                    $(".registration-popup-wrapper").show();
                }else{
                    alert("submit gagal");
                }
            },
            error: function (error) {
                let errResponse = error.responseJSON.error_message;
                let formErrorName = $("#form-error-name-mobile, #form-error-nama")
                let formErrorEmail = $("#form-error-email-mobile, #form-error-email")
                let formErrorPhone = $("#form-error-phone-mobile, #form-error-phone")

                if(errResponse.name != null){
                    formErrorName.show();
                    formErrorName.text("Format Nama Anda Tidak Sesuai");
                }
                if(errResponse.email != null){
                    formErrorEmail.show();
                    formErrorEmail.text("Format Email Anda Tidak Sesuai");
                }
                if(errResponse.msisdn != null){
                    formErrorPhone.show();
                    formErrorPhone.text("Format Nomor Handphone Anda Tidak Sesuai");
                }
            }
         });
    }

    function conditionValidation(mandatoryArray) {
        let isValid = false;

        const filledData = mandatoryArray.map(data=>{
            let inputVal = $(data).val();
            
            if(!inputVal){
                $(data).next().show();
                return false;
            } else {
                $(data).next().hide();
                return true;
            }
        });

        // Cek selama ada data kosong isEmpty akan jadi true
        const isEmpty = filledData.some(data => data == false);

        // Cek kalo isEmpty sudah false, jadiin isValid true buat di return
        if(!isEmpty){
            isValid = true;
        }

        return isValid;
    }

    //  Remove text error 
    $('.form-input').on('change',function(){
        let value = $(this).val();

        if(value){
            $(this).parent().find('.form-error, .form-error-mobile').hide();
        }
    });
});
