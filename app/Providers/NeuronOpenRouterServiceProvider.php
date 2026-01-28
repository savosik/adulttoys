<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use NeuronAI\Laravel\AIProviderManager;
use NeuronAI\Providers\OpenAILike;

class NeuronOpenRouterServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->app->make(AIProviderManager::class)->extend('openrouter', function ($app) {
            $config = config('neuron.provider.openrouter');
            return new OpenAILike(
                baseUri: $config['base_uri'],
                key: $config['key'],
                model: $config['model'],
            );
        });
    }
}
