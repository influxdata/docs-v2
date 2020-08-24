---
title: Creating a live leaderboard for game scores
description: Tutorial on using Chronograf to build a leaderboard for gamers to be able to see player scores in realtime. Historical data is also available for post-game analysis.
menu:
  chronograf_1_6:
    name: Live leaderboard of game scores
    weight: 20
    parent: Guides
draft: true
---

**If you do not have a running Kapacitor instance, check out [Getting started with Kapacitor](/kapacitor/v1.4/introduction/getting-started/) to get Kapacitor up and running on localhost.**

Today we are game developers.
We host a several game servers, each running an instance of the game code, with about a hundred players per game.

We need to build a leaderboard so that spectators can see player scores in realtime.
We would also like to have historical data on leaders in order to do postgame
analysis on who was leading for how long, etc.

We will use Kapacitor stream processing to do the heavy lifting for us.
The game servers can send a [UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol) packet whenever a player's score changes,
or every 10 seconds if the score hasn't changed.

### Setup

>  **Note:** Copies of the code snippets used here can be found in the  [scores](https://github.com/influxdata/kapacitor/tree/master/examples/scores) example in Kapacitor project on GitHub.

First, we need to configure Kapacitor to receive the stream of scores.
In this example, the scores update too frequently to store all of the score data in a InfluxDB database, so the score data will be semt directly to Kapacitor.
Like InfluxDB, you can configure a UDP listener.

Add the following settings the `[[udp]]` secton in  your Kapacitor configuration file (`kapacitor.conf`).

```
[[udp]]
    enabled = true
    bind-address = ":9100"
    database = "game"
    retention-policy = "autogen"
```

Using this configuration, Kapacitor will listen on port `9100` for UDP packets in [Line Protocol](/{{< latest "influxdb" "v1" >}}/write_protocols/line_protocol_tutorial/) format.
Incoming data will be scoped to be in the `game.autogen` database and retention policy.
Restart Kapacitor so that the UDP listener service starts.

Here is a simple bash script to generate random score data so we can test it without
messing with the real game servers.

```bash
#!/bin/bash

# default options: can be overriden with corresponding arguments.
host=${1-localhost}
port=${2-9100}
games=${3-10}
players=${4-100}

games=$(seq $games)
players=$(seq $players)
# Spam score updates over UDP
while true
do
    for game in $games
    do
        game="g$game"
        for player in $players
        do
            player="p$player"
            score=$(($RANDOM % 1000))
            echo "scores,player=$player,game=$game value=$score" > /dev/udp/$host/$port
        done
    done
    sleep 0.1
done
```

Place the above script into a file `scores.sh` and run it:

```bash
chmod +x ./scores.sh
./scores.sh
```

Now we are spamming Kapacitor with our fake score data.
We can just leave that running since Kapacitor will drop
the incoming data until it has a task that wants it.

### Defining the Kapacitor task

What does a leaderboard need to do?

1. Get the most recent score per player per game.
1. Calculate the top X player scores per game.
1. Publish the results.
1. Store the results.

To complete step one we need to buffer the incoming stream and return the most recent score update per player per game.
Our [TICKscript](/kapacitor/v1.4/tick/) will look like this:

```javascript
var topPlayerScores = stream
    |from()
        .measurement('scores')
        // Get the most recent score for each player per game.
        // Not likely that a player is playing two games but just in case.
        .groupBy('game', 'player')
    |window()
        // keep a buffer of the last 11s of scores
        // just in case a player score hasn't updated in a while
        .period(11s)
        // Emit the current score per player every second.
        .every(1s)
        // Align the window boundaries to be on the second.
        .align()
    |last('value')
```

Place this script in a file called `top_scores.tick`.

Now our `topPlayerScores` variable contains each player's most recent score.
Next to calculate the top scores per game we just need to group by game and run another map reduce job.
Let's keep the top 15 scores per game.
Add these lines to the `top_scores.tick` file.

```javascript
// Calculate the top 15 scores per game
var topScores = topPlayerScores
    |groupBy('game')
    |top(15, 'last', 'player')
```

The `topScores` variable now contains the top 15 player's score per game.
All we need to be able to build our leaderboard.
Kapacitor can expose the scores over HTTP via the [HTTPOutNode](/kapacitor/v1.4/nodes/http_out_node/).
We will call our task `top_scores`; with the following addition the most recent scores will be available at
`http://localhost:9092/kapacitor/v1/tasks/top_scores/top_scores`.

```javascript
// Expose top scores over the HTTP API at the 'top_scores' endpoint.
// Now your app can just request the top scores from Kapacitor
// and always get the most recent result.
//
// http://localhost:9092/kapacitor/v1/tasks/top_scores/top_scores
topScores
   |httpOut('top_scores')
```

Finally we want to store the top scores over time so we can do in depth analysis to ensure the best game play.
But we do not want to store the scores every second as that is still too much data.
First we will sample the data and store scores only every 10 seconds.
Also let's do some basic analysis ahead of time since we already have a stream of all the data.
For now we will just do basic gap analysis where we will store the gap between the top player and the 15th player.
Add these lines to `top_scores.tick` to complete our task.

```javascript
// Sample the top scores and keep a score once every 10s
var topScoresSampled = topScores
    |sample(10s)

// Store top fifteen player scores in InfluxDB.
topScoresSampled
    |influxDBOut()
        .database('game')
        .measurement('top_scores')

// Calculate the max and min of the top scores.
var max = topScoresSampled
    |max('top')

var min = topScoresSampled
    |min('top')

// Join the max and min streams back together and calculate the gap.
max
    |join(min)
        .as('max', 'min')
    // Calculate the difference between the max and min scores.
    // Rename the max and min fields to more friendly names 'topFirst', 'topLast'.
    |eval(lambda: "max.max" - "min.min", lambda: "max.max", lambda: "min.min")
        .as('gap', 'topFirst', 'topLast')
    // Store the fields: gap, topFirst and topLast in InfluxDB.
    |influxDBOut()
        .database('game')
        .measurement('top_scores_gap')
```

Since we are writing data back to InfluxDB create a database `game` for our results.

```
curl -G 'http://localhost:8086/query?' --data-urlencode 'q=CREATE DATABASE game'
```

Here is the complete task TICKscript if you don't want to copy paste as much :)

```javascript
dbrp "game"."autogen"

// Define a result that contains the most recent score per player.
var topPlayerScores = stream
    |from()
        .measurement('scores')
        // Get the most recent score for each player per game.
        // Not likely that a player is playing two games but just in case.
        .groupBy('game', 'player')
    |window()
        // keep a buffer of the last 11s of scores
        // just in case a player score hasn't updated in a while
        .period(11s)
        // Emit the current score per player every second.
        .every(1s)
        // Align the window boundaries to be on the second.
        .align()
    |last('value')

// Calculate the top 15 scores per game
var topScores = topPlayerScores
    |groupBy('game')
    |top(15, 'last', 'player')

// Expose top scores over the HTTP API at the 'top_scores' endpoint.
// Now your app can just request the top scores from Kapacitor
// and always get the most recent result.
//
// http://localhost:9092/kapacitor/v1/tasks/top_scores/top_scores
topScores
   |httpOut('top_scores')

// Sample the top scores and keep a score once every 10s
var topScoresSampled = topScores
    |sample(10s)

// Store top fifteen player scores in InfluxDB.
topScoresSampled
    |influxDBOut()
        .database('game')
        .measurement('top_scores')

// Calculate the max and min of the top scores.
var max = topScoresSampled
    |max('top')

var min = topScoresSampled
    |min('top')

// Join the max and min streams back together and calculate the gap.
max
    |join(min)
        .as('max', 'min')
    // calculate the difference between the max and min scores.
    |eval(lambda: "max.max" - "min.min", lambda: "max.max", lambda: "min.min")
        .as('gap', 'topFirst', 'topLast')
    // store the fields: gap, topFirst, and topLast in InfluxDB.
    |influxDBOut()
        .database('game')
        .measurement('top_scores_gap')
```

Define and enable our task to see it in action:

```bash
kapacitor define top_scores -tick top_scores.tick
kapacitor enable top_scores
```

First  let's check that the HTTP output is working.

```bash
curl 'http://localhost:9092/kapacitor/v1/tasks/top_scores/top_scores'
```

You should have a JSON result of the top 15 players and their scores per game.
Hit the endpoint several times to see that the scores are updating once a second.

Now, let's check InfluxDB to see our historical data.

```bash
curl \
    -G 'http://localhost:8086/query?db=game' \
    --data-urlencode 'q=SELECT * FROM top_scores  WHERE time > now() - 5m GROUP BY game'

curl \
    -G 'http://localhost:8086/query?db=game' \
    --data-urlencode 'q=SELECT * FROM top_scores_gap WHERE time > now() - 5m GROUP BY game'
```

Great!
The hard work is done.
All that remains is configuring the game server to send score updates to Kapacitor and update the spectator dashboard to pull scores from Kapacitor.
