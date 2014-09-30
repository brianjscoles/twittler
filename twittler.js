      
      //checks data structure for unposted tweets and adds all of them to the DOM.
      function postTweets(){
        var elem = document.getElementById('tweetspace');
        var scrolledToTop = elem.scrollTop===0;      
        
        //iterates for all tweets not already added to DOM.
        while(index < streams.home.length){
          var tweet = streams.home[index];
              
          //creates a formatted date string e.g. [14:42:07]

          var dateString = tweet.created_at.getFullYear() + "-" + 
                              ((tweet.created_at.getMonth()+1 <10) ? '0' + (tweet.created_at.getMonth()+1) : (tweet.created_at.getMonth()+1)) + "-" +
                              (tweet.created_at.getUTCDate() <10 ? '0' + tweet.created_at.getUTCDate() : tweet.created_at.getUTCDate()) + "-" +
                              (tweet.created_at.getHours() <10 ? '0' + tweet.created_at.getHours() : tweet.created_at.getHours()) + "-" +
                              (tweet.created_at.getMinutes()<10 ? '0' + tweet.created_at.getMinutes() : tweet.created_at.getMinutes()) + "-" +
                              (tweet.created_at.getSeconds()<10 ? '0' + tweet.created_at.getSeconds() : tweet.created_at.getSeconds());

          //generates tweet HTML object and appends to DOM
          var $tweet = $("<div class='tweet' data-author="+tweet.user+"></div>");
          $tweet.html("<div class='FTheader'> \
                        <span class='FTauthor'>"+userdata[tweet.user].name+"</span> \
                        <a href='#' title='See all tweets from this user' class='FThandle'> "+userdata[tweet.user].handle+"</a> \
                        <span> - </span> \
                        <span class='FTtimestamp' data-timestamp=' "+dateString+" '>"+  moment(tweet.created_at).fromNow()+"</span> \
                      </div> \
                      <div class ='FTtext'>" + tweet.message + "</div> \
                      <img class ='FTpic' src="+userdata[tweet.user].image+">");
          $tweet.prependTo($('.tweetspace'));



          //auto-scrolls to top of tweet window, IF user was currently viewing the top.
          if(displaySetting != tweet.user && displaySetting != "ShowAll"){
            $('.tweet:first').hide();
          }
          if(scrolledToTop) elem.scrollTop = 0;
          else elem.scrollTop = elem.scrollTop + 97;
          index += 1;
        }
      }  

      //pulls text from the input box and pushes it to data structure as a new tweet.
      function submitUserTweet(){
        var tweet = {};
        tweet.user = username;
        tweet.message = $('#draft').val();
        tweet.created_at = new Date();
        streams.users[username].push(tweet);
        streams.home.push(tweet);
        $('#draft').val('');
      }



      //set up global variables
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
      
      //set up active user account based on input
      var user = prompt("Welcome to Twittler! Please enter your username.","name");
      if(user===null) user = "anon";
      var username = user.split(' ').join('').toLowerCase();
      streams.users[username] = [];
      userdata[username] = {
        name: user,
        handle: "@"+username,
        image: "ducky.jpg"
      };

      //add buttons and other session-specific DOM elements
      $('#loggedInAs').append("<div>Logged in as '" + userdata[username].name + "'.</div> <br> <div>Showing tweets from: </div>");
      $('#buttons').append("<button class='active UsrButton' id='ShowAll'>Show All</button>");
      for (var i = 0; i < users.length; i++) {
        $('#buttons').append("<button class='UsrButton' id='"+users[i]+"'>" + userdata[users[i]].handle + "</button>");
      }
      $('#buttons').append("<button class='UsrButton' id='"+username+"'>" + userdata[username].handle + "</button><br><br>");
      $('#buttons').append("<button class='active' id='AutoRefreshToggle'>Auto Refresh: ON</button>");
      $('#buttons').append("<button class='pushButton' id='ManuallyUpdateTweets'>Get new tweets</button>");



      
      /* 
       * Event handlers and auto-recurring functions
       */


      //automatically retrieve and post more tweets every half second.
      setInterval(function(){
        //add check here: only continue if "auto" is set to "on."
        if($('#AutoRefreshToggle').hasClass('active')) postTweets();    
      },500);

      
      //check and update relative time stamps every 15 seconds.
      setInterval(function(){
        $('.FTtimestamp').each(function( i ) {
          $(this).text(moment(this.dataset.timestamp,"YYYY-MM-DD-HH-mm-ss").fromNow());
        });
      },9000)
      

      //on click, make the clicked UsrButton the only active one. update which tweets are displayed or hidden.
      $('.UsrButton').on('click',function(){
        $('.UsrButton').removeClass('active');
        $(this).addClass('active');
        displaySetting = $(this).attr('id');
        if(displaySetting=="ShowAll"){
          $('.tweet').show();
        } else {
          $('.tweet').hide();
          $('[data-author="'+displaySetting+'"]').show();
        }
      });

      //on click or "enter" keypress, post new tweet from input box.
      $('#TwtButton').on('click',function(){
        submitUserTweet();
      })
      $('#draft').bind('keypress', function(e) {
        if(e.keyCode==13){
          submitUserTweet();
        };
      });


      //if the handle in a tweet is clicked: display only that user's tweets.
      $('body').on('click','.FThandle',function(){
        var author = $(this).closest('.tweet').data("author");
        $('#'+author).trigger('click');
      });

      
      //on click, toggle the "Auto Refresh" option.
      $('#AutoRefreshToggle').on('click',function(){
        var $this = $(this);
        if ($this.hasClass('active')) $this.text("Auto Refresh: OFF");
        else $this.text("Auto Refresh: ON");
        $(this).toggleClass('active');
      });

      //on click, check for new tweets.
      $('#ManuallyUpdateTweets').on('click',function(){
        postTweets();
      });



