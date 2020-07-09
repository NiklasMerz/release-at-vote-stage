# Release Voting Notifier

At Apache Cordova it happens very often that users ask for releases because a new tag has been created while preparing releases. This action will send an automatic reply that a release is currently in progress.

This action will comment on issues and comments created that are detected as "asking for release" if the user is not a member. If a new issue is created it will be closed.

The action checks these [keywords](https://github.com/NiklasMerz/release-at-vote-stage/blob/da35b2a6b60728338be59caa2b607fef045419c6/src/main.js#L74)

You can test it by creating issues here: https://github.com/NiklasMerz/release-test/issues
