
// (function () {

    // H	Hit
    // S	Stand
    // P	Split
    // Dh	Double if possible, otherwise Hit
    // Ds	Double if possible, otherwise Stand
    // Rh	Surrender if possible, otherwise Hit

    // Qh   Split if DoubleAfterSplit, otherwise Hit
    // Qd   Split if DAS, otherwise Double
    // Qs   Split if DAS, otherwise Stand

    var playMap = {
        "H"  :  "Hit",
        "S"	 :  "Stand",
        "P"	 :  "Split",
        "DH" : 	"Double or Hit",
        "DS" :	"Double or Stand",
        "RH" :	"Surrender or Hit",
        "QH" :  "Split if DoubleAfterSplit, otherwise Hit",
        "QD" :  "Split if DAS, otherwise Double",
        "QS" :  "Split if DAS, otherwise Stand"
    }

    // 4+ decks, Dealer stands Soft 17, Peek (should change this)

    var hard = [
        [], [], [], [], [],                                               // Hard  0-4 don't exist
        //    A,   2,    3,    4,    5,    6,    7,    8,    9,   10
        [0,  "H", "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"],   // Hard  5
        [0,  "H", "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"],   // Hard  6
        [0,  "H", "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"],   // Hard  7
        [0,  "H", "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H",  "H"],   // Hard  8
        [0,  "H", "H", "DH", "DH", "DH", "DH",  "H",  "H",  "H",  "H"],   // Hard  9
        [0,  "H","DH", "DH", "DH", "DH", "DH", "DH", "DH", "DH",  "H"],   // Hard 10
        [0,  "H","DH", "DH", "DH", "DH", "DH", "DH", "DH", "DH", "DH"],   // Hard 11
        [0,  "H", "H",  "H",  "S",  "S",  "S",  "H",  "H",  "H",  "H"],   // Hard 12
        [0,  "H", "S",  "S",  "S",  "S",  "S",  "H",  "H",  "H",  "H"],   // Hard 13
        [0,  "H", "S",  "S",  "S",  "S",  "S",  "H",  "H",  "H",  "H"],   // Hard 14
        [0,  "H", "S",  "S",  "S",  "S",  "S",  "H",  "H",  "H", "RH"],   // Hard 15
        [0, "RH", "S",  "S",  "S",  "S",  "S",  "H",  "H", "RH", "RH"],   // Hard 16
        [0,  "S", "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"],   // Hard 17
        [0,  "S", "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"],   // Hard 18
        [0,  "S", "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"],   // Hard 19
        [0,  "S", "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"],   // Hard 20
        [0,  "S", "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"],   // Hard 21
    ];

    var soft = [
        [], [], [],                                                       // Soft  0-2 don't exist
        //   A,    2,    3,    4,    5,    6,    7,    8,    9,   10
        [0, "H",  "H",  "H", "DH", "DH",  "H",  "H",  "H",  "H",  "H"],   // Soft 13 (3=A+2)
        [0, "H",  "H",  "H", "DH", "DH",  "H",  "H",  "H",  "H",  "H"],   // Soft 14
        [0, "H",  "H", "DH", "DH", "DH",  "H",  "H",  "H",  "H",  "H"],   // Soft 15
        [0, "H",  "H", "DH", "DH", "DH",  "H",  "H",  "H",  "H",  "H"],   // Soft 16
        [0, "H", "DH", "DH", "DH", "DH",  "H",  "H",  "H",  "H",  "H"],   // Soft 17
        [0, "S", "DS", "DS", "DS", "DS",  "S",  "S",  "H",  "H",  "H"],   // Soft 18
        [0, "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"],   // Soft 19
        [0, "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"],   // Soft 20
        [0, "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"]    // Soft 21  (A+10)
    ];
    var pair = [
        [], [],                                                                      // 0-1 don't exist
        //   A,    2,    3,    4,    5,    6,    7,    8,    9,   10
        [0, "P",  "P",  "P",  "P",  "P",  "P",  "P",  "P",  "P",  "P"],    // A,A
        [],
        [0, "H", "QH", "QH",  "P",  "P",  "P",  "P",  "H",  "H",  "H"],   // 2,2 = 4
        [],
        [0, "H", "QH", "QH",  "P",  "P",  "P",  "P",  "H",  "H",  "H"],   // 3,3
        [],
        [0, "H",  "H",  "H",  "H", "QH", "QH",  "H",  "H",  "H",  "H"],   // 4,4
        [],
        [0, "H", "DH", "DH", "DH", "DH", "DH", "DH", "DH", "DH",  "H"],   // 5,5
        [],
        [0, "H", "QH",  "P",  "P",  "P",  "P",  "H",  "H",  "H",  "H"],   // 6,6
        [],
        [0, "H",  "P",  "P",  "P",  "P",  "P",  "P",  "H",  "H",  "H"],   // 7,7
        [],
        [0, "P",  "P",  "P",  "P",  "P",  "P",  "P",  "P",  "P",  "P"],   // 8,8
        [],
        [0, "S",  "P",  "P",  "P",  "P",  "P",  "S",  "P",  "P",  "S"],   // 9,9
        [],
        [0, "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S",  "S"]    // T,T

    ];


   // hard[user][dealer];

    var dealer, yours = 0;

    var dealerPrint = document.getElementById("dealer-card");
    var yoursPrint = document.getElementById("your-card");
    var actionPrint = document.getElementById("action");

    var dealerSection = document.querySelector(".dealer");
    var yoursSection = document.querySelector(".yours");

    // Dealer card change
    dealerSection.addEventListener('click', function (evt) {
       if (evt.target.nodeName === "BUTTON") {
           dealer = parseInt(evt.target.textContent);
           dealerPrint.textContent = dealer;
           updateAction();
       }
    }, false);


    // User card change
    yoursSection.addEventListener('click', function (evt) {

        if (evt.target.className === "clear") {
            yours = 0;
        } else if (evt.target.nodeName === "BUTTON") {
            yours += parseInt(evt.target.textContent);
        }

        yoursPrint.textContent = yours;
        updateAction();
    }, false);



    function updateAction() {
        actionPrint.textContent = playMap[hard[yours][dealer]];
    }





// })();