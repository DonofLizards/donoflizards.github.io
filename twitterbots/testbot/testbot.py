#!/usr/bin/python
# -*- coding: utf-8 -*-

import tweepy, time, sys
 
 # The first argument passed to the Python script should be the text file containing what we want our bot to say.
argfile = str(sys.argv[1]) 
 
 # Authentication keys are stored in a separate text file for security reasons. Here we're just opening that file, getting a list of the keys and chopping off newlines. 
textFile = open("secret.txt", "r") 
apiKeys = textFile.readlines()
textFile.close()

index = 0
while index < len(apiKeys):
	for item in apiKeys:
		strippedItem = item.rstrip()
		apiKeys[index] = strippedItem
		index += 1

# Now we can get the various authentication keys required and authenticate! 
consumerKey = apiKeys[0]
consumerSecret = apiKeys[1]
accessKey = apiKeys[2]
accessSecret = apiKeys[3]
auth = tweepy.OAuthHandler(consumerKey, consumerSecret)
auth.set_access_token(accessKey, accessSecret)
api = tweepy.API(auth)

 
 # Read content for our bot!
filename = open(argfile, "r") 
botTextContent = filename.readlines()
filename.close()
 
for line in botTextContent:
	api.update_status(line)
	time.sleep(900) # Tweet every 15 minutes.

