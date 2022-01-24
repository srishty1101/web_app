const phoneInputField = document.querySelector("#phone");
const phone_Input = window.intlTelInput(phoneInputField, {
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});
const info = document.querySelector(".alert-info");
const phoneForm = document.getElementById('phone-form');
const verifyForm = document.getElementById('verify-form');
const responseText = document.getElementById('response-text');



function process(event) {
    event.preventDefault();

    const phoneNumber = phoneInput.getNumber();

    info.style.display = "";
    info.innerHTML = `Phone number in E.164 format: <strong>${phoneNumber}</strong>`;
}

function getIp(callback) {
    fetch('https://ipinfo.io/json?token=<your token>', { headers: { 'Accept': 'application/json' } })
        .then((resp) => resp.json())
        .catch(() => {
            return {
                country: 'us',
            };
        })
        .then((resp) => callback(resp.country));
}
const phoneInput = window.intlTelInput(phoneInputField, {
    preferredCountries: ["us", "co", "in", "de"],
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});



function fn1() {
    var str = document.getElementsById('text1').value;
    alert("value inside the text box is: " + str);
}

let phoneNumber;

phoneForm.addEventListener('submit', async e => {
    e.preventDefault();

    phoneNumber = document.getElementById('phone-number-input').value;

    const response = await fetch('http://localhost:3000/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phoneNumber })
    }).catch(e => console.log(e));

    if (response.ok) {
        phoneForm.style.display = 'none';
        verifyForm.style.display = 'block';
    }
});
verifyForm.addEventListener('submit', async e => {
    e.preventDefault();

    const otp = document.getElementById('otp-input').value;

    const data = {
        phoneNumber: phoneNumber,
        otp: otp
    };

    const response = await fetch('http://localhost:3000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
    }).catch(e => console.log(e));

    const check = await response.json();

    const text = response.ok ? check.status : response.statusText;
    responseText.innerHTML = text;

    verifyForm.style.display = 'none';
    responseText.style.display = 'block';
});

exports.handler = function(context, event, callback) {
    const client = context.getTwilioClient();

    client.verify.services(context.VERIFY_SERVICE_SID)
        .verifications
        .create({ to: `+${event.phoneNumber}`, channel: 'sms' })
        .then(verification => console.log(verification.status))
        .catch(e => {
            console.log(e)
            return callback(e)
        });

    return callback(null);
}
exports.handler = async function(context, event, callback) {
    const client = context.getTwilioClient();

    const check = await client.verify.services(context.VERIFY_SERVICE_SID)
        .verificationChecks
        .create({ to: `+${event.phoneNumber}`, code: event.otp })
        .catch(e => {
            console.log(e)
            return callback(e)
        });

    const response = new Twilio.Response();
    response.setStatusCode(200);
    response.appendHeader('Content-Type', 'application/json');
    response.setBody(check);

    return callback(null, response);
}