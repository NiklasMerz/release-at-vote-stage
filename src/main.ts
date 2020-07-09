/**
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
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
    console.log(`Hello ${message} from inside a container`);

    const issue: {owner: string; repo: string; number: number} = context.issue;
    console.log(`Adding message: ${message} to issue ${issue.number}`);
    await client.issues.createComment({
      owner: issue.owner,
      repo: issue.repo,
      issue_number: issue.number,
      body: message
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
