<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <url>
        <loc>{{ url('/') }}</loc>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>{{ url('/about') }}</loc>
        <lastmod>{{ now()->subDays(7)->toAtomString() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    @foreach ($categories as $category)
    <url>
        <loc>{{ url('/category/' . $category->slug) }}</loc>
        <lastmod>{{ $category->updated_at->toAtomString() }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    @endforeach
    @foreach ($products as $product)
    <url>
        <loc>{{ url('/product/' . $product->slug) }}</loc>
        <lastmod>{{ $product->updated_at->toAtomString() }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
        @if($product->image_main)
        <image:image>
            <image:loc>{{ url($product->image_main) }}</image:loc>
            <image:title>{{ $product->name }}</image:title>
            @if($product->description)
            <image:caption>{{ \Illuminate\Support\Str::limit(strip_tags($product->description), 200) }}</image:caption>
            @endif
        </image:image>
        @endif
        @foreach($product->additionalImages ?? [] as $image)
        <image:image>
            <image:loc>{{ url($image->url) }}</image:loc>
            <image:title>{{ $product->name }} - изображение {{ $loop->iteration + 1 }}</image:title>
            @if($image->alt_text)
            <image:caption>{{ $image->alt_text }}</image:caption>
            @endif
        </image:image>
        @endforeach
    </url>
    @endforeach
</urlset>
