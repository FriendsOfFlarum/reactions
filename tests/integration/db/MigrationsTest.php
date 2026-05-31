<?php

namespace FoF\Reactions\Tests\integration\db;

use Flarum\Extension\ExtensionManager;
use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;

class MigrationsTest extends TestCase
{

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-reactions');
    }

    #[Test]
    public function it_rolls_back_migrations_without_errors(): void
    {
        // Boot the app so the extension is installed and migrated.
        $this->app();

        // Run down migrations for fof/reactions -- should not throw any exceptions.
        $extensionManager = resolve(ExtensionManager::class);
        $extensionManager->uninstall('fof-reactions');

        // If no error occurred, the test will pass.
        $this->addToAssertionCount(1);
    }
}
