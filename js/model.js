
var Game = Backbone.Model.extend({

    defaults: function() {
        return {
            nShoes : 6,
            doubleAfterSplit: true,
            surrender: false
            // blackjack : 3/2, 6/5...
            // hitSoft17 : Dealer hits on soft 17
            // Dealer pick

            // order: Todos.nextOrder(),
        };
    },

    toggle: function() {
    this.save({done: !this.get("done")});
}

});


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
    [0, "H",  "H",  "H",  "H", "DH", "DH",  "H",  "H",  "H",  "H"],   // Soft 13 (3=A+2)
    [0, "H",  "H",  "H",  "H", "DH", "DH",  "H",  "H",  "H",  "H"],   // Soft 14
    [0, "H",  "H",  "H", "DH", "DH", "DH",  "H",  "H",  "H",  "H"],   // Soft 15
    [0, "H",  "H",  "H", "DH", "DH", "DH",  "H",  "H",  "H",  "H"],   // Soft 16
    [0, "H",  "H", "DH", "DH", "DH", "DH",  "H",  "H",  "H",  "H"],   // Soft 17
    [0, "H",  "S", "DS", "DS", "DS", "DS",  "S",  "S",  "H",  "H"],   // Soft 18
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


// (function($){

    /*var AppView = Backbone.View.extend({
        el: $('.backbone'), // attaches `this.el` to an existing element.

        events: {
            'click .dealer>button': 'dealerCard'
        },
        initialize: function() {
            _.bindAll(this, 'render'); // fixes loss of context for 'this' within methods
            this.dealerCard = 0;
            this.render(); // not all views are self-rendering. This one is.
        },
        dealerCard: function (evt) {
            console.log(evt);
            this.dealerCard++;
            $('ul', this.el).append("<li>Card "+this.dealerCard+"</li>");
        },

        render: function(){
            $(this.el).append("<ul> <li>hello world</li> </ul>");
        }
    });

    var appView = new AppView();*/


