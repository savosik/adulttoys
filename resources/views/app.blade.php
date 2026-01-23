<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ ($page['props']['meta']['title'] ?? config('app.name', 'Laravel')) . ' - ' . config('app.name', 'Laravel') }}</title>
        
        <!-- Canonical URL -->
        <link rel="canonical" href="{{ url()->current() }}">
        
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

        <!-- Preload critical resources for LCP optimization -->
        @if(isset($page['props']['product']) && $page['props']['product']['image_main'])
        <link rel="preload" as="image" href="{{ $page['props']['product']['image_main'] }}" fetchpriority="high">
        @endif

        <!-- Preload CSS to prevent FOUC -->
        @production
        <link rel="preload" as="style" href="{{ asset('build/assets/app.css') }}">
        <link rel="stylesheet" href="{{ asset('build/assets/app.css') }}">
        @else
        <link rel="preload" as="style" href="http://localhost:5173/resources/css/app.css">
        <link rel="stylesheet" href="http://localhost:5173/resources/css/app.css">
        @endproduction

        <!-- Critical inline CSS to prevent layout shift -->
        <style>
            /* Prevent FOUC - basic reset and layout */
            *,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
            html{line-height:1.5;-webkit-text-size-adjust:100%;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif}
            body{margin:0;line-height:inherit;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial}
            /* Prevent content jump */
            #app{min-height:100vh}
        </style>

        <!-- Scripts -->
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
