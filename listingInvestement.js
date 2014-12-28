(function(){



    waitForPageLoaded();
    function waitForPageLoaded(){

        var investementTableInfo = document.getElementById('my_investments-table_info');
        var regex = /Showing [0-9]* to [0-9]* of ([0-9]*) entries/

        if(investementTableInfo && regex.test(investementTableInfo.textContent)){

            loadAllInvestement(regex.exec(investementTableInfo.textContent)[1]);
        }
        else setTimeout(waitForPageLoaded, 100);
    }

    function loadAllInvestement(totalNumber){

        var paymentStatusRegex = /([0-9]*) of ([0-9]*)/;
        var investedRegex = /฿(\d+.\d+) <br\/>฿(\d+.\d+)/;

        var request = new XMLHttpRequest();
        request.open('get', 'https://btcjam.com/listing_investments.json?iDisplayStart=0&iDisplayLength=' + totalNumber, true);

        request.onload = function(){
            var investements = JSON.parse(this.responseText).aaData;

            var currentlyInvested = 0;
            var totalInvested = 0;

            for(var i in investements){
                var investement = investements[i];
                var paymentStatus = paymentStatusRegex.exec(investement[3]);


                var totalPayments = +paymentStatus[2];
                var remainingPayments = +totalPayments - +paymentStatus[1];

                var invested = parseFloat(investedRegex.exec(investement[2])[1]);


                totalInvested += invested;
                currentlyInvested += invested * (remainingPayments / totalPayments);
            }

            totalInvested = totalInvested.toFixed(8);
            currentlyInvested = currentlyInvested.toFixed(8);


            var investementTitle = document.querySelector('#body .col-md-12 .widgetlight h3');
            investementTitle.textContent += ' - ฿' + currentlyInvested + ' currently invested';
        };
        request.send();
    }
})();
