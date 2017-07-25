<?php

/**
 *  This file is part of reflar/reactions
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */


namespace Reflar\Reactions\Listener;

use DirectoryIterator;
use Flarum\Event\ConfigureClientView;
use Flarum\Event\ConfigureLocales;
use Illuminate\Contracts\Events\Dispatcher;

class AddClientAssets
{
    /**
     * Subscribes to the Flarum events.
     *
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureClientView::class, [$this, 'addAdminAssets']);
        $events->listen(ConfigureClientView::class, [$this, 'addForumAssets']);
//        $events->listen(ConfigureLocales::class, [$this, 'addLocales']);
    }

    /**
     * Modifies the client view for admin.
     *
     * @param ConfigureClientView $event
     */
    public function addAdminAssets(ConfigureClientView $event)
    {
        if ($event->isAdmin()) {
            $event->addAssets([
                __DIR__.'/../../js/admin/dist/extension.js',
            ]);
            $event->addBootstrapper('reflar/reactions/main');
        }
    }

    /**
     * Modifies the client view for forum.
     *
     * @param ConfigureClientView $event
     */
    public function addForumAssets(ConfigureClientView $event)
    {
        if ($event->isForum()) {
            $event->addAssets([
                __DIR__.'/../../js/forum/dist/extension.js',
                __DIR__.'/../../less/app.less',
            ]);
            $event->addBootstrapper('reflar/reactions/main');
        }
    }

    /**
     * Provides i18n files.
     *
     * @param ConfigureLocales $event
     */
    public function addLocales(ConfigureLocales $event)
    {
        foreach (new DirectoryIterator(__DIR__.'/../../locale') as $file) {
            if ($file->isFile() && in_array($file->getExtension(), ['yml', 'yaml'])) {
                $event->locales->addTranslations($file->getBasename('.'.$file->getExtension()), $file->getPathname());
            }
        }
    }
}
