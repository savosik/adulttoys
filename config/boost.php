<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Laravel Boost MCP Server Configuration
    |--------------------------------------------------------------------------
    |
    | This configuration controls how the Laravel Boost MCP (Model Context Protocol)
    | server runs and interacts with your Laravel application.
    |
    */

    'mcp' => [
        'enabled' => true,
        
        /*
        | Command to run the MCP server
        | For Docker: ["docker-compose", "exec", "app", "php", "artisan", "boost:mcp"]
        | For Sail: ["./vendor/bin/sail", "artisan", "boost:mcp"]
        | For standard: ["php", "artisan", "boost:mcp"]
        */
        'command' => ['docker-compose', 'exec', '-T', 'app', 'php', 'artisan', 'boost:mcp'],
    ],

    /*
    |--------------------------------------------------------------------------
    | AI Guidelines
    |--------------------------------------------------------------------------
    |
    | Enable AI-specific guidelines for your Laravel version and dependencies.
    |
    */

    'guidelines' => [
        'enabled' => true,
        'framework_version' => '11.x',
    ],

    /*
    |--------------------------------------------------------------------------
    | Documentation API
    |--------------------------------------------------------------------------
    |
    | Laravel Boost can provide version-specific documentation to AI assistants.
    |
    */

    'documentation' => [
        'enabled' => true,
        'cache_ttl' => 3600, // 1 hour
    ],
];
