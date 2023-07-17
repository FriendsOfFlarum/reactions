<?php

namespace FoF\Reactions\Middleware;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Illuminate\Contracts\Container\Container;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;

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
