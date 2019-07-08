<?php

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        /**
         * @var \Flarum\Settings\SettingsRepositoryInterface
         */
        $settings = app('flarum.settings');

        $keys = ['convertToUpvote', 'convertToDownvote', 'convertToLike'];

        foreach ($keys as $key) {
            if ($value = $settings->get($full = "reflar.reactions.$key")) {
                $settings->set("fof-reactions.$key", $value);
                $settings->delete($full);
            }
        }
    },
];
