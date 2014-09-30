      function postTweets(){
        var elem = document.getElementById('tweetspace');
        var scrolledToBottom = elem.scrollTop===0;      
        
        //iterates for all tweets not already added to DOM.
        while(index < streams.home.length){
          var tweet = streams.home[index];
              
          //creates a formatted date string e.g. [14:42:07]
          var dateString = '[' +  tweet.created_at.getHours() + 
                           ":" + (tweet.created_at.getMinutes()<10 ? '0' + tweet.created_at.getMinutes() : tweet.created_at.getMinutes()) +
                           ":" + (tweet.created_at.getSeconds()<10 ? '0' + tweet.created_at.getSeconds() : tweet.created_at.getSeconds()) + 
                           ']';

          //generates tweet HTML object and appends to DOM
          var $tweet = $("<div class='tweet' data-author="+tweet.user+"></div>");
          $tweet.html("<div class='FTheader'> \
                        <span class='FTauthor'>"+userdata[tweet.user].name+"</span> \
                        <span class='FThandle'> "+userdata[tweet.user].handle+"</span> \
                        <span class='FTtimestamp'>"+  dateString+"</span> \
                      </div> \
                      <div class ='FTtext'>" + tweet.message + "</div> \
                      <img class ='FTpic' src="+userdata[tweet.user].image+">");
          $tweet.prependTo($('.tweetspace'));



          //auto-scrolls to top of tweet window, IF user was currently viewing the top.
          if(displaySetting != tweet.user && displaySetting != "ShowAll") $('.tweet:last').hide();
          if(scrolledToBottom) elem.scrollTop = 0;
          index += 1;
        }
      }  



      //setup global variables and user name
      var index = 0; 
      var displaySetting = "ShowAll"; 
      var userdata = {
        mracus : { 
          name: "Marcus Philips",
          image: "marcus.jpeg",
          handle: "@mracus"
        },
        shawndrost : {
          name: "Shawn Drost",
          image: "shawn.png",
          handle: "@shawndrost"
        },
        douglascalhoun : {
          name: "Douglas Calhoun",
          image: "douglas.JPG",
          handle: "@douglascalhoun"
        },
        sharksforcheap : {
          name: "Anthony Philips",
          image: "sharks.jpeg",
          handle: "@sharksforcheap"
        }
      };
      var user = prompt("Welcome to Twittler! Please enter your username.","name");
      if(user===null) user = "anon";
      streams.users[user] = [];
      userdata[user] = {
        name: user,
        handle: "@"+(user.split(' ').join('').toLowerCase()),
        image: "ducky.jpg"
      };

      //add buttons and other session-specific DOM elements
      $('#loggedInAs').append("<div>Logged in as '" + user + "'.</div> <br> <div>Showing tweets from: </div>");
      $('#buttons').append("<button class='active UsrButton' id='ShowAll'>Show All</button>");
      for (var i = 0; i < users.length; i++) {
        $('#buttons').append("<button class='UsrButton inactive' id='"+users[i]+"'>@" + users[i] + "</button>");
      }
      $('#buttons').append("<button class='UsrButton inactive' id='"+user+"'>@" + user + "</button><br><br>");
      $('#buttons').append("<button class='active' id='AutoRefreshToggle'>Auto Refresh</button>");
      $('#buttons').append("<button id='ManuallyUpdateTweets'>Get new tweets</button>");

      //check for new tweets, and set up a recurring interval to automatically retrieve more tweets every half second.
      postTweets();
      setInterval(function(){
        //add check here: only continue if "auto" is set to "on."
        if($('#AutoRefreshToggle').hasClass('active')) postTweets();    
      },500);


      //on click, make the clicked UsrButton the only active one. update which tweets are displayed or hidden.
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
          $('[data-author="'+displaySetting+'"]').show();
        }
      });

      //on click, post new tweet from input box.
      $('.TwtButton').on('click',function(){
        var tweet = {};
        tweet.user = user;
        tweet.message = $('input').val();
        tweet.created_at = new Date();
        streams.users[user].push(tweet);
        streams.home.push(tweet);
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
          button.addClass('active');

        }
      });

      //on click, check for new tweets.
      $('#ManuallyUpdateTweets').on('click',function(){
        postTweets();
      });



