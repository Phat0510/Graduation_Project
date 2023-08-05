var urlSolar ='https://api.thingspeak.com/channels/1678412/feeds/last.json?api_key=TV81HAV44XK6J1PP&timezone=Asia/Bangkok';
var urlWind = 'https://api.thingspeak.com/channels/1679967/feeds/last.json?api_key=XVUYKD4293ZRATMT&timezone=Asia/Bangkok';
var url3 = 'https://api.thingspeak.com/channels/1679968/feeds/last.json?api_key=FZH5P53DUT56TDAZ&timezone=Asia/Bangkok';
var lastUpdateSolar, lastUpdateWind;
var DC_Vol_Solar, DC_Cur_Solar, DC_Pow_Solar, AC_Vol_Solar, AC_Cur_Solar, AC_Pow_Solar, Energy_Solar, Fre_Solar, PF_Solar, Weather_Solar;
var DC_Vol_Wind, DC_Cur_Wind, DC_Pow_Wind, AC_Vol_Wind, AC_Cur_Wind, AC_Pow_Wind, Energy_Wind, Fre_Wind, PF_Wind, Weather_Wind;

function Solar_Data() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText)
        document.getElementById("DC_Vol_Solar").innerHTML = parseFloat(data.field1) + ' V';
        document.getElementById("DC_Cur_Solar").innerHTML = parseFloat(data.field2) + ' A';
        document.getElementById("DC_Pow_Solar").innerHTML = parseFloat(data.field3) + ' W';
        document.getElementById("AC_Vol_Solar").innerHTML = parseFloat(data.field4) + ' V';
        document.getElementById("AC_Cur_Solar").innerHTML = parseFloat(data.field5) + ' A';
        document.getElementById("AC_Pow_Solar").innerHTML = parseFloat(data.field6) + ' W';
        document.getElementById("Energy_Solar").innerHTML = parseFloat(data.field7) + ' kWh';
        document.getElementById("Fre_Solar").innerHTML = parseFloat(data.field8) + ' Hz';

        DC_Vol_Solar = data.field1;
        DC_Cur_Solar = data.field2;
        DC_Pow_Solar = data.field3;
        AC_Vol_Solar = data.field4;
        AC_Cur_Solar = data.field5;
        AC_Pow_Solar = data.field6; 
        Energy_Solar = data.field7;
        Fre_Solar = data.field8;

        document.getElementById("LU_Solar").innerHTML = lastUpdateSolar = data.created_at;
        // lastUpdate = data.created_at;
        // console.log(typeof data.created_at);
      }
    //   else {
    //     document.getElementById("DC_Vol_Solar").innerHTML = "error";
    //     document.getElementById("DC_Cur_Solar").innerHTML = "error";
    //     document.getElementById("DC_Pow_Solar").innerHTML = "error";
    //     document.getElementById("AC_Vol_Solar").innerHTML = "error";
    //     document.getElementById("AC_Cur_Solar").innerHTML = "error";
    //     document.getElementById("AC_Pow_Solar").innerHTML = "error";
    //     document.getElementById("Energy_Solar").innerHTML = "error";
    //     document.getElementById("Fre_Solar").innerHTML = "error";
    //   }
    };
    xhttp.open("GET", urlSolar, true);
    xhttp.send();
    
    var yearSolar = lastUpdateSolar.substr(0, 4);
    var monthSolar = lastUpdateSolar.substr(5, 2);
    var daySolar = lastUpdateSolar.substr(8, 2);
    var hourSolar = lastUpdateSolar.substr(11, 2);
    var minuteSolar = lastUpdateSolar.substr(14, 2);
    var secondSolar = lastUpdateSolar.substr(17, 2);
    const timeLUSolar = new Date(yearSolar, monthSolar - 1, daySolar, hourSolar, minuteSolar, secondSolar);
    // console.log(timeLUSolar);

    const d = new Date();
    // console.log(d);

    if(d - timeLUSolar > 60000) {
      // console.log("Gate dung gui du lieu");
      document.getElementById("System_Solar").style.color = "red";
      document.getElementById("System_Solar").innerHTML = "OFF";
    }
    else {
      document.getElementById("System_Solar").style.color = "blue";
      document.getElementById("System_Solar").innerHTML = "ON";
    };
};

