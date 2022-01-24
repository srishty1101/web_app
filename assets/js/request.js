const request = new XMLHttpRequest();
request.open("GET", "https://py.crewbella.com/user/api/profile/chiragbalani");
request.send();
request.onload = () => {
    if (request.status == 200) {
        console.log(JSON.parse(request.response));
    } else {
        console.log(request)
        console.log(`error${request.status}`)
    }
}