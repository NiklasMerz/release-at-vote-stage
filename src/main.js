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

    if (checkAuthor(issue.data.author_association)) {
      return;
    }

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
    const lastComment = comments[comments.length - 1];

    if (checkAuthor(lastComment?.author_association)) {
      return;
    }

    if (lastComment?.body) {
      checkString = lastComment?.body;
    }

    console.log('Check body:', checkString);

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
  let penalty = 0;
   if (/npm/g.test(checkString)) {
    penalty += 5;
   }
   if (/release/g.test(checkString)) {
    penalty += 3;
   }
   if (/new version/g.test(checkString)) {
    penalty += 2;
   }
   if (/tag/g.test(checkString)) {
    penalty += 2;
   }

  return penalty > 5;
}

function checkAuthor(association) {
  const permittedRoles = ['OWNER', 'COLLABORATOR', 'MEMBER'];
  if (permittedRoles.indexOf(association)) {
    console.log('Do not comment on members comments and issues');
    return true;
  } else {
    return false;
  }
}

run();