/***** PUT KEY BINDINGS TO A BACKBONE VIEW/MODEL **********/

    // Keyboard events: detect numbers pressed
    var key0 = 48, numpad0 = 96;

    // Autofocus won't work on normal elements (not form)
    document.getElementById("dealer").focus();

    document.body.addEventListener('keydown', function(evt) {
        var key = evt.keyCode, card = -1,
            player;

        // Right arrow to focus next section
        if (key === 39) {
            var currentIndex = parseInt(document.activeElement.getAttribute('tabindex'));
            var $nextTabElement = $('[tabindex='+ (currentIndex+1) +']');
            if ($nextTabElement.length)
                $nextTabElement.focus();
            return;
        } else if (key === 37) {
            // Left arrow to focus previous section
            var currentIndex = parseInt(document.activeElement.getAttribute('tabindex'));
            var $previousTabElement = $('[tabindex='+ (currentIndex-1) +']');
            if ($previousTabElement.length)
                $previousTabElement.focus();
            return;
        }


        // Numeric keys
        if (key >= key0 && key < key0+11) {
            card = key - key0;
        } else
        // Numpad
        if (key >= numpad0 && key < numpad0+11) {
            card = key - numpad0;
        }

        if (card > -1) {
            // Trigger click and highlight button
            if (dealer.get('card') > 0) {
                player = document.activeElement;
            } else {
                player = document.getElementById("dealer");
                document.getElementById("yours").focus();
            }

            var $button = $("button[value='"+card+"']", $(player));
            $button.trigger('click').addClass('clicked'); // .parent().focus();

            // Add card to the count
            count.addCard(card);

            setTimeout(function() {
                $button.removeClass('clicked');
            }, 300);

        }


    }, false);



    /*******************    DEALER CARD     *****************/

    var Dealer = Backbone.Model.extend({
        defaults: {
            card: 0
        }
        /*promptColor: function() {
            var cssColor = prompt("Please enter a CSS color:");
            this.set({color: cssColor});
        }*/
    });

    // Dealer card
    var DealerView = Backbone.View.extend({
        el: '#dealer',
        events: {
            'click button': 'dealerCard'
        },

        initialize: function () {
            this.$card = $(".dealer-card", this.$el);
            this.model.on("change", this.render, this);
        },

        dealerCard: function (evt) {
            if (evt.target.nodeName === "BUTTON") {
                var card = parseInt(evt.target.textContent);
                this.model.set('card', card);
                // this.$card.text(dealer);
                // updateAction();
                // modelAction update
            }
        },

        render: function () {
            this.$card.text(this.model.get('card'));
            return this;
        }
    });



    /********************     USER CARD     *****************/

    var User = Backbone.Model.extend({
        defaults: {
            total: 0,
            nCards: 0,  // # cards
            soft: false, // hasAs
            pairs: false
        },
        /*initialize: function () {
            this.on('change', function (model, options) {
            });
        },
        */
        addCard: function (card) {
            var total = this.get('total'),
                nCards = this.get('nCards');

            card = parseInt (card);
            // Detect Soft Hand
            if(card === 1 && !this.get('soft')) {
                this.set('soft', true);
                card = 11;
            }

            // Detect pairs
            else if(nCards === 1 && card === total) {
                this.set('pairs', true);
            } else {
                this.set('pairs', false);
            }

            total += card;
            if (total > 21 && this.get('soft')) {
                total -= 10;
                this.set('soft', false);
            }

            this.set('nCards', nCards+1);
            this.set('total', total);
        },

        clear: function () {
            this.set({'total': 0, 'soft': false, 'pairs': false, 'nCards': 0});
        },

        toString: function () {
            var soft = this.get('soft'),
                total = this.get('total'),
                pairs = this.get('pairs'),
                str = "";

            if (pairs) {
                str = "Pairs "
            }
            else if (soft) {
                str = "Soft ";
            }
            str += total;

            if (total > 21) {
                str += " BUSTED";
            }
            return str;
        }
    });


    // User card
    var UserView = Backbone.View.extend({
        el: '#yours',
        events: {
            'click button': 'userCard'
        },
        initialize: function () {
            this.$card = $(".your-card", this.$el);
            this.model.on("change:total", this.render, this);
        },

        userCard: function (evt) {
            if (evt.target.nodeName === "BUTTON") {
                if (evt.target.className === "clear") {
                    this.model.clear();
                } else if (evt.target.nodeName === "BUTTON") {
                    this.model.addCard(evt.target.textContent);
                }

                // this.$card.text(this.total);
                // updateAction();
                // modelAction update
            }

        },

        render: function () {
            this.$card.text(this.model);
            return this;
        }
    });




    /********************     RECOMMENDED ACTION     *****************/
    // Receives both models Dealer & User as params

    var ActionView = Backbone.View.extend({
        el: '#action',

        initialize: function (options) {
            if (options.dealer && options.user) {
                this.dealer = options.dealer;
                this.user = options.user;

                this.user.on("change:total", this.render, this);
            }
        },

        render: function () {
            var dealerCard = this.dealer.get('card'),
                userTotal = this.user.get('total');
            if (userTotal === 0) {
                this.$el.text("");
                return;
            }
            if (dealerCard && userTotal < 22) {
                var play;
                if (this.user.get('pairs')) {
                    play = playMap[pair[userTotal][dealerCard]];
                } else if (this.user.get('soft')) {
                    play = playMap[soft[userTotal-10][dealerCard]];
                } else {
                    play = playMap[hard[userTotal][dealerCard]];
                }

                if (play)
                    this.$el.text(play);
            }
        }
    });



    /********************     COUNT     *****************/
    // Receives both models Dealer & User as params

    var Count = Backbone.Model.extend({
        defaults: {
            count: 0,
            nCards: 0
        },
        addCard: function(card) {
            if (card <= 1) {
                this.set('count', this.get('count') - 1);
            } else if (card < 7) {
                this.set('count', this.get('count') + 1);
            }

            this.set('nCards', this.get('nCards') + 1);
        }
    });

    // User card
    var CountView = Backbone.View.extend({
        el: '#count',
        events: {
            'click button': 'resetCount'
        },
        initialize: function () {
            this.$count = $(".count", this.$el);
            this.model.on("change:count", this.render, this);
        },
        resetCount: function () {
            this.model.set({'count': 0, 'nCards' : 0});
        },
        render: function () {
            this.$count.text(this.model.get('count'));
            return this;
        }
    });





    var dealer = new Dealer ();
    var dealerView = new DealerView({model: dealer});
    var user = new User ();
    var userView = new UserView({model: user});

    var count = new Count();
    var countView = new CountView({model: count});

    var actionView = new ActionView({dealer: dealer, user: user});



// })(jQuery);