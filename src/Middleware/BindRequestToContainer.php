<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Middleware;

use Illuminate\Contracts\Container\Container;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class BindRequestToContainer implements MiddlewareInterface
{
    protected $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        // This is used in order to make the request available to the `SaveReactionsToDatabase` listener.
        // TODO: Remove this once we have a better way to do this (v2.0?)
        $this->container->instance('fof-reactions.request', $request);

        return $handler->handle($request);
    }
}