function Wind_Data() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText)
        document.getElementById("DC_Vol_Wind").innerHTML = parseFloat(data.field1) + ' V';
        document.getElementById("DC_Cur_Wind").innerHTML = parseFloat(data.field2) + ' A';
        document.getElementById("DC_Pow_Wind").innerHTML = parseFloat(data.field3) + ' W';
        document.getElementById("AC_Vol_Wind").innerHTML = parseFloat(data.field4) + ' V';
        document.getElementById("AC_Cur_Wind").innerHTML = parseFloat(data.field5) + ' A';
        document.getElementById("AC_Pow_Wind").innerHTML = parseFloat(data.field6) + ' W';
        document.getElementById("Energy_Wind").innerHTML = parseFloat(data.field7) + ' kWh';
        document.getElementById("Fre_Wind").innerHTML = parseFloat(data.field8) + ' Hz';

        DC_Vol_Wind = data.field1;
        DC_Cur_Wind = data.field2;
        DC_Pow_Wind = data.field3;
        AC_Vol_Wind = data.field4;
        AC_Cur_Wind = data.field5;
        AC_Pow_Wind = data.field6;
        Energy_Wind = data.field7;
        Fre_Wind = data.field8;

        document.getElementById("LU_Wind").innerHTML = lastUpdateWind = data.created_at;
      }

    };
    xhttp.open("GET", urlWind, true);
    xhttp.send();

    var yearWind = lastUpdateWind.substr(0, 4);
    var monthWind = lastUpdateWind.substr(5, 2);
    var dayWind = lastUpdateWind.substr(8, 2);
    var hourWind = lastUpdateWind.substr(11, 2);
    var minuteWind = lastUpdateWind.substr(14, 2);
    var secondWind = lastUpdateWind.substr(17, 2);
    const timeLUWind = new Date(yearWind, monthWind - 1, dayWind, hourWind, minuteWind, secondWind);
    // console.log(timeLUSolar);

    const d = new Date();
    // console.log(d);

    if(d - timeLUWind > 60000) {
      // console.log("Gate dung gui du lieu");
      document.getElementById("System_Wind").style.color = "red";
      document.getElementById("System_Wind").style.fontWeight = "bold";
      document.getElementById("System_Wind").innerHTML = "OFF";
    }
    else {
      document.getElementById("System_Wind").style.color = "yellow";
      document.getElementById("System_Wind").style.fontWeight = "bold";
      document.getElementById("System_Wind").innerHTML = "ON";
    };
};

function Third_Data() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText)
        document.getElementById("PF_Solar").innerHTML = parseFloat(data.field1);
        document.getElementById("PF_Wind").innerHTML = parseFloat(data.field2);

        PF_Solar = data.field1;
        PF_Wind = data.field2;
        Weather_Solar = data.field3;
        Weather_Wind = data.field4;

        if(data.field3 == 1) {
          document.getElementById("Weather_Solar").innerHTML = "Sunny";
        }
        else if (data.field3 == 0) {
          document.getElementById("Weather_Solar").innerHTML = "No Sun";
        }
        
        if(data.field4 == 1) {
          document.getElementById("Weather_Wind").innerHTML = "Windy";
        }
        else if (data.field4 == 0) {
          document.getElementById("Weather_Wind").innerHTML = "No Wind";
        }
      }
    //   else {
    //     document.getElementById("PF_Solar").innerHTML = "error";
    //   }
    };
    xhttp.open("GET", url3, true);
    xhttp.send();
};

function Notify() {
  if((DC_Vol_Solar < 1 && DC_Cur_Solar < 1 && DC_Pow_Solar)
  && Weather_Solar == 1) {
    document.getElementById("Notify_Solar").innerHTML = "The solar power station suffered a problem";
  }
  else if((DC_Vol_Solar >= 1 || DC_Cur_Solar >= 1 || DC_Pow_Solar >= 1 || AC_Vol_Solar != 0 || AC_Cur_Solar != 0 || AC_Pow_Solar != 0 || Energy_Solar != 0 || Fre_Solar != 0 || PF_Solar != 0)
  && Weather_Solar == 0) {
    document.getElementById("Notify_Solar").innerHTML = "The data collection system is in trouble";
  }
  else {
    document.getElementById("Notify_Solar").innerHTML = "No problem";
  };

  if((DC_Vol_Wind < 1 && DC_Cur_Wind < 1 && DC_Pow_Wind < 1)
  && Weather_Wind == 1) {
    document.getElementById("Notify_Wind").innerHTML = "The wind power station suffered a problem";
  }
  else if((DC_Vol_Wind >= 1 || DC_Cur_Wind >= 1 || DC_Pow_Wind >= 1 || AC_Vol_Wind != 0 || AC_Cur_Wind != 0 || AC_Pow_Wind != 0 || Energy_Wind != 0 || Fre_Wind != 0 || PF_Wind != 0)
  && Weather_Wind == 0) {
    document.getElementById("Notify_Wind").innerHTML = "The data collection system is in trouble";
  }
  else {
    document.getElementById("Notify_Wind").innerHTML = "No problem";
  };

};

setInterval(Solar_Data, 2000);
setInterval(Wind_Data, 2000);
setInterval(Third_Data, 2000);
setInterval(Notify, 2000);


// var year = "2018";
// const d = new Date(year, 11, 24, 10, 33, 30, 0);
// console.log(d);

// setInterval(myTimer, 1000);

// function myTimer() {
//   const d = new Date();
//   // document.getElementById("demo").innerHTML = d.toLocaleTimeString();
//   // console.log(d.toLocaleTimeString());
//   console.log(d);
// }

// const d = new Date(2018, 11, 24, 10, 33, 30);
// const d1 = new Date(2018, 11, 24, 10, 33, 31);
// console.log(d1 - d);