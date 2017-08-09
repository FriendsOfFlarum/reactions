# Reactions by ReFlar

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://gitlab.com/ReFlar/reactions/blob/master/LICENSE) [![Latest Stable Version](https://img.shields.io/packagist/v/reflar/reactions.svg)](https://gitlab.com/ReFlar/reactions)

A [Flarum](http://flarum.org) extension that adds reactions to your Flarum Community!

### Usage

- Just click the react button when hovering over a post, and choose the reaction!
- Custom reactions can be easily added via the admin page
- Integration with Likes and Gamification

### Installation

Install it with composer:

```bash
composer require reflar/reactions
```

Then login and enable the extension.

You can optionally convert a specific reaction into likes and two reactions into upvotes and downvotes.

### Developer Guide

You have 2 events to listen for `PostWasReacted` as well as `PostWasUnreacted` which both contain the post and reactor, and `PostWasReacted` includes the reaction identifier.

### Issues

- [Open an issue on Gitlab](https://gitlab.com/ReFlar/reactions/issues)

### Links

- [GitLab](https://gitlab.com/ReFlar/reactions)
- [Packagist](https://packagist.org/packages/ReFlar/reactions)
