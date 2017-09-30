function ajaxWeather(){
    $.get('https://weixin.jirengu.com/weather')
        .done(weather).fail(() => {
        alert('数据请求错误')
    })
}
function weather(data) {
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
    $temperature.text(data.weather[0].now.text + data.weather[0].now.temperature + '°')
    $windScole.html(`<p>${data.weather[0].now.wind_scale}级</p><span>风力</span>`)
    $windDirection.html(`<p>${data.weather[0].now.wind_direction}</p><span>风向</span>`)
    $humidity.html(`<p>${data.weather[0].now.humidity}%</p><span>湿度</span>`)
    $quality.html(`<p>${data.weather[0].now.air_quality.city.quality}</p><span>空气质量</span>`)
    $suggestion.html(`<p>${data.weather[0].today.suggestion.dressing.brief}</p><p>${data.weather[0].today.suggestion.dressing.details}</p>`)
    $todayImg.attr('src', codeImg)
    $weekWeather.html('')
    for (let i = 0;i< 6 ;i++){
        let weekCodeImg = `https://weixin.jirengu.com/images/weather/code/${data.weather[0].future[i].code1}.png`
        $weekWeather.html($weekWeather.html() + `<li><img src=${weekCodeImg}><p>${data.weather[0].future[i].text}${data.weather[0].future[i].low}°~${data.weather[0].future[i].high}°</p><p>${data.weather[0].future[i].day}${data.weather[0].future[i].date}</p></li>`)
    }
}
function inpCity() {
    let $inpCity = $('#inp-city')
    $inpCity.on('keypress', function (event) {
        if (event.keyCode == '13') {
          console.log('回车')
            new Barrel($('#img-ct'),$('#inp-city'))
            $.get(`https://weixin.jirengu.com/weather/cityid?location=${$inpCity.val()}`)
                .done((id) => {
                    console.log('cityId'+id)
                    $.get(`https://weixin.jirengu.com/weather/now?cityid=${id.results[0].id}`)
                        .done((data) => {
                            console.log(data)
                            $inpCity.val('')
                            weather(data)
                        }).fail(() => {
                        alert('请检查输入是否正确')
                    })
                })
        }
    })
}

ajaxWeather()
inpCity()
function Barrel($ct,$inp) {
    this.$inpCityVal = $inp.val() ? $inp.val() : 'city'
    this.$ct = $ct
    this.ctWidth = $ct.width() - 20
    this.basicHeight = 200
    this.ajaxImages()
}

Barrel.prototype = {
    ajaxImages: function(){
        var _this = this
        $.get(`https://pixabay.com/api/?key=6282825-2a9cefbe1dbed27ba005a2747&q=${this.$inpCityVal}&image_type=photo&per_page=40`)
        .done(function(data){
          if(data.hits.length < 10){return}
          _this.$ct.html('')
          _this.render(data)})
    },
    render: function(data) {
        console.log(data)
        let imgArray = []
        let rowTotalWidth = 0
        data.hits.forEach(imgInfo => {
            imgInfo.rate = imgInfo.webformatWidth / imgInfo.webformatHeight
            let imgWidthBasic = imgInfo.rate * this.basicHeight
            if (rowTotalWidth + imgWidthBasic <= this.ctWidth) {
                rowTotalWidth += imgWidthBasic
                imgArray.push(imgInfo)
            } else {
                let figureHeight = (this.ctWidth) / rowTotalWidth * this.basicHeight
                this.layout(figureHeight, imgArray)
                imgArray = [imgInfo]
                rowTotalWidth = imgWidthBasic
            }
        })
    },
    layout: function(figureHeight, imgArray) {
        let $imgFigure = $('<figure></figure>')
        imgArray.forEach((imgInfo) => {
            let $img = $('<img>')
            $img.attr('src', imgInfo.webformatURL)
            $img.height(figureHeight + 'px')
            $img.width(figureHeight * imgInfo.rate + 'px')
            $imgFigure.append($img)
        })
        this.$ct.append($imgFigure)
    }
}
new Barrel($('#img-ct'),$('#inp-city'))

$(window).resize(function () {
  setTimeout(function(){
    new Barrel($('#img-ct'),$('#inp-city'))
  },1000)
})
