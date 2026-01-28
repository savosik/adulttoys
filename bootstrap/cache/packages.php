<?php return array (
  'inertiajs/inertia-laravel' => 
  array (
    'providers' => 
    array (
      0 => 'Inertia\\ServiceProvider',
    ),
  ),
  'laravel/boost' => 
  array (
    'providers' => 
    array (
      0 => 'Laravel\\Boost\\BoostServiceProvider',
    ),
  ),
  'laravel/mcp' => 
  array (
    'aliases' => 
    array (
      'Mcp' => 'Laravel\\Mcp\\Server\\Facades\\Mcp',
    ),
    'providers' => 
    array (
      0 => 'Laravel\\Mcp\\Server\\McpServiceProvider',
    ),
  ),
  'laravel/reverb' => 
  array (
    'aliases' => 
    array (
      'Output' => 'Laravel\\Reverb\\Output',
    ),
    'providers' => 
    array (
      0 => 'Laravel\\Reverb\\ApplicationManagerServiceProvider',
      1 => 'Laravel\\Reverb\\ReverbServiceProvider',
    ),
  ),
  'laravel/roster' => 
  array (
    'providers' => 
    array (
      0 => 'Laravel\\Roster\\RosterServiceProvider',
    ),
  ),
  'laravel/sail' => 
  array (
    'providers' => 
    array (
      0 => 'Laravel\\Sail\\SailServiceProvider',
    ),
  ),
  'laravel/sanctum' => 
  array (
    'providers' => 
    array (
      0 => 'Laravel\\Sanctum\\SanctumServiceProvider',
    ),
  ),
  'laravel/scout' => 
  array (
    'providers' => 
    array (
      0 => 'Laravel\\Scout\\ScoutServiceProvider',
    ),
  ),
  'laravel/tinker' => 
  array (
    'providers' => 
    array (
      0 => 'Laravel\\Tinker\\TinkerServiceProvider',
    ),
  ),
  'nesbot/carbon' => 
  array (
    'providers' => 
    array (
      0 => 'Carbon\\Laravel\\ServiceProvider',
    ),
  ),
  'neuron-core/neuron-laravel' => 
  array (
    'aliases' => 
    array (
      'AIProvider' => 'NeuronAI\\Laravel\\Facades\\AIProvider',
      'VectorStore' => 'NeuronAI\\Laravel\\Facades\\VectorStore',
      'EmbeddingProvider' => 'NeuronAI\\Laravel\\Facades\\EmbeddingProvider',
    ),
    'providers' => 
    array (
      0 => 'NeuronAI\\Laravel\\NeuronAIServiceProvider',
    ),
  ),
  'nunomaduro/collision' => 
  array (
    'providers' => 
    array (
      0 => 'NunoMaduro\\Collision\\Adapters\\Laravel\\CollisionServiceProvider',
    ),
  ),
  'nunomaduro/termwind' => 
  array (
    'providers' => 
    array (
      0 => 'Termwind\\Laravel\\TermwindServiceProvider',
    ),
  ),
);