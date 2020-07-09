/**
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    'License'); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const message = core.getInput('message');
    const client = new github.GitHub(
      core.getInput('repo-token', {required: true})
    );
    const context = github.context;
    const issueCtx = context.issue;

    let checkString;
    const issue = await client.issues.get({
      owner: issueCtx.owner,
      repo: issueCtx.repo,
      issue_number: issueCtx.number
    });
    console.log(`Issue body: ${issue.data.body}`);
    checkString = issue.data.body;
    if (checkMessageForRelease(issue.data.body)) {
      console.log('Close issue', issueCtx.number);
      // Close issues soley asking for release
      await client.issues.update({
        owner: issueCtx.owner,
        repo: issueCtx.repo,
        issue_number: issueCtx.number,
        state: 'closed'
      });
    }

    const {data: comments} = await client.issues.listComments({
      owner: issueCtx.owner,
      repo: issueCtx.repo,
      issue_number: issueCtx.number
    });
    console.log(comments);
    const lastComment = comments[comments.length];
    console.debug('Last comment author', lastComment?.user.login);
    checkString = lastComment?.body;

    console.log('Check body', checkString);

    if (checkMessageForRelease(checkString)) {
      console.log(`Adding message: ${message} to issue ${issueCtx.number}`);
      await client.issues.createComment({
        owner: issueCtx.owner,
        repo: issueCtx.repo,
        issue_number: issueCtx.number,
        body: message
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

function checkMessageForRelease(checkString) {
  ///release/g.test(checkString) ||
  return /npm/g.test(checkMessageForRelease);
}

run();
