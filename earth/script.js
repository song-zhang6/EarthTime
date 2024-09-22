document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const result = document.getElementById('result');

    searchBtn.addEventListener('click', function() {
        const city = cityInput.value;
        if (city) {
            fetchWeatherAndTime(city);
        }
    });

    async function fetchWeatherAndTime(city) {
        try {
            // 获取天气信息
            const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6d2b7d53c8ef5a0953d116d90466d1e5&units=metric`);
            const weatherData = await weatherResponse.json();

            if (weatherData.cod === '404') {
                throw new Error('城市未找到');
            }

            // 使用天气API返回的坐标来获取时区
            const { lon, lat } = weatherData.coord;
            const timeResponse = await fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=192M1BBYXDVF&format=json&by=position&lat=${lat}&lng=${lon}`);
            const timeData = await timeResponse.json();

            // 显示结果
            result.innerHTML = `
                <h3>${weatherData.name}, ${weatherData.sys.country}</h3>
                <p>温度: ${weatherData.main.temp}°C</p>
                <p>天气: ${weatherData.weather[0].description}</p>
                <p>当前时间: ${new Date(timeData.formatted).toLocaleString()}</p>
            `;
        } catch (error) {
            result.innerHTML = `<p>获取信息时出错: ${error.message}</p>`;
        }
    }
});