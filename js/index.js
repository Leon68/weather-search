function ajaxWeather(){
    $.get('https://weixin.jirengu.com/weather')
        .done(weather).fail(() => {
        alert('数据请求错误')
    })
}
function weather(data){
    console.log(data)
    if (data.status === 'error') {
        alert(data.msg)
        return
    }
    let $windScole = $('.wind-scale')
    let $windDirection = $('.wind-direction')
    let $quality = $('.quality')
    let $humidity = $('.humidity')
    let $temperature = $('.temperature')
    let $todayImg = $('#today-weather img')
    let $suggestion = $('#sugestion')
    var $city = $('#city')
    let codeImg = `https://weixin.jirengu.com/images/weather/code/${data.weather[0].now.code}.png`
    let $weekWeather = $('#week-weather')
    let time = new Date()
    $city.text(data.weather[0].city_name + time.toLocaleTimeString())
    $temperature.text(data.weather[0].now.text+data.weather[0].now.temperature + '°')
    $windScole.html(`<p>${data.weather[0].now.wind_scale}级</p><span>风力</span>`)
    $windDirection.html(`<p>${data.weather[0].now.wind_direction}</p><span>风向</span>`)
    $humidity.html(`<p>${data.weather[0].now.humidity}%</p><span>湿度</span>`)
    $quality.html(`<p>${data.weather[0].now.air_quality.city.quality}</p><span>空气质量</span>`)
    $suggestion.html(`<p>${data.weather[0].today.suggestion.dressing.brief}</p><p>${data.weather[0].today.suggestion.dressing.details}</p>`)
    $todayImg.attr('src',codeImg)
    $weekWeather.html('')
    for (let i = 0;i< 6 ;i++){
        let weekCodeImg = `https://weixin.jirengu.com/images/weather/code/${data.weather[0].future[i].code1}.png`
        $weekWeather.html($weekWeather.html() + `<li><img src=${weekCodeImg}><p>${data.weather[0].future[i].text}${data.weather[0].future[i].low}°~${data.weather[0].future[i].high}°</p><p>${data.weather[0].future[i].day}${data.weather[0].future[i].date}</p></li>`)
    }
}
function inpCity(){
    let $inpCity = $('#inp-city')
    $inpCity.on('keypress',function(event){
        if(event.keyCode == '13'){
            ajaxImages()
            $.get(`https://weixin.jirengu.com/weather/cityid?location=${$inpCity.val()}`)
                .done((id) => {
                    console.log(id)
                    $.get(`https://weixin.jirengu.com/weather/now?cityid=${id.results[0].id}`)
                        .done((data) => {
                            $inpCity.val('')
                            weather(data)
                        }).fail(() => {
                        alert('请检查输入是否正确')
                    })
                })
        }
    })
}

function ajaxImages(){
    console.log(2)
    let $inpCity = $('#inp-city')
    let $inpCityVal = $inpCity.val() ? $inpCity.val() : 'city'
    $.get(`https://pixabay.com/api/?key=6282825-2a9cefbe1dbed27ba005a2747&q=${$inpCityVal}&image_type=photo&per_page=40`)
        .done(caterLayout)
}

function caterLayout(data){
    let $aside = $('aside')
    let asideWidth = $aside.width()-20
    let basicHeight = 200
    let imgArray = []
    let rowTotalWidth = 0
    console.log(asideWidth)
    data.hits.forEach((imgInfo) => {
        imgInfo.rate = imgInfo.webformatWidth / imgInfo.webformatHeight
        let imgWidthBasic = imgInfo.rate * basicHeight
        console.log(imgWidthBasic)
        if (rowTotalWidth + imgWidthBasic <= asideWidth) {
            rowTotalWidth += imgWidthBasic
            imgArray.push(imgInfo)
        }else {
            let figureHeight = asideWidth/rowTotalWidth * basicHeight
            console.log(imgArray)
            render(figureHeight ,imgArray)
            imgArray = []
            imgArray.push(imgInfo)
            rowTotalWidth = imgWidthBasic
        }
    })
}
function render(figureHeight ,imgArray){
    let $aside = $('aside')
    imgArray.forEach((imgInfo) => {
        var imgNode = document.createElement('img')
        imgNode.src = imgInfo.webformatURL
        imgNode.style.height = figureHeight + 'px'
        imgNode.style.width = figureHeight * imgInfo.rate + 'px'
        $aside.append(imgNode)
    })
}
ajaxWeather()
ajaxImages()
inpCity()
$(window).resize(ajaxImages)
