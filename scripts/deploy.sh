#!/bin/bash

SCRIPT_PATH=`realpath $0`
SCRIPT_DIR=`dirname $SCRIPT_PATH`
BASE=`realpath $SCRIPT_DIR/../`

# $1: node-sass output style
deploy ()
{
  cd $BASE
  git stash
  git stash drop
  git checkout master
  git pull origin master

  cd $BASE/apps/fwo_reports
  npm install
  npm run webpack

  cd $BASE/apps/fwo_reports_api
  npm install
  rm public -f
  ln -s ../fwo_reports/public .
}

if [ $1 = "dev" ]
then
  exit
fi

if [ $1 = "uat" ]
then
  deploy
fi

if [ $1 = "prod" ]
then
  exit
fi
