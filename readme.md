# Rekognition Bot for Slack

### What you will need

This bot uses AWS Rekognition service for image recognition - therefore you will need an AWS account.

A slack team with access to add custom integrations/ bots

### Getting started

Clone this repo

Run `npm i` to install dependencies

Install the AWS CLI tools

Run `aws configure` if you haven't already - grant that use access to rekognition

Get a Slack bot api key

Rename secret.dummy.js to secrets.js and enter your Slack token there 

Run the script with `node dist/index.js`