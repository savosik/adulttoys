<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia><?php echo e(config('app.name', 'Laravel')); ?></title>
        
        <!-- Canonical URL -->
        <link rel="canonical" href="<?php echo e(url()->current()); ?>">
        
        <meta name="description" content="<?php echo $__env->yieldContent('meta_description', $page['props']['meta']['description'] ?? ''); ?>">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="<?php echo e(url()->current()); ?>">
        <meta property="og:title" content="<?php echo $__env->yieldContent('meta_title', $page['props']['meta']['title'] ?? config('app.name', 'Laravel')); ?>">
        <meta property="og:description" content="<?php echo $__env->yieldContent('meta_description', $page['props']['meta']['description'] ?? ''); ?>">
        <meta property="og:image" content="<?php echo $__env->yieldContent('og_image', $page['props']['meta']['og_image'] ?? asset('logo.svg')); ?>">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="<?php echo e(url()->current()); ?>">
        <meta property="twitter:title" content="<?php echo $__env->yieldContent('meta_title', $page['props']['meta']['title'] ?? config('app.name', 'Laravel')); ?>">
        <meta property="twitter:description" content="<?php echo $__env->yieldContent('meta_description', $page['props']['meta']['description'] ?? ''); ?>">
        <meta property="twitter:image" content="<?php echo $__env->yieldContent('og_image', $page['props']['meta']['og_image'] ?? asset('logo.svg')); ?>">

        <!-- Preload critical resources for LCP optimization -->
        <?php if(isset($page['props']['product']) && $page['props']['product']['image_main']): ?>
        <link rel="preload" as="image" href="<?php echo e($page['props']['product']['image_main']); ?>" fetchpriority="high">
        <?php endif; ?>

        <!-- Scripts -->
        <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
        <?php echo app('Illuminate\Foundation\Vite')(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"]); ?>
        <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->head; } ?>
    </head>
    <body class="font-sans antialiased">
        <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->body; } else { ?><div id="app" data-page="<?php echo e(json_encode($page)); ?>"></div><?php } ?>
    </body>
</html>
<?php /**PATH /var/www/resources/views/app.blade.php ENDPATH**/ ?>