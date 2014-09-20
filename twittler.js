function postTweets(){
          var elem = document.getElementById('tweetspace');
          var scrolledToBottom = elem.scrollTop===elem.scrollHeight-elem.clientHeight;      
        
        //iterates for all tweets not already added to DOM.
        while(index < streams.home.length){
          var tweet = streams.home[index];
              
          //creates a formatted date string e.g. [14:42:07]
          var dateString = '[' +  tweet.created_at.getHours() + 
                           ":" + (tweet.created_at.getMinutes()<10 ? '0' + tweet.created_at.getMinutes() : tweet.created_at.getMinutes()) +
                           ":" + (tweet.created_at.getSeconds()<10 ? '0' + tweet.created_at.getSeconds() : tweet.created_at.getSeconds()) + 
                           ']';

          //generates tweet HTML object and appends to DOM
          var $tweet = $("<div class='tweet "+tweet.user+"'>"+ dateString + ' <b>@' + tweet.user + '</b>: ' + tweet.message + "</div>");
          $tweet.appendTo($('.tweetspace'));

          //auto-scrolls to new bottom of tweet window, IF user was currently viewing the bottom.
          if(displaySetting != tweet.user && displaySetting != "ShowAll") $('.tweet:last').hide();
          if(scrolledToBottom) elem.scrollTop = elem.scrollHeight;
          index += 1;
        }
      }      

      //setup global variables and user name
      var index = 0; 
      var displaySetting = "ShowAll"; 
      var user = prompt("Welcome to Twittler! Please enter your username.","name");
      if(user===null) user = "anon";
      streams.users[user] = [];

      //add buttons and other session-specific DOM elements
      $('#loggedInAs').append("<div>Logged in as '" + user + "'.</div> <br> <div>Showing tweets from: </div>");
      $('#buttons').append("<button class='active UsrButton' id='ShowAll'>Show All</button>");
      for (var i = 0; i < users.length; i++) {
        $('#buttons').append("<button class='UsrButton inactive' id='"+users[i]+"'>@" + users[i] + "</button>");
      }
      $('#buttons').append("<button class='UsrButton inactive'>@" + user + "</button><br><br>");
      $('#buttons').append("<button class='active' id='AutoRefreshToggle'>Auto Refresh</button>");
      $('#buttons').append("<button id='ManuallyUpdateTweets'>Get new tweets</button>");

      //check for new tweets, and set up a recurring interval to automatically retrieve more tweets every half second.
      postTweets();
      setInterval(function(){
        //add check here: only continue if "auto" is set to "on."
        if($('#AutoRefreshToggle').hasClass('active')) postTweets();    
      },500);



      //watch for click.  make the clicked button the only active one. update which tweets are displayed or hidden.
      $('.UsrButton').on('click',function(){
        $('.UsrButton').removeClass('active');
        $('.UsrButton').addClass('inactive');
        $(this).removeClass('inactive');
        $(this).addClass('active');
        displaySetting = $(this).attr('id');
        if(displaySetting=="ShowAll"){
          $('.tweet').show();
        } else {
          $('.tweet').hide();
          $('.'+displaySetting).show();
        }
      });

      //on click, post new tweet from input box.
      $('.TwtButton').on('click',function(){
        var tweet = {}
        tweet.user = user;
        tweet.message = $('input').val();
        tweet.created_at = new Date();
        streams.users[user].push(tweet);
        streams.home.push(tweet);
        console.log(tweet);
        $('input').val('');
      })
      
      //on click, toggle the "Auto Refresh" option.
      $('#AutoRefreshToggle').on('click',function(){
        var button = $(this);
        if(button.hasClass('active')){
          button.removeClass('active');
          button.addClass('inactive');
        } else {
          button.removeClass('inactive');
          button.addClass('active')
        }
      });

      //on click, check for new tweets.
      $('#ManuallyUpdateTweets').on('click',function(){
        postTweets();
      });



