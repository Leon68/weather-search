function ajaxWeather(){
    $.get('//weixin.jirengu.com/weather')
        .done(success).fail(() => {
        alert('数据请求错误')
    })
}
function success(data){
    console.log(data)
    let $windScole = $('.wind-scale')
    let $windDirection = $('.wind-direction')
    let $quality = $('.quality')
    let $humidity = $('.humidity')
    let $temperature = $('.temperature')
    let $todayImg = $('#today-weather img')
    let $suggestion = $('#sugestion')
    var $city = $('#city')
    let codeImg = `//weixin.jirengu.com/images/weather/code/${data.weather[0].now.code}.png`
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
        let weekCodeImg = `//weixin.jirengu.com/images/weather/code/${data.weather[0].future[i].code1}.png`
        $weekWeather.html($weekWeather.html() + `<li><img src=${weekCodeImg}><p>${data.weather[0].future[i].text}${data.weather[0].future[i].low}°~${data.weather[0].future[i].high}°</p><p>${data.weather[0].future[i].day}${data.weather[0].future[i].date}</p></li>`)
    }
    inpCity()
}
function inpCity(){
    let $inpCity = $('#inp-city')
    $inpCity.on('keypress',function(event){
        if(event.keyCode == '13'){
            $.get(`//weixin.jirengu.com/weather/cityid?location=${$inpCity.val()}`)
                .done((id) => {
                    console.log(id)
                    $.get(`//weixin.jirengu.com/weather/now?cityid=${id.results[0].id}`)
                        .done((weather) => {
                            $inpCity.val('')
                            success(weather)
                        }).fail(() => {
                        alert('请检查输入是否正确')
                    })
                })
        }
    })
}
ajaxWeather()
inpCity()
