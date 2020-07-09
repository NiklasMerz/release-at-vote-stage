"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const core = require('@actions/core');
const github = require('@actions/github');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const message = core.getInput('message');
            const client = new github.GitHub(core.getInput('repo-token', { required: true }));
            const context = github.context;
            const issue = context.issue;
            const issueBody = (yield client.issues.get({
                owner: issue.owner,
                repo: issue.repo,
                issue_number: issue.number,
                body: message
            })).body;
            console.log(`issue body ${issueBody}`);
            console.log(`Adding message: ${message} to issue ${issue.number}`);
            yield client.issues.createComment({
                owner: issue.owner,
                repo: issue.repo,
                issue_number: issue.number,
                body: message
            });
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
