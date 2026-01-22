<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        
        <meta name="description" content="@yield('meta_description', $page['props']['meta']['description'] ?? '')">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="@yield('meta_title', $page['props']['meta']['title'] ?? config('app.name', 'Laravel'))">
        <meta property="og:description" content="@yield('meta_description', $page['props']['meta']['description'] ?? '')">
        <meta property="og:image" content="@yield('og_image', $page['props']['meta']['og_image'] ?? asset('logo.svg'))">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{{ url()->current() }}">
        <meta property="twitter:title" content="@yield('meta_title', $page['props']['meta']['title'] ?? config('app.name', 'Laravel'))">
        <meta property="twitter:description" content="@yield('meta_description', $page['props']['meta']['description'] ?? '')">
        <meta property="twitter:image" content="@yield('og_image', $page['props']['meta']['og_image'] ?? asset('logo.svg'))">

        <!-- Scripts -->
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
