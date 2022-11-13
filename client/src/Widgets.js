import React from "react";
import "./Widgets.css";
import { TwitterTimelineEmbed, TwitterShareButton } from "react-twitter-embed";
import SearchIcon from "@material-ui/icons/Search";

function Widgets(){
    return (
      <div className="widgets">
        <div className="widgets__input">
          <SearchIcon className="widgets__searchIcon" />
          <input placeholder="Search Twitter" type="text" />
        </div>
  
        <div className="widgets__widgetContainer">
          <h2>What's happening</h2>
  
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="paulayes44"
            options={{ height: 350 }}
          />

          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="Paca117"
            options={{ height: 350 }}
          />
  
          <TwitterShareButton
            url={"https://www.youtube.com/watch?v=EBYsx1QWF9A&t=4s&ab_channel=AdultSwim"}
            options={{ text: "This is an awesome video, you should check it out", via: "cleverqazi" }}
          />
        </div>
      </div>
    );

}

export default Widgets;